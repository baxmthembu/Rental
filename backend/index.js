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
  origin: 'http://localhost:3003',
  credentials: true
}));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3003');
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
         role: 'owner'
        });
   
       console.log('Registration successful');
       return res.json({ msg: 'Registration successful' });
     } catch (error) {
       console.error('Error:', error);
       return res.status(500).json({ msg: 'An error occurred' });
     }
  })

  app.post('/login', async (req, res) => {
    const { name, password } = req.body;
  
    if (!name || !password) {
      return res.status(400).json({ msg: 'Please provide both name and password' });
    }
  
  
    try {
      const user = await db('users')
        .select('id','name','password')
        .where('name', name) // Simplified for demo purposes, use hashed passwords in production
        .first();
        
  
      const isPasswordValid = await compare(password, user.password);
  
      if (isPasswordValid) {
          res.json({
          msg: 'Authentication Successful',
          user: {
            id: user.id,
            name: user.name,
            role: 'owner',
            // Add other user details if needed
          }
        });
        console.log('Logged in Successfully')
      } else {
        res.status(401).json({ msg: 'Invalid Credentials' });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

const port = 3001
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
