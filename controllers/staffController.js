// File: controllers/staffController.js

// Staff model
const staffModel = require('../models/staffModel');
const payrollConfigModel = require('../models/payrollConfigModel');

// Get add staff page
const getAddStaffPage = async (req, res) => {
    try {
        const structures = await payrollConfigModel.getAllStructures();
        res.render('add-staff', { structures });
    } catch (error) {
        console.error(error);
        res.render('add-staff', { structures: [] });
    }
}

// Get all staff
const getAllStaff = async (req, res) => {
    try {
        const staffs = await staffModel.getAllStaff();
        res.render('all-staff', { staffs });
    } catch (error) {
        console.log(error);
        req.flash('error_msg', 'Error fetching staff list');
        res.redirect('/admin/dashboard');
    }
}

// Add staff to payroll
const addStaff = async (req, res) => {
    try {
        const {
            firstName, lastName, email, phone, address,
            department, jobRole, bankName, accountNumber, accountName,
            taxId, pensionId, structureId, basicSalary
        } = req.body;

        // Check required details
        if (!firstName || !lastName || !email || !jobRole) {
            req.flash('error_msg', 'Please provide at least Name, Email and Job Role');
            return res.redirect('/staff/add');
        }

        // Generate Staff ID
        const staffId = 'EMP' + Date.now().toString().slice(-6);

        const employeeData = {
            staffId, firstName, lastName, email, phone, address,
            department, jobRole, bankName, accountNumber, accountName,
            taxId, pensionId, structureId, basicSalary
        };

        await staffModel.addStaff(employeeData);

        console.log('Staff added successfully');
        req.flash('success_msg', 'Staff added successfully');
        return res.redirect('/staff/all');
    } catch (error) {
        console.log(error);
        req.flash('error_msg', 'Error adding staff: ' + error.message);
        return res.redirect('/staff/add');
    }
}

// Get update staff page
const getUpdateStaffPage = async (req, res) => {
    try {
        const { payrollId } = req.params; // Note: route uses :payrollId but we treat it as employeeId now

        const staff = await staffModel.getStaffById(payrollId);
        const structures = await payrollConfigModel.getAllStructures();

        if (!staff || staff.length === 0) {
            req.flash('error_msg', 'Staff not found');
            return res.redirect('/staff/all');
        }

        res.render('update-staff', { staff: staff[0], structures });
    } catch (error) {
        console.log(error);
        req.flash('error_msg', 'Error fetching staff details');
        res.redirect('/staff/all');
    }
}

// Update staff
const updateStaff = async (req, res) => {
    try {
        const {
            firstName, lastName, email, phone, address,
            department, jobRole, bankName, accountNumber, accountName,
            taxId, pensionId, structureId, basicSalary
        } = req.body;
        const { payrollId } = req.params; // This is employeeId

        const employeeData = {
            firstName, lastName, email, phone, address,
            department, jobRole, bankName, accountNumber, accountName,
            taxId, pensionId, structureId, basicSalary
        };

        await staffModel.updateStaff(payrollId, employeeData);

        console.log('Staff updated successfully');
        req.flash('success_msg', 'Staff updated successfully');
        return res.redirect('/staff/all');
    } catch (error) {
        console.log(error);
        req.flash('error_msg', 'Error updating staff');
        return res.redirect('/staff/all');
    }
}


module.exports = { getAddStaffPage, getAllStaff, addStaff, getUpdateStaffPage, updateStaff };