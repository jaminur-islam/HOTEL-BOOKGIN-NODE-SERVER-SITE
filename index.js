const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port =process.env.PORT || 5000;

 // meddlewere
 app.use(cors());
 app.use(express.json());


 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2uuip.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
 const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 
 const run = async() =>{
   try{
    await client.connect()
    const database = client.db('Myservices');
    const serviceCollection = database.collection('services');
    const orderCollection = database.collection('order')

    // get services Api 
    app.get('/services' , async(req , res) =>{
     const cursor = serviceCollection.find({});
     const services = await cursor.toArray();
     res.send(services);
    })

    // get single service api
    app.get('/services/:id' ,async(req , res ) =>{
      const id = req.params.id;
      const query =  {_id: ObjectId(id)};
      const service = await serviceCollection.findOne(query);
      res.send(service);

    })

    // get api by name 
    app.get('/myorder/:name' , async(req , res ) =>{
      const name = req.params.name;
      console.log(name)
      const query = { nameis : name}
      const result = await orderCollection.find(query).toArray();
      res.json(result);
    })

    // post api
    app.post('/mybook' , async(req , res)=>{
      const service = req.body;
      const result = await orderCollection.insertOne(service);
      
      res.send(result);
    })   
   


   }
   finally{
    // await client.close()
   }
 }
 run().catch(console.dir);
  
 



 app.get('/' , (req , res)=>{
   res.send('server running')
 })
 app.listen(port , ()=>{
   console.log(port);
 })