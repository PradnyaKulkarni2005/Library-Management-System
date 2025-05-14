import axios from 'axios';

// Set the base URL for the API
const API_URL = "http://localhost:5000/api";

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: API_URL, 
});

// Admin login API
export const login = async (formData) => {
    try {
        const response = await axiosInstance.post('/auth/admin/login', formData);
        return response.data;
    } catch (error) {
        console.error("Login API Error:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Get all books
export const getBooks = async () => {
    try {
        const response = await axiosInstance.get('/book/get');
        return response.data;
    } catch (error) {
        console.error("Get Books API Error:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Add a new book
export const addBook = async (formData) => {
    try {
        const response = await axiosInstance.post('/book/add', formData)
        return response.data;
    } catch (error) {
        console.error("Add Book API Error:", error.response ? error.response.data : error.message);
        throw error;
    }
};
//Update a book
export const updateBook = async (formData) => {
    try {
        const response = await axiosInstance.post('/book/update', formData)
        return response.data;
    } catch (error) {
        console.error("Update Book API Error:", error.response ? error.response.data : error.message);
        throw error;
    }
}
// Delete a book
export const deleteBook = async (bookId) => {
    try {
        const response = await axiosInstance.delete(`/book/delete/${bookId}`);
        return response.data;
    } catch (error) {
        console.error("Delete Book API Error:", error.response ? error.response.data : error.message);
        throw error;
    }
}

// Issue a book
export const issueBook = async (prn, bookId) => {
    try {
        const response = await axiosInstance.post('/book/issue', {
            bookId: bookId, // ✅ change key from Book_ID to bookId
            prn: prn
        });
        console.log("Backend response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Issue Book API Error:", error.response ? error.response.data : error.message);
        throw error;
    }
};
// Fetch issued books by PRN
export const fetchIssuedBooksByPrn = async (prn) => {
    console.log("API call to fetch issued books for PRN:", prn); 
    try {
        const response = await axiosInstance.get(`/book/issued/${prn}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching issued books by PRN:", error.response?.data || error.message);
        throw error;
    }
};
// Return a book
export const returnBook = async (issueId) => {
    try {
        const response = await axiosInstance.post(`/book/return/${issueId}`);
        return response.data;
    } catch (error) {
        console.error("Return Book API Error:", error.response ? error.response.data : error.message);
        throw error;
    }
};
// Get all students
export const getStudents = async () => {
    try {
        const response = await axiosInstance.get('/student/get');
        return response.data;
    } catch (error) {
        console.error("Get Students API Error:", error.response ? error.response.data : error.message);
        throw error;
    }
};
//add student
export const addStudent = async (student) => {
    try {
        const response = await axiosInstance.post('/student/add', student);
        return response.data;
    }
    catch (error) {
        console.error("Add Student API Error:", error.response ? error.response.data : error.message);
        throw error;
        }
        }
//update student
export const updateStudent = async (student) => {
    try {
        const response = await axiosInstance.post('/student/update', student);
        return response.data;
    } catch (error) {
        console.error("Update Student API Error:", error.response ? error.response.data : error.message);
        throw error;
    }
}
//most issued books
export const getMostIssuedBooks = async () => {
    try {
        console.log("Fetching most issued books...");
        const response = await axiosInstance.get('/book/mostissued'); // Use axiosInstance
        return response.data;
    } catch (error) {
        console.error("Most Issued Books API Error:", error.response?.data || error.message);
        throw error;
    }
};
