import axios from 'axios';

// Set the base URL for the API
const isLocal = window.location.hostname === 'localhost';

const API_URL = isLocal
  ? "http://localhost:5000/api"
  : "https://librarybackend-qzpm.onrender.com/api";

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
            bookId: bookId, 
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
//get pending books
export const getPendingBooks = async () => {
    try {
        const response = await axiosInstance.get('/book/pending');
        return response.data;
    } catch (error) {
        console.error("Get Pending Books API Error:", error.response ? error.response.data : error.message);
        throw error;
    }
}
//book status counts
export const getBookStatusCounts = async () => {
    try {
        const response = await axiosInstance.get('/book/status');
        return response.data;
    } catch (error) {   
        console.error("Get Book Status Counts API Error:", error.response ? error.response.data : error.message);
        throw error;
    }
};

//get book categories
export const getBookCategories = async () => {
    try {
        const response = await axiosInstance.get('/book/categories');
        return response.data;
    } catch (error) {
        console.error("Get Book Categories API Error:", error.response ? error.response.data : error.message);
        throw error;
    }
};
export const getBooksPerCategory = async () => {
  try {
    const response = await axiosInstance.get('/book/percat');
    return response.data;
  } catch (error) {
    console.error("Get Books Per Category API Error:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Upload Excel for books
export const uploadBooksExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
    console.log("FormData file:", formData.get("file"));
  const res = await axiosInstance.post("/student/upload-excelbook", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  console.log("Upload Excel Response:", res.data);
  return res.data;
};
// Upload Excel for students
export const uploadStudentsExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  console.log("FormData prepared with file:", file.name);

  const res = await axiosInstance.post("/student/upload-excel", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log("Upload response:", res.data);

  return res.data;
};
