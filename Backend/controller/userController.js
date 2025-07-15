import { supabase } from '../config/db.js';


//  Get all students (using async/await)
export const getStudents = async (req, res) => {
    try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
};



// Add new student (using async/await)
export const addStudent = async (req, res) => {
    const { Name, PRN, Department, Email } = req.body;

    try {
        const { error } = await supabase.from('users').insert([{ Name, PRN, Department, Email }]);
        if (error) throw error;

        res.json({ message: 'Student added successfully' });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
};

//update student
export const updateStudent = async (req, res) => {
    const { Name, PRN, Department, Email } = req.body;

    try {
        const { data, error } = await supabase
            .from('users')
            .update({ Name, Department, Email })
            .eq('PRN', PRN)
            .select();

        if (error) throw error;
        if (!data.length) return res.status(404).json({ message: 'Student not found' });

        res.json({ message: 'Student updated successfully' });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
};


//delete student
export const deleteStudent = async (req, res) => {
    const { PRN } = req.params;

    try {
        const { data, error } = await supabase
            .from('users')
            .delete()
            .eq('PRN', PRN)
            .select();

        if (error) throw error;
        if (!data.length) return res.status(404).json({ message: 'Student not found' });

        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
};
