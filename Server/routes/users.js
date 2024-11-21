import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword, adheresToPasswordPolicy} from '../lib/utility.js';
import cors from 'cors';

const router = express.Router();
const prisma = new PrismaClient;

router.use(cors(
  {
    credentials: true
  }
));

router.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const emailCleaned = email.toLowerCase().trim();

  //validate inputs (fix this later) 
  if (!(emailCleaned && password && firstName && lastName)) {
    return res.status(400).send('All fields are required');
  }

  if(!( await (adheresToPasswordPolicy(password)))){
    console.log(await adheresToPasswordPolicy(password, true));

    const reason = await adheresToPasswordPolicy(password, true);
    var message = reason[0].message;

    message = message.replace("The string should", "Your password must")

    return res.status(400).send(message);
  }

  //check if user exists
  const existingUser = await prisma.customer.findUnique({
    where: {
      email: emailCleaned
    }
  });

  if (existingUser) {
    return res.status(400).send('User already exists');
  }

  //hash password
  const hashedPassword = await hashPassword(password);

  //create user
  const user = await prisma.customer.create({
    data: {
      email: emailCleaned,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName
    }
  });

  //generate token
  res.status(200).json({ 'user': user.email });
})


router.post('/login', async (req, res) => {

  if(req.session.userId){
    return res.status(400).send('User is already logged in');
  }

  const { email, password } = req.body;
  const emailCleaned = email.toLowerCase().trim();
  if (!(emailCleaned && password)) {
    return res.status(400).send('All fields are required');
  }

  //check if user exists
  const existingUser = await prisma.customer.findUnique({
    where: {
      email: emailCleaned,
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
  req.session.userId        = existingUser.id;
  req.session.userEmail     = existingUser.email;
  req.session.userFirstName = existingUser.firstName
  req.session.userLastName  = existingUser.lastName;
  
  res.status(200).send('Logged in. Welcome ' + req.session.userFirstName + ".");
})


router.post('/logout', async (req, res) => {
  if(!req.session.userId){
    return res.status(400).send('User is not logged in');
  }

  req.session.destroy();
  res.status(200).send('Logged out');
})


router.post('/session', async (req, res) => {
  if(!req.session.userId){
    return res.status(401).send('User is not logged in');
  }

  res.json({"customerId"        : req.session.userId,
            "customerEmail"     : req.session.userEmail,
            "customerFirstName" : req.session.userFirstName,
            "customerLastName"  : req.session.userLastName
  });
})



export default router;