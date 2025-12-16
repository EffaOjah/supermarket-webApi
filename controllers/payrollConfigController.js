const payrollConfigModel = require('../models/payrollConfigModel');

// ==================== PAGES ====================

const getStructureSetupPage = async (req, res) => {
    try {
        const structures = await payrollConfigModel.getAllStructures();
        const components = await payrollConfigModel.getAllComponents();
        res.render('payroll/structure-setup', { structures, components });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to load configuration page');
        res.redirect('/admin/dashboard');
    }
};

const getStructureDetailsPage = async (req, res) => {
    try {
        const { id } = req.params;
        const structure = await payrollConfigModel.getStructureById(id);
        const structureComponents = await payrollConfigModel.getStructureComponents(id);
        const allComponents = await payrollConfigModel.getAllComponents();

        res.render('payroll/structure-details', { structure, structureComponents, allComponents });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to load structure details');
        res.redirect('/payroll/setup');
    }
};

// ==================== ACTIONS ====================

const createStructure = async (req, res) => {
    try {
        const { name, description, frequency } = req.body;
        await payrollConfigModel.createStructure({ name, description, frequency, currency: 'NGN' });
        req.flash('success_msg', 'Salary structure created!');
        res.redirect('/payroll/setup');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to create structure');
        res.redirect('/payroll/setup');
    }
};

const createComponent = async (req, res) => {
    try {
        const { name, type, isTaxable, isFixed } = req.body; // isfixed checkbox
        await payrollConfigModel.createComponent({
            name,
            type,
            isTaxable: isTaxable ? 1 : 0,
            isFixed: isFixed ? 1 : 0
        });
        req.flash('success_msg', 'Salary component created!');
        res.redirect('/payroll/setup');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to create component');
        res.redirect('/payroll/setup');
    }
};

const addComponentToStructure = async (req, res) => {
    try {
        const { structureId, componentId, amount, percentage } = req.body;
        await payrollConfigModel.addComponentToStructure({
            structureId,
            componentId,
            defaultAmount: amount || 0,
            percentageOfBasic: percentage || 0
        });
        req.flash('success_msg', 'Component added to structure');
        res.redirect(`/payroll/structure/${structureId}`);
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to add component');
        res.redirect('back');
    }
};

const deleteStructure = async (req, res) => {
    try {
        const { id } = req.params;
        await payrollConfigModel.deleteStructure(id);
        req.flash('success_msg', 'Salary structure deleted successfully');
        res.redirect('/payroll/setup');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to delete structure. It may be in use.');
        res.redirect('/payroll/setup');
    }
};

const deleteComponent = async (req, res) => {
    try {
        const { id } = req.params;
        await payrollConfigModel.deleteComponent(id);
        req.flash('success_msg', 'Salary component deleted successfully');
        res.redirect('/payroll/setup');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to delete component. It may be in use.');
        res.redirect('/payroll/setup');
    }
};

const removeComponentFromStructure = async (req, res) => {
    try {
        const { structureId, componentId } = req.body;
        await payrollConfigModel.removeComponentFromStructure(structureId, componentId);
        req.flash('success_msg', 'Component removed from structure');
        res.redirect(`/payroll/structure/${structureId}`);
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to remove component');
        res.redirect('back');
    }
};

module.exports = {
    getStructureSetupPage,
    getStructureDetailsPage,
    createStructure,
    createComponent,
    addComponentToStructure,
    deleteStructure,
    deleteComponent,
    removeComponentFromStructure
};
