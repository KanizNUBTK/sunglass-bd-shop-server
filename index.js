const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const ObjectId = require("mongodb").ObjectId;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wvpgl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);


async function run() {
  try {
    await client.connect();
    console.log('database connected suceefully');
    const database = client.db('sunglass_shop');
    const productCollection = database.collection('product');
    const reviewCollection = database.collection('review');
    const usersCollection = database.collection('users');
    const ordersCollection = database.collection('orders');

    //add product
    app.post('/addproduct',async(req,res)=>{
        const product = req.body;
        const result = await productCollection.insertOne(product);
        //console.log(result);
        res.json(result);
    })
    //recive review
    app.post('/addreview',async(req,res)=>{
        const product = req.body;
        const result = await reviewCollection.insertOne(product);
        //console.log(result);
        res.json(result)
    })
    //save login user data
    app.post('/users', async(req,res)=>{
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });
    //save orders for customers
    app.post('/addNewOrder', async(req,res)=>{
      const user = req.body;
      const result = await ordersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });
    //secure admin
    app.get('/users/:email', async(req,res)=>{
      const email=req.params.email;
      const query = {email: email};
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if(user.role === 'admin'){
        isAdmin= true;
      }
      res.json({admin: isAdmin});
    });
     //admin update
     app.put('/users/admin', async(req,res)=>{
      const user = req.body;
      console.log('put', user);
      const filter = {email: user.email};
      const updateDoc = {$set: {role: 'admin'}};
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
     });
    //display products
    app.get('/allProducts',async(req,res)=>{
       const cursor = productCollection.find({});
       const products = await cursor.toArray(); 
       //console.log(products); 
       res.send(products);
    });
    //view orders on table
    app.get('/addNewOrder',async(req,res)=>{
       const cursor = ordersCollection.find({});
       const orders = await cursor.toArray(); 
       //console.log(products); 
       res.send(orders);
    });
    app.get('/addreview',async(req,res)=>{
      const cursor = reviewCollection.find({});
       const reviews = await cursor.toArray(); 
       //console.log(products); 
       res.send(reviews);
    });
    //single product display
    app.get("/addproduct", async (req, res) => {
      // console.log(req.query);
      const cursor = productCollection.find({});
      const products = await cursor.toArray(); 
      //console.log(products); 
      res.send(products);
    });
  

  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello hero sunglass shop bd! are you ready to buy?')
})

app.listen(port, () => {
  console.log(`Example app listening at ${port}`)
})