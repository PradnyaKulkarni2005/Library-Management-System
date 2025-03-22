const db = require('../config/db');
const jwt = require('jsonwebtoken'); // to generate signed token
const bcrypt = require('bcryptjs'); // to hash password

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

exports.adminLogin = (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM admin WHERE username = ?', [username]), async (error, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        if (results.length == 0 ) {
            res.status(401).json({ message: 'Username or Password is incorrect' });
        } 
        bcrypt.compare(password, results[0].password, (err, isMatch) => {
            if (isMatch) {
                const token = jwt.sign({ id: results[0].id }, SECRET_KEY, {
                    expiresIn: '2h' });// expires in 1 hours
                    res.json ({ token });
                }
            else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }   
        
    }
    );
}
}