const db = require('../config/db');

// ✅ Get all students (using async/await)
exports.getStudents = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM users');
        res.json(results); 
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
};


// Add new student (using async/await)
exports.addStudent = async (req, res) => {
    const { Name, PRN, Department, Email } = req.body;

    try {
        const [result] = await db.query('INSERT INTO users SET ?', {
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
//update student
exports.updateStudent = async (req, res) => {
    const { Name, PRN, Department, Email } = req.body;

    try {
        const [result] = await db.query('UPDATE users SET ? WHERE PRN = ?', [
            { Name, Department, Email },
            PRN
        ]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student updated successfully' });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
};

//delete student
exports.deleteStudent = async (req, res) => {
    const { PRN } = req.params;

    try {
        const [result] = await db.query('DELETE FROM users WHERE PRN = ?', [PRN]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
};
