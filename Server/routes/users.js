import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword, adheresToPasswordPolicy } from '../lib/utility.js';
import cors from 'cors';

const router = express.Router();
const prisma = new PrismaClient;

router.use(cors(
  {
    credentials: true,
  }
));

router.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const emailCleaned = email.toLowerCase().trim();
  const errors = {};

  //validate inputs (fix this later) 
  if (!emailCleaned) errors.email = 'Email is required';
  if (!password) errors.password = 'Password is required';
  if (!firstName) errors.firstName = 'First name is required';
  if (!lastName) errors.lastName = 'Last name is required';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailCleaned)) {
    errors.email = 'Invalid email format';
  }

  const isValidPassword = await adheresToPasswordPolicy(password);
  if (!isValidPassword.length == 0) {
    console.log(isValidPassword);
    errors.password = 'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, and one digit.';
  }

  if (errors.length > 0) {
    console.log(errors);
    return res.status(400).json({ errors });
  }

  const existingUser = await prisma.customer.findUnique({
    where: {
      email: emailCleaned
    }
  });

  if (existingUser) {
    errors.email = 'User already exists';
    return res.status(400).json({ errors });
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.customer.create({
    data: {
      email: emailCleaned,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName
    }
  });

  res.status(200).json({ 'user': user.email });
})

router.post('/login', async (req, res) => {

  if (req.session.userId) {
    return res.status(400).json({ "error": 'User is already logged in' });
  }

  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(400).json({ "error": 'All fields are required' });
  }
  const emailCleaned = email.toLowerCase().trim();

  //check if user exists
  const existingUser = await prisma.customer.findUnique({
    where: {
      email: emailCleaned,
    }
  });

  if (!existingUser) {
    return res.status(400).json({ "error": "User does not exist" });
  }

  //compare password
  const passwordMatch = await comparePassword(password, existingUser.password);

  if (!passwordMatch) {
    return res.status(401).json({ "error": 'Login Unsuccessful. Invalid Credentials' });
  }

  //setup session
  req.session.userId = existingUser.id;
  req.session.userEmail = existingUser.email;
  req.session.userFirstName = existingUser.firstName
  req.session.userLastName = existingUser.lastName;

  res.status(200).json({ "message": 'Logged in. Welcome ' + req.session.userFirstName + "." });
})


router.post('/logout', async (req, res) => {
  if (!req.session.userId) {
    return res.status(400).json({ "error": 'User is not logged in' });
  }

  req.session.destroy();
  res.status(200).send('Logged out');
})


router.post('/session', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ "error": 'User is not logged in' });
  }

  res.status(200).json({
    "id": req.session.userId,
    "email": req.session.userEmail,
    "firstName": req.session.userFirstName,
    "lastName": req.session.userLastName
  });
})



export default router;