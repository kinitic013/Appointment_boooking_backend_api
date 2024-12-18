const bcrypt = require('bcrypt');
const runQuery = require('../utils/runQuery');
const db = require('../models/database.js');
const getAllQuery = require("../utils/runAll.js")

const saltRounds = 10;

module.exports.studentSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const sql = `INSERT INTO student (name, email, password) VALUES (?, ?, ?)`;
        const result = await runQuery(sql, [name, email, hashedPassword]);

        res.status(201).json({
            student_id: result.lastID,
            name,
            email,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Signup failed' });
    }
};
module.exports.studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const sql = `SELECT * FROM student WHERE email = ?`;
        const result = await getAllQuery(sql,[email]);
        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }
        const student = result[0];
        // console.log(student);
        const match = await bcrypt.compare(password, student.password);

        if (match) {
            const { password, ...userWithoutPassword } = student;
            res.status(200).json(userWithoutPassword);
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
};

module.exports.professorSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const sql = `INSERT INTO professor (name, email, password) VALUES (?, ?, ?)`;
        const result = await runQuery(sql, [name, email, hashedPassword]);

        res.status(201).json({
            professor_id: result.lastID,
            name,
            email,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Signup failed' });
    }
};

module.exports.professorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const sql = `SELECT * FROM professor WHERE email = ?`;
        const result = await getAllQuery(sql,[email]);

        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }
        const professor = result[0];
        const match = await bcrypt.compare(password, professor.password);

        if (match) {
            const { password, ...userWithoutPassword } = professor;
            res.status(200).json(userWithoutPassword);
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
};

module.exports.logout = (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};
