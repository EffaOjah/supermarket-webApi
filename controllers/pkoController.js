const BranchModel = require('../models/branchModel');

const getPKODashboard = async (req, res) => {
    try {
        const branches = await BranchModel.getAllBranches();
        res.render('pko/dashboard', {
            branches,
            user: req.user,
            title: 'PKO Dashboard'
        });
    } catch (error) {
        console.error('Error fetching branches for PKO:', error);
        res.render('error-page');
    }
};

module.exports = {
    getPKODashboard
};
