import supabase from "../config/db.js";

const getReminderUsers = async () => {
    try {
        const { data, error } = await supabase
            .from('issuedbooks')
            .select(`
                users(Name, email),
                book(Title),
                Issue_Date
            `)
            .is('Return_Date', null);

        if (error) throw error;

        const today = new Date();
        const filtered = data
            .filter(item => {
                const issueDate = new Date(item.Issue_Date);
                const diffDays = Math.floor((today - issueDate) / (1000 * 60 * 60 * 24));
                return diffDays > 10;
            })
            .map(item => ({
                Name: item.users.Name,
                email: item.users.email,
                Title: item.book.Title,
                DaysSinceIssue: Math.floor((today - new Date(item.Issue_Date)) / (1000 * 60 * 60 * 24))
            }));

        return filtered;

    } catch (error) {
        console.error("Reminder Fetch Error:", error.message || error);
        return [];
    }
};

export default getReminderUsers;
