import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import cors from 'cors';

const router = express.Router();
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

router.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/'); // save uploaded files in `public/images` folder
    },

    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop();// get file extension
        const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1000) + '.' + ext; // generate unique filename - current timestamp + random number between 0 and 1000.
        cb(null, uniqueFilename);
    }
});

const upload = multer({ storage: storage });

router.post('/get', async (req, res) => {

    const products = await prisma.product.findMany({
        orderBy: {
            name: "asc"
        }
    });

    res.json(products);
})

router.post('/getByID', async (req, res) => {

    const { id } = req.body;

    if (!id) {
        return res.status(400).send('ID is required');
    }

    const product = await prisma.product.findUnique({
        where: {
            id: id
        }
    });

    if (!product) {
        return res.status(400).send('Product not found');
    }

    res.json(product);

})

router.post('/getByName', async (req, res) => {

    const { name } = req.body;

    if (!name) 
    {
        return res.status(400).send('Name is required');
    }

    const product = await prisma.product.findUnique({
        where: 
        {
            name: name
        }
    });

    if (!product) {
        return res.status(400).send('Product not found');
    }

    res.json(product);

})

router.post('/create', upload.single('image'), async (req, res) => {

    const { name, price, description } = req.body;
    const imageFileName = req.file ? req.file.filename : null;

    if (!(name && price && description)) {
        unlink(imageFileName);
        return res.status(400).send('All fields are required');
    }

    const product = await prisma.product.create({
        data: 
        {
            name: name,
            price: price,
            description: description,
            imageFileName: imageFileName
        }
    });

    res.json(product);
})

function unlink(fileName) {
    if (fileName) 
        {
        fs.unlinkSync(`public/images/${fileName}`);
    } else 
    {
        console.log("No file to delete");
    }
}


export default router;