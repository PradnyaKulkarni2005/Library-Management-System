import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../config/db.js"; // Supabase client

export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Fetch admin user from Supabase
        const { data, error } = await supabase
            .from("admin")
            .select("*")
            .eq("username", username)
            .single(); // since usernames are unique

        if (error || !data) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const adminUser = data;

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, adminUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Create JWT
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
