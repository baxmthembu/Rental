const express = require('express');
const multer = require('multer');
/*const {v2: cloudinary} = require('cloudinary');*/
const {Pool} = require('pg');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const path = require('path');
const { json, urlencoded } = require('express');
const { diskStorage } = require('multer');
const { hash, compare } = require('bcryptjs'); 
const { extname } = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { workerData } = require('worker_threads');
const { check, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { error, Console } = require('console');
const {sendAdvertisingNotifications} = require('../frontend/src/Components/Email_Service/emailService'); // Adjust the path as necessary

app.use(json())
app.use(urlencoded({ extended: false }));
//const allowedOrigins = ['https://rentekasi.com', 'http://localhost:3003'];
app.use(cors({
  origin: 'https://rentekasi.com',
  credentials: true,
  exposedHeaders: ['set-cookie'],
}));
/*app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://rentekasi.com'); // Update to match the domain you will make the request from
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});*/
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json())

const db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },  
    },
  });

  console.log('Using DATABASE_URL:', process.env.DATABASE_URL)


    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
          folder: 'public/images', // optional folder name
          allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'webm'], // allow only images
          resource_type: 'auto'
      },
  });
  
  const upload = multer({
    storage: storage
  })

  cloudinary.config({ 
    cloud_name: 'dp9gjl43m', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

//loginLimiter helps protect against abuse such as brute force attacks or excessive API requests
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes amount of time to retry again
  max: 5, // Limit each IP to 5 login requests per 10 minutes
  message: 'Too many requests from this IP, please try again after 15 minutes',
  handler: (req, res) => {
    res.status(429).json({
        message: 'Too many requests, please try again later.',
    });
},
});

/*const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Authorization header: ", token)
  
  if (!token) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err){
        console.error('JWT verification error: ', err)
        return res.sendStatus(403);
      }
      req.user = user;
      next();
  });
};*/
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = req.cookies.token || (authHeader && authHeader.split(' ')[1]);
  //console.log("Authorization header: ", token);
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.error('JWT verification error: ', err);
      
      // Provide more specific error messages
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      } else {
        return res.status(403).json({ error: 'Token verification failed' });
      }
    }
    
    req.user = user;
    next();
  });
};


app.get('/protected', authenticateToken, (req, res) => {
  res.send('This is a protected route');
});

// Register route with input validation
app.post('/register', [
  check('email').isEmail().normalizeEmail(),
  check('password').isLength({ min: 6 }).trim().escape(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {name,email, password } = req.body;

  try {
    const existingUser = await db('users').where({ email }).first();

    if (existingUser) {
      return res.status(400).json({ msg: 'Email address already exists' });
    }

    const hashedPassword = await hash(password, 10);

    await db('users').insert({
      name,
      email,
      password: hashedPassword,
      role: 'owner',
    });

    console.log('Registration successful');
    return res.json({ msg: 'Registration successful' });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ msg: 'An error occurred' });
  }
});

app.post('/property_info', authenticateToken, [
  check('address').trim().escape(),
  check('price').trim().escape(),
  check('description').trim().escape(),
  check('property_type').trim().escape(),
], upload.array('media', 10), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { users_id, address, bedrooms, bathrooms, price, description, phone_number, email, property_type } = req.body;
  const mediaFiles = req.files;

  try {
    if (!mediaFiles || mediaFiles.length === 0) {
      return res.status(400).json({ msg: 'No media selected' });
    }

    const mediaUrls = mediaFiles.map(file => file.path);

    const userResult = await db('users').select('name').where({ id: users_id }).first();
    if (!userResult) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const userName = userResult.name;
    const bedroomsInt = parseInt(bedrooms, 10);
    const bathroomsInt = parseInt(bathrooms, 10);

    if (isNaN(bedroomsInt) || isNaN(bathroomsInt)) {
      throw new Error('Invalid input for bedrooms or bathrooms');
    }

    await db('property_info').insert({
      users_id,
      address,
      bedrooms: bedroomsInt,
      bathrooms: bathroomsInt,
      price,
      description,
      property_type,
      image_url: mediaUrls.join(','), // you may rename this to media_url if it now includes videos
      phone_number,
      email,
      name: userName,
    });

    return res.json({ msg: 'Property info sent' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ msg: 'An error happened' });
  }
});



// Property info route with input validation
app.post('/login',  [
  check('password').isLength({ min: 6 }).trim(),
], loginLimiter, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide both email and password' });
  }

  try {
      const user = await db('users')
          .select('id', 'email', 'password')
          .where({email}/*db.raw('?', [name])*/)
          .first();

      if (!user) {
          return res.status(401).json({ msg: 'Invalid Credentials' });
      }
 
      const isPasswordValid = await compare(password, user.password);

      if (isPasswordValid) {
          await db('users')
              .where({ id: user.id }/*'id', db.raw('?', [user.id])*/)
              .update({ logged_in: true }/*{ logged_in: db.raw('?', [true]) }*/);

              // Create JWT token
          const token = jwt.sign(
            { id: user.id, role: 'owner' }, // Payload
            process.env.JWT_SECRET_KEY, // Replace with your actual secret key
            { expiresIn: '4h' } // Token expiration time
        );

        // Set token in HTTP-only cookie
        /*res.cookie('token', token, {
          httpOnly: true,
          secure: true,//process.env.NODE_ENV === 'production', // Use secure cookies in production
          sameSite: 'none', //process.env.NODE_ENV === 'production' ? 'none' : 'lax'/*'strict'*,
          maxAge: 4 * 60 * 60 * 1000, // 1 hour
          domain: process.env.NODE_ENV === 'production' ? '.rentekasi.com' : 'localhost'
        });*/
        // Set token in HTTP-only cookie
res.cookie('token', token, {
  httpOnly: true,
  secure: isProduction, // true in production, false in development
  sameSite: isProduction ? 'none' : 'lax', // 'none' in production, 'lax' in development
  maxAge: 4 * 60 * 60 * 1000, // 4 hours
  domain: isProduction ? '.rentekasi.com' : 'localhost'
});

          res.json({
              msg: 'Authentication Successful',
              //token,
              user: {
                  id: user.id,
                  role: 'owner',
                  logged_in: true,
                  auth: true,
                  //token: token,
              }
          });
          console.log('Logged in Successfully');
      } else {
          res.status(401).json({auth: false, msg: 'Invalid Credentials, No user exists' });
      }
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/property', authenticateToken, async (req, res) => {
  try {
    const { address } = req.query;
    let data;

    if (address) {
      data = await db('property_info').where('address', 'ILIKE', `%${address}%`);
    } else {
      data = await db.select('*').from('property_info');
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/properties/:userId', authenticateToken,  async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const properties = await db('property_info').where('users_id', userId);
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Error fetching properties' });
  }
});

app.get('/propert/:storedLike', authenticateToken,  async (req, res) => {
  const userId = parseInt(req.params.storedLike, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const properties = await db('property_info').where('id', userId);
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Error fetching properties' });
  }
});

app.delete('/properties/:propertyId',  async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10);

  if (isNaN(propertyId)) {
    return res.status(400).json({ message: 'Invalid property ID' });
  }

  try {
    const deletedProperty = await db('property_info').where('id', propertyId).del();

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

/*app.post('/logout',  async (req, res) => {
  const { userId } = req.body; 
  const id = parseInt(userId, 10);

  if (isNaN(id)) {
    return res.status(400).json({ msg: 'Invalid user ID' });
  }

  try {
    await db('users').where({ id }).update({logged_in: false});
    res.clearCookie('token'); // Clear the token cookie on logout
    res.json({ msg: 'Logout Successful' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'An error occurred' });
  }
});*/
app.post('/logout', async (req, res) => {
  try {
    // Get user ID from the request (could be from body or user object if authenticated)
    const userId = req.body.userId || (req.user && req.user.id);
    
    if (userId) {
      const id = parseInt(userId, 10);
      if (!isNaN(id)) {
        await db('users').where({ id }).update({ logged_in: false });
      }
    }
    
    // Clear the token cookie with the same options used when setting it
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      domain: process.env.NODE_ENV === 'production' ? '.rentekasi.com' : undefined
    });
    
    res.json({ msg: 'Logout Successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ msg: 'An error occurred during logout' });
  }
});

// In your backend (index.js)
app.get('/properties-by-ids', async (req, res) => {
  try {
    const { ids } = req.query;
    
    if (!ids) {
      return res.status(400).json({ error: 'No IDs provided' });
    }

    const idArray = ids.split(',').map(id => parseInt(id));
    const data = await db('property_info').whereIn('id', idArray);
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching properties by IDs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/advertising-inquiry', async (req, res) => {
  try {
    const {
      companyName,
      contactName,
      email,
      phone,
      businessType,
      website,
      budget,
      preferredContact,
      message
    } = req.body;

    // Insert into database
    const result = await db('advertise').insert({
      company_name: companyName,
      contact_name: contactName,
      email: email,
      phone: phone,
      business_type: businessType,
      website: website,
      budget_range: budget,
      preferred_contact_method: preferredContact,
      message: message,
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    }).returning('*'); // Return all fields

    const newInquiry = result[0];

    // Send email notifications (async - don't wait for completion)
    sendAdvertisingNotifications(newInquiry).catch(console.error);

    res.status(201).json({ 
      message: 'Advertising inquiry submitted successfully', 
      id: newInquiry.id 
    });
  } catch (error) {
    console.error('Error saving advertising inquiry:', error);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

// Example backend route for saving lease agreements
app.post('/api/lease-agreements',authenticateToken, async (req, res) => {
  const {
    landlordName,
    landlordId,
    landlordAddress,
    tenantName,
    tenantId,
    tenantAddress,
    propertyAddress,
    monthlyRent,
    depositAmount,
    startDate,
    endDate,
    additionalClauses,
    agreementType,
    generatedDate
  } = req.body;

  try {
    // Insert the agreement into the database
    const [id] = await db('lease_agreements').insert({
      user_id: req.user.id,
      landlord_name: landlordName,
      landlord_id: landlordId,
      landlord_address: landlordAddress,
      tenant_name: tenantName,
      tenant_id: tenantId,
      tenant_address: tenantAddress,
      property_address: propertyAddress,
      monthly_rent: monthlyRent,
      deposit_amount: depositAmount,
      start_date: startDate,
      end_date: endDate,
      additional_clauses: additionalClauses,
      agreement_type: agreementType,
      generated_date: generatedDate,
      created_at: new Date(),
      updated_at: new Date(),
       // Assuming you have user authentication
    }).returning('id');

    res.status(201).json({ id, message: 'Lease agreement saved successfully' });
  } catch (error) {
    console.error('Error saving lease agreement:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/user-lease-agreements',authenticateToken, async (req, res) => {
  try {
    // In a real implementation, you would get the user ID from the session or JWT
    const userId = req.user.id; // This would come from authentication
    
    
    const agreements = await db('lease_agreements')
      .where('user_id', userId)
      .orderBy('created_at', 'desc');

    res.status(200).json(agreements);
  } catch (error) {
    console.error('Error retrieving user agreements:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Example route for retrieving a specific agreement
app.get('/api/lease-agreements/:id', async (req, res) => {
  const agreementId = parseInt(req.params.id, 10);

  if (isNaN(agreementId)) {
    return res.status(400).json({ message: 'Invalid agreement ID' });
  }

  try {
    const agreement = await db('lease_agreements').where('id', agreementId).first();

    if (agreement) {
      res.status(200).json(agreement);
    } else {
      res.status(404).json({ message: 'Agreement not found' });
    }
  } catch (error) {
    console.error('Error retrieving agreement:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Example route for retrieving user's agreements
app.get('/api/user-lease-agreements/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const agreements = await db('lease_agreements')
      .where('user_id', userId)
      .orderBy('created_at', 'desc');

    res.status(200).json(agreements);
  } catch (error) {
    console.error('Error retrieving user agreements:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/lease-agreements/:id', async (req, res) => {
  const agreementId = parseInt(req.params.id, 10);

  if (isNaN(agreementId)) {
    return res.status(400).json({ message: 'Invalid agreement ID' });
  }

  try {
    // In a real implementation, you would verify the user owns this agreement
    const deletedAgreement = await db('lease_agreements').where('id', agreementId).del();

    if (deletedAgreement) {
      res.status(200).json({ message: 'Agreement deleted successfully' });
    } else {
      res.status(404).json({ message: 'Agreement not found' });
    }
  } catch (error) {
    console.error('Error deleting agreement:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/verify-auth', authenticateToken, async (req, res) => {
  try {
    // Get user data from database
    const user = await db('users')
      .select('id', 'email', 'role')
      .where({ id: req.user.id })
      .first();

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Error verifying auth:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = 3001
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
