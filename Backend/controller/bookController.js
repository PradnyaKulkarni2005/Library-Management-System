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
  const { isbn, title, author, publication, available_copies, total_copies, category } = req.body;

  // Basic validation
  if (!isbn || !title || !author || !publication || !available_copies || !total_copies || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const { data, error } = await supabase
      .from('book')
      .insert([
        {
          isbn,
          title,
          author,
          publication,
          available_copies: Number(available_copies),
          total_copies: Number(total_copies),
          category
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json({
      message: 'Book added successfully',
      bookId: data[0].book_id,
    });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};


export const updateBook = async (req, res) => {
    const {
        originalIsbn, // ← the original ISBN to search by
        isbn,
        title,
        author,
        publication,
        available_copies,
        total_copies,
        category,
    } = req.body;

    try {
        const { data, error } = await supabase
            .from('book')
            .update({ isbn, title, author, publication, available_copies, total_copies, category })
            .eq('isbn', originalIsbn) //  search by original ISBN
            .select();

        if (error) throw error;
        if (!data.length) return res.status(404).json({ message: 'Book not found' });

        res.json({ message: 'Book updated successfully' });
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
};


//delete book
export const deleteBook = async (req, res) => {
    const { bookId } = req.params;
    try {
        const { data, error } = await supabase
            .from('book')
            .delete()
            .eq('book_id', bookId)
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
        const { data: bookResults, error: bookError } = await supabase.from('book').select('available_copies').eq('book_id', bookId);

        if (bookError) throw bookError;
        if (!bookResults.length) {
            return res.status(400).json({ message: 'Book does not exist' });
        }
        if (bookResults[0].available_copies <= 0) {
            return res.status(400).json({ message: 'Book is not available' });
        }

        // 3. Issue the book
        const { error: issueError } = await supabase.from('issuedbooks').insert([{ book_id: bookId, prn }]);
        if (issueError) throw issueError;

        // 4. Update available copies
        console.log("Updating available copies for book ID:", bookId); // Debugging line
        const { error: updateError } = await supabase.rpc('decrement_available_copies', { book_id_input: bookId });
        if (updateError) throw updateError;

        return res.json({ message: 'Book issued successfully' });

    } catch (error) {
    console.error("Full Error:", JSON.stringify(error, null, 2));
    return res.status(500).json({ error: error.message || 'Internal server error' });
}

};

// Return the book
export const returnBook = async (req, res) => {
    const { issueId } = req.params;

    try {
        // Step 1: Update Return_Date
        const { data: updateData, error: updateError } = await supabase
            .from('issuedbooks')
            .update({ return_date: new Date().toISOString() })
            .eq('issue_id', issueId)
            .is('return_date', null)
            .select();

        if (updateError) throw updateError;
        if (!updateData.length) {
            return res.status(400).json({ message: 'Book not issued or already returned' });
        }

        // Step 2: Get BOOK_ID
        const { data: bookRow, error: bookRowError } = await supabase
            .from('issuedbooks')
            .select('book_id')
            .eq('issue_id', issueId);

        if (bookRowError) throw bookRowError;
        if (!bookRow.length) {
            return res.status(404).json({ message: 'Issued book record not found' });
        }

        const bookId = bookRow[0].book_id;

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
            .select(`issue_id, book_id, book(title, author), issue_date`)
            .eq('prn', prn)
            .is('return_date', null);

        if (error) throw error;

        const result = data.map(entry => ({
            Issue_ID: entry.issue_id,
            Book_ID: entry.book_id,
            Title: entry.book.title,
            Author: entry.book.author,
            Issue_Date: entry.issue_date,
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
      .from('most_issued_books')
      .select('*');

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
            .or(`title.ilike.%${query}%,author.ilike.%${query}%,isbn.ilike.%${query}%`);

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
            .select(`
                book (
                    title,
                    category
                ),
                prn,
                issue_date,
                return_date,
                users (
                    name
                )
            `)
            .is('return_date', null);

        if (error) throw error;

        const today = new Date();
        const overdueBooks = data
            .map(entry => {
                const issueDate = new Date(entry.issue_date);
                const diffTime = today - issueDate;
                const daysSinceIssue = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                return {
                    title: entry.book?.title || 'Unknown',
                    category: entry.book?.category || 'N/A',
                    studentName: entry.users?.name || 'Unknown',
                    prn: entry.prn,
                    DaysSinceIssue: daysSinceIssue,
                };
            })
            .filter(entry => entry.DaysSinceIssue > 15); // Only overdue

        res.json(overdueBooks);
    } catch (error) {
        console.error("Error fetching pending books:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


// Get book status counts
export const getBookStatusCounts = async (req, res) => {
    try {
        const { count: totalCount, error: totalError } = await supabase
            .from('book')
            .select('*', { count: 'exact', head: true });

        const { count: issuedCount, error: issuedError } = await supabase
            .from('issuedbooks')
            .select('*', { count: 'exact', head: true })
            .is('return_date', null);

        if (totalError || issuedError) throw totalError || issuedError;

        res.json({
            issuedBooks: issuedCount || 0,
            availableBooks: (totalCount || 0) - (issuedCount || 0),
        });
    } catch (error) {
        console.error("Error fetching book status counts:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get book categories
export const getBookCategories = async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('get_unique_category_count');

    if (error) throw error;

    // data is an array with one object: [{ count: 12 }]
    res.json(data[0]); // ✅ returns { count: 12 }
  } catch (error) {
    console.error("Error fetching category count:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// Get books per category
export const getBooksPerCategory = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('books_per_category')
      .select('*');

    if (error) throw error;

    res.json(data); // [{ category: 'Fiction', count: 10 }, ...]
  } catch (error) {
    console.error("Error fetching books per category:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


