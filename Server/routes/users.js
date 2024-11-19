import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';

const router = express.Router();
const prisma = new PrismaClient;

router.post('/signup', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    //validate inputs (fix this later) 
    if (!(email && password && firstName && lastName)) {
      return res.status(400).send('All fields are required');
    }
  
    //check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email : email
      }
    });
  
    if (existingUser) {
      return res.status(400).send('User already exists');
    }
  
    //hash password
    const hashedPassword = await hashPassword(password);
  
  
  
    //create user
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName
      },
    });
  
    //generate token
    res.json({ 'user': email });
})


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!(email && password)) {
        return res.status(400).send('All fields are required');
    }

    //check if user exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });

    if (!existingUser) {
        return res.status(400).send('User does not exist');
    }

    //compare password
    const passwordMatch = await comparePassword(password, existingUser.password);

    if (!passwordMatch) {
        return res.status(401).send('Login Unsuccessful. Invalid Credentials');
    }


    //setup session
    req.session.userId = existingUser.id;
    req.session.userEmail = existingUser.email;
    req.session.name = existingUser.firstName + ' ' + existingUser.lastName;

    res.send('Login successful. Welcome ' + req.session.name + '.');
})


router.post('/logout', async (req, res) => {
    req.session.destroy();

    res.status(200).send('Logged out ');
})


router.post('/session', async (req, res) => {
    res.send('Users name is ' + req.session.name);
})

export default router;