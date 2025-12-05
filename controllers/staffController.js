// File: controllers/staffController.js

// Staff model
const staffModel = require('../models/staffModel');

// Get add staff page
const getAddStaffPage = (req, res) => {
    res.render('add-staff');
}

// Get all staff
const getAllStaff = async (req, res) => {
    try {
        const staffs = await staffModel.getAllStaff();
        console.log(staffs);

        res.render('all-staff', { staffs });
    } catch (error) {
        console.log(error);
    }
}

// Add staff to payroll
const addStaff = async (req, res) => {
    try {
        const { staffName, email, phone, address, salary, level } = req.body;

        // Check if all details were provided
        if (!staffName || !email || !phone || !address || !salary || !level) {
            req.flash('error_msg', 'Please provide all details');
            return res.redirect('/staff/add');
        }

        await staffModel.addStaff(staffName, email, phone, address, salary, level);

        console.log('Staff added successfully');
        req.flash('success_msg', 'Staff added successfully');
        return res.redirect('/staff/all');
    } catch (error) {
        console.log(error);
        req.flash('error_msg', 'Error adding staff');
        return res.redirect('/staff/add');
    }
}

// Get update staff page
const getUpdateStaffPage = async (req, res) => {
    try {
        const { payrollId } = req.params;

        const staff = await staffModel.getStaffByPayrollId(payrollId);
        console.log(staff);

        res.render('update-staff', { staff });
    } catch (error) {
        console.log(error);
    }
}

// Update staff
const updateStaff = async (req, res) => {
    try {
        const { staffName, email, phone, address, salary, level } = req.body;
        const { payrollId } = req.params;

        // Check if all details were provided
        if (!staffName || !email || !phone || !address || !salary || !level) {
            req.flash('error_msg', 'Please provide all details');
            return res.redirect('/staff/all');
        }

        await staffModel.updateStaff(staffName, email, phone, address, salary, level, payrollId);

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