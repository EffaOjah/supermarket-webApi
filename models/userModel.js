const db = require('../config/dbConfig');

const findUserByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

const createUser = async (email, username, password) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO users (email, username, password) VALUES(?, ?, ?)', [email, username, password], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};


const findUserById = async (id) => {
    const [rows] = await db.query(
        'SELECT id, name, email FROM users WHERE id = ?',
        [id]
    );
    return rows[0];
};

module.exports = { findUserByEmail, createUser };