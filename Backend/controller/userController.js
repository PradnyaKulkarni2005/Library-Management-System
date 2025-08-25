import supabase from '../config/db.js';
import ExcelJS from "exceljs";
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
    const { name, prn, department, email } = req.body;

    try {
        const { error } = await supabase.from('users').insert([{ name, prn, department, email }]);
        if (error) throw error;

        res.json({ message: 'Student added successfully' });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
};

//update student
export const updateStudent = async (req, res) => {
    const { name, prn, department, email  } = req.body;

    try {
        const { data, error } = await supabase
            .from('users')
            .update({ name, department, email })
            .eq('prn', prn)
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
    const { prn } = req.params;

    try {
        const { data, error } = await supabase
            .from('users')
            .delete()
            .eq('prn',prn)
            .select();

        if (error) throw error;
        if (!data.length) return res.status(404).json({ message: 'Student not found' });

        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
};
// feature to upload excel sheet to add students directly in the users table

export const uploadBooksExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.worksheets[0];
    const rows = [];
    const headers = worksheet.getRow(1).values.map(v => v && v.toString().trim());

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header row
      const obj = {};
      row.values.forEach((value, i) => {
        const key = headers[i];
        if (key) obj[key] = value;
      });
      rows.push(obj);
    });

    if (!rows.length) return res.status(400).json({ error: "Excel file is empty" });

    const required = ["isbn", "title", "author"];
    for (const row of rows) {
      for (const field of required) {
        if (!row[field]) return res.status(400).json({ error: `Missing field '${field}'` });
      }
    }

    const chunkSize = 1000;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const { error } = await supabase.from("book").insert(chunk);
      if (error) return res.status(400).json({ error: error.message });
    }

    res.json({ status: "success", inserted: rows.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// upload students excel file to add students in the users table
export const uploadStudentsExcel = async (req, res) => {
  // Parse and validate Excel file
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
// created workbook instance
    const workbook = new ExcelJS.Workbook();
    // load the uploaded file buffer
    await workbook.xlsx.load(req.file.buffer);
// access the first worksheet
    const worksheet = workbook.worksheets[0];
    const rows = [];

    // Get headers (row 1)
  
    const headers = worksheet.getRow(1).values.map((v) =>
      v && v.toString().trim().toLowerCase()
    );
// iterate through each row
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header row
      const obj = {};
// map each cell to corresponding header
      row.values.forEach((value, i) => {
        if (!headers[i]) return;
        let cellValue = value;

        // Normalize ExcelJS hyperlink objects
        if (typeof cellValue === "object" && cellValue?.text) {
          cellValue = cellValue.text;
        }
// trim whitespace and convert to string
        obj[headers[i]] = cellValue ? cellValue.toString().trim() : null;
      });

      rows.push(obj);
    });

    if (!rows.length) return res.status(400).json({ error: "Excel file is empty" });

    // Validate required fields
    const required = ["prn", "name", "email"];
    // Check each row for required fields
    for (const row of rows) {
      for (const field of required) {
        if (!row[field]) {
          return res.status(400).json({ error: `Missing field '${field}'` });
        }
      }
    }

    // Insert in chunks
    const chunkSize = 1000;
    // Loop through rows in chunks to avoid large inserts
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const { error } = await supabase.from("users").insert(chunk);
      if (error) return res.status(400).json({ error: error.message });
    }

    res.json({ status: "success", inserted: rows.length });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
};