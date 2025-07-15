import cron from 'node-cron';
import getReminderUsers from '../utils/reminderHelper.js';
import sendMail from '../utils/mailer.js';


const startReminder = () => {
    console.log("🔁 Starting reminder job...");

    // Every day at 9 AM
    cron.schedule('30 9 * * *', async () => {
        console.log("📨 Cron job triggered");

        const usersToRemind = await getReminderUsers();

        if (usersToRemind.length === 0) {
            console.log("✅ No pending book returns over 10 days.");
            return;
        }

        for (const user of usersToRemind) {
            const mailText = `Dear ${user.Name},\n\nYou have not returned the book "${user.Title}" for ${user.DaysSinceIssue} days.\nPlease return it as soon as possible.\n\nThank you.`;

            const sent = await sendMail(user.email, '📚 Library Book Return Reminder', mailText);
            console.log(sent 
                ? `✅ Reminder sent to ${user.email}` 
                : `❌ Failed to send reminder to ${user.email}`);
        }
    });
};

export default startReminder;
