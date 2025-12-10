const attendanceModel = require('../models/attendanceModel');
const staffModel = require('../models/staffModel');

// Page: Attendance Dashboard (Admin/Personal)
const getAttendancePage = async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();

        // For now, let's assume standard admin view showing today's attendance
        const dailyAttendance = await attendanceModel.getDailyAttendance(today);
        const allStaff = await staffModel.getAllStaff(); // To simulate clock-in for any staff (for testing)

        res.render('attendance/view', { dailyAttendance, allStaff, today });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to load attendance');
        res.redirect('/admin/dashboard');
    }
};

// Action: Clock In
const clockIn = async (req, res) => {
    try {
        const { employeeId } = req.body;
        await attendanceModel.clockIn(employeeId);
        req.flash('success_msg', 'Clocked in successfully');
        res.redirect('/attendance');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', error.message);
        res.redirect('/attendance');
    }
};

// Action: Clock Out
const clockOut = async (req, res) => {
    try {
        const { employeeId } = req.body;
        await attendanceModel.clockOut(employeeId);
        req.flash('success_msg', 'Clocked out successfully');
        res.redirect('/attendance');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', error.message);
        res.redirect('/attendance');
    }
};

module.exports = {
    getAttendancePage,
    clockIn,
    clockOut
};
