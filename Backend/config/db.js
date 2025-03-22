const mysql=require ("mysql");
require('dotenv').config();

const db=mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'Pradnya@1245',
    database: process.env.DB_NAME || 'PCCOELibraryDB'
});

db.connect((err)=>{
    if(err){
        console.error("Database Connection Failed: ",err);
    }else{
        console.log("Database Connected....");
    }
});
module.exports=db;