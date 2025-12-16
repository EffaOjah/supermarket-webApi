const db = require('../config/dbConfig');

// ==================== SALARY COMPONENTS ====================

const getAllComponents = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM salary_components WHERE active = 1", (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const createComponent = (data) => {
    return new Promise((resolve, reject) => {
        const { name, type, isTaxable, isFixed } = data;
        db.query(
            "INSERT INTO salary_components (name, type, is_taxable, is_fixed) VALUES (?, ?, ?, ?)",
            [name, type, isTaxable, isFixed],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

// ==================== SALARY STRUCTURES ====================

const getAllStructures = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM salary_structures ORDER BY name", (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const createStructure = (data) => {
    return new Promise((resolve, reject) => {
        const { name, description, frequency, currency } = data;
        db.query(
            "INSERT INTO salary_structures (name, description, frequency, currency) VALUES (?, ?, ?, ?)",
            [name, description, frequency, currency],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const getStructureById = (id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM salary_structures WHERE structure_id = ?", [id], (err, result) => {
            if (err) reject(err);
            resolve(result[0]);
        });
    });
};

// ==================== STRUCTURE COMPONENTS (Linking) ====================

const addComponentToStructure = (data) => {
    return new Promise((resolve, reject) => {
        const { structureId, componentId, defaultAmount, percentageOfBasic } = data;
        db.query(
            "INSERT INTO salary_structure_components (structure_id, component_id, default_amount, percentage_of_basic) VALUES (?, ?, ?, ?)",
            [structureId, componentId, defaultAmount, percentageOfBasic],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

const getStructureComponents = (structureId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT ssc.*, sc.name, sc.type 
            FROM salary_structure_components ssc
            JOIN salary_components sc ON ssc.component_id = sc.component_id
            WHERE ssc.structure_id = ?
        `;
        db.query(query, [structureId], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

// ==================== DELETION METHODS ====================

const deleteStructure = (id) => {
    return new Promise((resolve, reject) => {
        // Note: Database constraints might restrict this if used in payroll runs
        db.query("DELETE FROM salary_structures WHERE structure_id = ?", [id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const deleteComponent = (id) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM salary_components WHERE component_id = ?", [id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const removeComponentFromStructure = (structureId, componentId) => {
    return new Promise((resolve, reject) => {
        db.query(
            "DELETE FROM salary_structure_components WHERE structure_id = ? AND component_id = ?",
            [structureId, componentId],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

module.exports = {
    getAllComponents,
    createComponent,
    getAllStructures,
    createStructure,
    getStructureById,
    addComponentToStructure,
    getStructureComponents,
    deleteStructure,
    deleteComponent,
    removeComponentFromStructure
};
