import supabase from "../config/db.js";

const getReminderUsers = async () => {
    try {
        const { data, error } = await supabase
            .from('issuedbooks')
            .select(`
                users(name, email),
                book(title),
                issue_date
            `)
            .is('return_date', null);

        if (error) throw error;

        const today = new Date();
        const filtered = data
            .filter(item => {
                const issueDate = new Date(item.Issue_Date);
                const diffDays = Math.floor((today - issueDate) / (1000 * 60 * 60 * 24));
                return diffDays > 10;
            })
            .map(item => ({
                Name: item.users.name,
                email: item.users.email,
                Title: item.book.title,
                DaysSinceIssue: Math.floor((today - new Date(item.issue_date)) / (1000 * 60 * 60 * 24))
            }));

        return filtered;

    } catch (error) {
        console.error("Reminder Fetch Error:", error.message || error);
        return [];
    }
};

export default getReminderUsers;
