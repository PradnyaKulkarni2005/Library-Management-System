import supabase from '../config/db.js';

// Handling the get request for books
export const getBooks = async (req, res) => {
    try {
        const { data, error } = await supabase.from('book').select('*');
        if (error) throw error;
        console.log("Fetched Books:", data); // Debugging line
        res.json(data);
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ error });
    }
};

// Handling the add request for books
export const addBook = async (req, res) => { 
    const { ISBN, Title, Author, Publication, Available_Copies, Total_Copies, Category } = req.body;
    try {
        const { data, error } = await supabase
            .from('book')
            .insert([{ ISBN, Title, Author, Publication, Available_Copies, Total_Copies, Category }])
            .select();
        if (error) throw error;
        res.json({ message: 'Book added successfully', bookId: data[0].Book_ID });
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ error });
    }
};

export const updateBook = async (req, res) => { 
    const { ISBN, Title, Author, Publication, Available_Copies, Total_Copies, Category } = req.body;
    try {
        const { data, error } = await supabase
            .from('book')
            .update({ Title, Author, Publication, Available_Copies, Total_Copies, Category })
            .eq('ISBN', ISBN)
            .select();

        if (error) throw error;
        if (!data.length) return res.status(404).json({ message: 'Book not found' });

        res.json({ message: 'Book updated successfully' });
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ error });
    }
};

//delete book
export const deleteBook = async (req, res) => {
    const { bookId } = req.params;
    try {
        const { data, error } = await supabase
            .from('book')
            .delete()
            .eq('Book_ID', bookId)
            .select();

        if (error) throw error;
        if (!data.length) return res.status(404).json({ message: 'Book not found' });

        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ error });
    }
};

// issue book
export const issueBook = async (req, res) => {
    const { bookId, prn } = req.body;

    try {
        // 1. Check if user exists
        console.log("PRN:", prn); // Debugging line
        console.log("Book ID:", bookId); // Debugging line
        const { data: userResult, error: userError } = await supabase.from('users').select('*').eq('prn', prn);
        if (userError) throw userError;
        console.log("User Result:", userResult); // Debugging line
        if (!userResult.length) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // 2. Check if book is available
        const { data: bookResults, error: bookError } = await supabase.from('book').select('Available_Copies').eq('Book_ID', bookId);
        if (bookError) throw bookError;
        if (!bookResults.length) {
            return res.status(400).json({ message: 'Book does not exist' });
        }
        if (bookResults[0].Available_Copies <= 0) {
            return res.status(400).json({ message: 'Book is not available' });
        }

        // 3. Issue the book
        const { error: issueError } = await supabase.from('issuedbooks').insert([{ Book_ID: bookId, prn }]);
        if (issueError) throw issueError;

        // 4. Update available copies
        console.log("Updating available copies for book ID:", bookId); // Debugging line
        const { error: updateError } = await supabase.rpc('decrement_available_copies', { book_id_input: bookId });
        if (updateError) throw updateError;

        return res.json({ message: 'Book issued successfully' });

    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Return the book
export const returnBook = async (req, res) => {
    const { issueId } = req.params;

    try {
        // Step 1: Update Return_Date
        const { data: updateData, error: updateError } = await supabase
            .from('issuedbooks')
            .update({ Return_Date: new Date().toISOString() })
            .eq('Issue_ID', issueId)
            .is('Return_Date', null)
            .select();

        if (updateError) throw updateError;
        if (!updateData.length) {
            return res.status(400).json({ message: 'Book not issued or already returned' });
        }

        // Step 2: Get BOOK_ID
        const { data: bookRow, error: bookRowError } = await supabase
            .from('issuedbooks')
            .select('Book_ID')
            .eq('Issue_ID', issueId);

        if (bookRowError) throw bookRowError;
        if (!bookRow.length) {
            return res.status(404).json({ message: 'Issued book record not found' });
        }

        const bookId = bookRow[0].Book_ID;

        // Step 3: Update Available_Copies
        const { error: availUpdateError } = await supabase.rpc('increment_available_copies', { book_id_input: bookId });
        if (availUpdateError) throw availUpdateError;

        return res.json({ message: 'Book returned successfully' });
    } catch (error) {
        console.error("Error returning book:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Fetch issued books by PRN where Return_Date is NULL
export const fetchIssuedBooksByPrn = async (req, res) => {
    const prn = req.params.prn;
    console.log("Fetching issued books for PRN:", prn); // Debugging line

    try {
        const { data, error } = await supabase
            .from('issuedbooks')
            .select(`Issue_ID, Book_ID, book(Title, Author), Issue_Date`)
            .eq('prn', prn)
            .is('Return_Date', null);

        if (error) throw error;

        const result = data.map(entry => ({
            Issue_ID: entry.Issue_ID,
            Book_ID: entry.Book_ID,
            Title: entry.book.Title,
            Author: entry.book.Author,
            Issue_Date: entry.Issue_Date,
        }));

        res.json(result);
    } catch (error) {
        console.error("Error fetching issued books:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// get most issued books
export const getMostIssuedBooks = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('issuedbooks')
            .select('Book_ID, book(Title), count:Book_ID')
            .group('Book_ID, book(Title)')
            .order('count', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error("Error fetching most issued books:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
// Search books by title or author
export const searchBooks = async (req, res) => {
    const { query } = req.query;

    try {
        const { data, error } = await supabase
            .from('book')
            .select('*')
            .or(`Title.ilike.%${query}%,Author.ilike.%${query}%,ISBN.ilike.%${query}%`);

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error("Error searching books:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
// Get pending books which are not returned
export const getPendingBooks = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('issuedbooks')
            .select('*, book(*)')
            .is('Return_Date', null);

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error("Error fetching pending books:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get book status counts
export const getBookStatusCounts = async (req, res) => {
    try {
        const { data: totalBooks, error: totalError } = await supabase
            .from('book')
            .select('Book_ID', { count: 'exact', head: true });

        const { data: issuedBooks, error: issuedError } = await supabase
            .from('issuedbooks')
            .select('Issue_ID', { count: 'exact', head: true })
            .is('Return_Date', null);

        if (totalError || issuedError) throw totalError || issuedError;

        res.json({
            totalBooks: totalBooks?.count || 0,
            issuedBooks: issuedBooks?.count || 0,
            availableBooks: (totalBooks?.count || 0) - (issuedBooks?.count || 0)
        });
    } catch (error) {
        console.error("Error fetching book status counts:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
// Get book categories
export const getBookCategories = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('book')
            .select('Category')
            .neq('Category', null);

        if (error) throw error;

        const uniqueCategories = [...new Set(data.map(book => book.Category))];

        res.json(uniqueCategories);
    } catch (error) {
        console.error("Error fetching book categories:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
// Get books per category
export const getBooksPerCategory = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('book')
            .select('Category, count:Category')
            .group('Category');

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error("Error fetching books per category:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
