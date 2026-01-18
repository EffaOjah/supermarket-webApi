const db = require('../config/dbConfig');

const findUserByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT users.*, store_branches.branch_name 
            FROM users 
            LEFT JOIN store_branches ON users.branch_id = store_branches.branch_id 
            WHERE users.email = ?
        `;
        db.query(query, [email], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

const createUser = async (email, username, password, branchId = null) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO users (email, username, password, branch_id) VALUES(?, ?, ?, ?)', [email, username, password, branchId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};


const findUserById = async (id) => {
    const [rows] = await db.query(
        'SELECT id, name, email, role, branch_id FROM users WHERE id = ?',
        [id]
    );
    return rows[0];
};

module.exports = { findUserByEmail, createUser };