const db = require('../config/db');

// ✅ Get all students (using async/await)
exports.getStudents = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM Users');
        res.json(results);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// ✅ Add new student (using async/await)
exports.addStudent = async (req, res) => {
    const { Name, PRN, Department, Email } = req.body;

    try {
        const [result] = await db.query('INSERT INTO Users SET ?', {
            Name,
            PRN,
            Department,
            Email
        });
        res.json({ message: 'Student added successfully' });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
};
