const bcrypt = require("bcrypt");

const password = "itlibadmin"; // Your desired admin password
bcrypt.hash(password, 10, (err, hash) => {
    if (err) return console.error("Error hashing password:", err);
    console.log("Hashed Password:", hash);
});
