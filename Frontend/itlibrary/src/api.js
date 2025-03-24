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
