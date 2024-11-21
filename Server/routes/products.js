import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const router = express.Router();
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});


router.use(cors(
    {
        credentials: true
    }
));


router.post('/get', async (req, res) => {

    const products = await prisma.product.findMany({
        orderBy: {
            name: "desc"
        }
    });

    res.json(products);
})

router.post('/getByID', async (req, res) => {

    const { id } = req.body;

    if (!id) {
        return res.status(400).send('ID is required to get product by ID');
    }

    const product = await prisma.product.findUnique({
        where: {
            id: id
        }
    });

    if (!product) {
        return res.status(404).send('Product not found');
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
        return res.status(404).send('Product not found');
    }

    res.json(product);

})



router.post('/purchase', async (req, res) => {
    if(!req.session.userId){
      return res.status(401).send('User is not logged in');
    }
  
    const {street, city, province, country, postalCode, cart,
       creditCardNumber, creditCardExpiry, creditCardCVC, invoiceSubtotal, invoiceTax, invoiceTotal} = req.body;
  
    const cartItemsCount = cart.split(',').reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1; // Increment count or initialize to 1
        return acc;
    }, {});

    console.log(cartItemsCount);
  
    if (!(street && city && province && country && postalCode 
        && creditCardNumber && creditCardExpiry && creditCardCVC
        && invoiceSubtotal && invoiceTax && invoiceTotal)) {
      return res.status(400).send('All fields are required');
    }
    
    const purchase = await prisma.purchase.create({
      data: {
        street: street,
        city: city,
        province: province,
        country: country,
        postalCode: postalCode,
        creditCardNumber: creditCardNumber,
        creditCardExpiry: creditCardExpiry,
        creditCardCVC: creditCardCVC,
        invoiceSubtotal: invoiceSubtotal,
        invoiceTax: invoiceTax,
        invoiceTotal: invoiceTotal,
        customerId: 1
      }
    });
  
    //for each item in cartCount, create a purchaseItem with the product id and quantity and the purchase id
    await Promise.all(Object.entries(cartItemsCount).map(([productId, quantity]) => {
      return prisma.purchaseItem.create({
        data: {
          quantity: quantity,
          productId: parseInt(productId),
          purchaseId: purchase.purchaseId
        }
      });
    }));
    

    return res.status(200).send('Purchase successful');
  });

export default router;