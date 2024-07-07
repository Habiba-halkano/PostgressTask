app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Input validation
    if (!email || !password) {
      return res.status(422).json({
        errors: [
          { field: 'email', message: 'Email is required' },
          { field: 'password', message: 'Password is required' },
        ],
      });
    }
  
    try {
      // Check if the user exists
      const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (user.rows.length === 0) {
        return res.status(401).json({
          status: 'Bad request',
          message: 'Authentication failed',
          statusCode: 401,
        });
      }
  
      // Compare the password
      const isMatch = await bcrypt.compare(password, user.rows[0].password);
      if (!isMatch) {
        return res.status(401).json({
          status: 'Bad request',
          message: 'Authentication failed',
          statusCode: 401,
        });
      }
  
      // Generate a JWT token
      const token = jwt.sign(
        { userId: user.rows[0].userId, email: user.rows[0].email },
        'your_jwt_secret', // replace with your secret key
        { expiresIn: '1h' }
      );
  
      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          accessToken: token,
          user: {
            userId: user.rows[0].userId,
            firstName: user.rows[0].firstName,
            lastName: user.rows[0].lastName,
            email: user.rows[0].email,
            phone: user.rows[0].phone,
          },
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  