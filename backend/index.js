const express = require('express');
const multer = require('multer');
/*const {v2: cloudinary} = require('cloudinary');*/
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
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { workerData } = require('worker_threads');

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


    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
          folder: 'public/images', // optional folder name
          allowed_formats: ['jpg', 'jpeg', 'png'], // allow only images
      },
  });
  
  const upload = multer({
    storage: storage
  })

  cloudinary.config({ 
    cloud_name: 'dp9gjl43m', 
    api_key: '559611397692518', 
    api_secret: 'e8n19zYEck8q3LlU-0XpFXwnJoY' // Click 'View API Keys' above to copy your API secret
});

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
         role: 'owner',
        });
   
       console.log('Registration successful');
       return res.json({ msg: 'Registration successful' });
     } catch (error) {
       console.error('Error:', error);
       return res.status(500).json({ msg: 'An error occurred' });
     }
  })

  app.post('/property_info',upload.single('image'), async (req,res) => {
    const {users_id,address, bedrooms, bathrooms, price, description, property_type} = req.body
    const images = req.file.path

    try{

      if (!req.file) {
        // No image was provided
        return res.status(400).json({ msg: 'No image selected' });
      }

      await db('property_info').insert({
        users_id: users_id,
        address: address,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        price: price,
        description: description,
        property_type: property_type,
        image_url: images
      })

      console.log('Sent property info successfully')
      return res.json({msg: 'Property info sent'})
    }catch(error){
      console.error('Error:', error)
      return res.status(500).json({msg: 'An error happened'})
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

  app.get('/property', async(req,res) =>{
    try{
      const { address } = req.query;
        let data;
        
        if (address) {
            data = await db('property_info').where('address', 'ILIKE', `%${address}%`);
        } else {
            data = await db.select('*').from('property_info');
        }
      const propertyData = data.map((property) => ({
        id: property.id,
        users_id: property.users_id,
        address: property.address,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        price: property.price,
        description: property.description,
        property_type: property.property_type,
        image_url: property.image_url
      }))
      res.json(propertyData)
    }catch(error){
      console.error('Error fetching data:', error )
      res.status(500).json({error: 'Internal server error'})
    }
  })

  app.get('/properties/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Fetch properties from the database where the userId matches the logged-in user's ID
        const properties = await db('property_info').where('users_id', userId)
        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ message: 'Error fetching properties' });
    }
});

app.delete('/properties/:propertyId', async (req, res) => {
  const { propertyId } = req.params;

  try {
      // Delete the property from the database based on the propertyId
      const deletedProperty = await db('property_info')
          .where('id', propertyId)
          .del();

      if (deletedProperty) {
          res.status(200).json({ message: 'Property deleted successfully' });
      } else {
          res.status(404).json({ message: 'Property not found' });
      }
  } catch (error) {
      console.error('Error deleting property:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


const port = 3001
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
