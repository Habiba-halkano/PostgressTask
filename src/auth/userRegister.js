const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); // adjust the path as needed

app.post('/auth/register', async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  // Input validation (you can add more detailed validation)
  if (!firstName || !lastName || !email || !password) {
    return res.status(422).json({
      errors: [
        { field: 'firstName', message: 'First name is required' },
        { field: 'lastName', message: 'Last name is required' },
        { field: 'email', message: 'Email is required' },
        { field: 'password', message: 'Password is required' },
      ],
    });
  }

  try {
    // Check if the email already exists
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(422).json({
        errors: [
          { field: 'email', message: 'Email is already in use' },
        ],
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const newUser = await db.query(
      `INSERT INTO users (firstName, lastName, email, password, phone)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [firstName, lastName, email, hashedPassword, phone]
    );

    // Generate a JWT token
    const token = jwt.sign(
      { userId: newUser.rows[0].userId, email: newUser.rows[0].email },
      'your_jwt_secret', // replace with your secret key
      { expiresIn: '1h' }
    );

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: token,
        user: {
          userId: newUser.rows[0].userId,
          firstName: newUser.rows[0].firstName,
          lastName: newUser.rows[0].lastName,
          email: newUser.rows[0].email,
          phone: newUser.rows[0].phone,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
