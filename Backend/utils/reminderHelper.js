const db = require('../config/db');

const getReminderUsers = async () => {
    const query = `
        SELECT 
            s.Name,
            s.email,
            b.Title,
            DATEDIFF(CURDATE(), ib.Issue_Date) AS DaysSinceIssue
        FROM 
            IssuedBooks ib
        JOIN 
            Book b ON ib.Book_Id = b.Book_ID
        JOIN 
            Users s ON ib.prn = s.prn
        WHERE 
            ib.Return_Date IS NULL 
            AND DATEDIFF(CURDATE(), ib.Issue_Date) > 10
    `;

    try {
        const [results] = await db.query(query); // ✅ no .promise() here
        return results;
    } catch (error) {
        console.error("Reminder Fetch Error:", error);
        return [];
    }
};

module.exports = getReminderUsers;
