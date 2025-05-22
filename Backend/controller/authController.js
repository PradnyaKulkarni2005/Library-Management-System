const bcrypt = require("bcrypt.js");
const jwt = require("jsonwebtoken");
const pool = require("../config/db"); // Ensure this is correctly imported

const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Fetch admin user from the database
        const [rows] = await pool.execute("SELECT * FROM admin WHERE username = ?", [username]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const adminUser = rows[0];

        // Compare entered password with stored hashed password
        const isPasswordValid = await bcrypt.compare(password, adminUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { adminId: adminUser.id, username: adminUser.username },
            process.env.JWT_SECRET || "your_secret_key",
            { expiresIn: "2h" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Admin Login Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { adminLogin };
