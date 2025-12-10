const leaveModel = require('../models/leaveModel');
const staffModel = require('../models/staffModel');

// Page: Apply for Leave
const getApplyLeavePage = async (req, res) => {
    // In a real app, we'd get the logged-in employee from session.
    // For this demo, we might need to select which employee we are applying for, or assume a test user?
    // Let's pass all employees to select one (Admin mode) or just show the form.
    try {
        const employees = await staffModel.getAllStaff();
        res.render('leave/apply', { employees });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error loading form');
        res.redirect('/admin/dashboard');
    }
};

// Page: Manage Leaves (Admin)
const getManageLeavesPage = async (req, res) => {
    try {
        const leaves = await leaveModel.getAllLeaves();
        res.render('leave/manage', { leaves });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error loading leaves');
        res.redirect('/admin/dashboard');
    }
};

// Action: Submit Leave Request
const submitLeaveRequest = async (req, res) => {
    try {
        const { employeeId, leaveType, startDate, endDate, daysRequested, reason } = req.body;

        await leaveModel.createLeaveRequest({
            employeeId, leaveType, startDate, endDate, daysRequested, reason
        });

        req.flash('success_msg', 'Leave request submitted successfully');
        res.redirect('/leave/manage'); // Redirecting to manage page for demo purposes
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error submitting request');
        res.redirect('/leave/apply');
    }
};

// Action: Approve/Reject Leave
const updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const approvedBy = 1; // Mock Admin ID

        await leaveModel.updateLeaveStatus(id, status, approvedBy);

        req.flash('success_msg', `Leave request ${status}`);
        res.redirect('/leave/manage');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error updating status');
        res.redirect('/leave/manage');
    }
};

module.exports = {
    getApplyLeavePage,
    getManageLeavesPage,
    submitLeaveRequest,
    updateLeaveStatus
};
