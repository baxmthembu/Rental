const express = require('express');
const multer = require('multer');
const {v2: cloudinary} = require('cloudinary');
const {Pool} = require('pg');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');
const { json, urlencoded } = require('express');
const { diskStorage } = require('multer');
const { hash, compare } = require('bcrypt');
const { extname } = require('path');

app.use(json())
app.use(urlencoded({ extended: false }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});
app.use(express.static('public'));

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
    },
  });

  const storage = diskStorage({
    destination: (req,file,cb) => {
      cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
  })
  
  const upload = multer({
    storage: storage
  })

  app.post('/register', async (req, res) => {
    const {name,email,password} = req.body;
    try {
       // Hash the password using bcrypt
       const hashedPassword = await hash(password, 10); // 10 is the number of salt rounds
  
       // Insert the user data with the hashed password into the database
       await db('users').insert({
         name: name,
         email: email,
         password: hashedPassword, // Store the hashed password
        });
   
       console.log('Registration successful');
       return res.json({ msg: 'Registration successful' });
     } catch (error) {
       console.error('Error:', error);
       return res.status(500).json({ msg: 'An error occurred' });
     }
  })

const port = 3001
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
