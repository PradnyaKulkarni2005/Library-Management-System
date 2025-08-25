# 📚 Library Management System  

A **full-stack Library Management System** built with **React, Node.js, and MySQL (Supabase in hosted version)**.  
This project is designed for internal use to **manage books, users, circulation, and overdue tracking** in a simple, intuitive way.  

---

## 🔧 Tech Stack  

**Frontend:** React  
**Backend:** Node.js (Express)  
**Database:** Supabase (Postgres on cloud)  
**Others:** Nodemailer, Node-cron, Recharts, Multer, ExcelJS  

---

## ✨ Features  

- 🔐 **Secure Admin Login** (JWT authentication)  
- 📘 **Manage Books & Users** (Add, update, delete)  
- 🔄 **Book Issuing & Return Tracking**  
- 📤 **Bulk Upload via Excel** (Books & Students)  
  - Upload **Excel files (.xlsx, .xls)** directly from the admin panel  
  - Backend processes data using **Multer** (file upload middleware) and **ExcelJS** (to parse Excel sheets)  
  - Supports **bulk insert** of books or student records  
- 📨 **Automated Email Reminders** for due/overdue books (Nodemailer + Node-cron)  
- 📊 **Visual Insights with Charts** (Pie & Bar charts using Recharts)  
- 📱 **Responsive and Modern UI** with animations  

---

## 🚀 Getting Started  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/PradnyaKulkarni2005/Library-Management-System.git
cd Backend
npm install
```
## Frontend
```bash

cd Frontend/itlibrary
npm install
```
### 3️⃣ Environment Variables
Create a .env file in the backend folder and add:
```bash

SUPABASE_URL=your supabase url
SUPABASE_ANON_KEY=ANON KEY
MAIL_USER=usermail
MAIL_PASSWORD=user password
JWT_SECRET=jwt secret key
```
### 4️⃣ Run the project
### Backend
```bash
cd backend
nodemon server.js
```
### Frontend
```bash
Frontend/itlibrary
cd Frontend/itlibrary
npm start
```
App will run on 👉 http://localhost:3000
