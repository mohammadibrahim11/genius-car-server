const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require('jsonwebtoken'); 
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { config } = require("dotenv");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("genius car server running");
});

function verifyJWT (req,res ,next){
  const authHeader = req.headers.authorization;
  if(!authHeader){
 return res.status(401).send({message : 'unauthorized access'})

  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,function(err,decoded){
    if(err){
      return res.status.send({message: 'unauthorize access'})
    }
    req.decoded = decoded;
    next();

  })
  // const token = 
}


// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASSWORD)
// user:user3
// password: JJfnYV494PZxvL0p

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gbplfqy.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const servicesCollection = client.db("geniusCar").collection("services");
    // 

    // for order collection
    const orderCollection = client.db("geniusCar").collection("orders");
    // for order collection

    const productsCollection = client.db("geniusCar").collection("products")

    

    app.post('/jwt',(req,res)=>{
      const user = request.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '1h'})
      res.send({token});
      console.log(jwt);
    })

    // for getting  data from mongodb

    // 1.write app.get.
    // 2.use query for searching all data from mongodb.
    // 3.use options for specific data.
    // 4.use cursor for finding data.
    // 5.use await with cursor and convert cursor(to array)for using data in client side
    // 6.then send your data to client side with (res.send)


    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });



    app.get ('/products', async(req,res)=>{
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    })


    // 1. load specific data and use specific id. 
    // 2.for getting id use (req.params.id);
    // 3.use query with(_id:objectId) for a specific service.
    // 4.use (findOne)to find a specifiq service  in service collection
    // 5.then send data to client side using(res.send) 

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });

    // orders api for get orders data from database-
    // 1.

    app.get('/orders',async(req,res)=>{
      // console.log(req.query.email);
     let query = {}
    //  1 jon er koyta order ache seta dekhar jonno er conditon lekha (filter out order by email address)

     if(req.query?.email){
      query = {
        email:req.query.email
      }
    }

     const cursor = orderCollection.find(query);
     const result = await cursor.toArray();
     res.send(result)
    })



    
     
    // to create orders in database 
    // 1.use app.post and need an api
    // 2.to found the order use (req.body);
    // 3.to send data in database use (insertOne with ordersCollection)

    //   orders api for create order data 
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });


    // use patch for updating data in database
    // use updatedoc for which one you want to update



    app.patch("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = {
        _id: ObjectId(id),
      };
      const updateDoc = {
        $set: {
          status: status 
        },
      };
      const result = await orderCollection.updateOne(query, updateDoc);
      res.send(result);
    });



    // delete orders from database


    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => console.err(err));

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

app.listen(port, () => {
  console.log(`genius car  server running on ${port}`);
});

// deploy to vercel 
// 1.add vercel config
// 2.vercel
// 3.add npm run build in package.json
