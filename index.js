const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT || 2000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MyDB}:${process.env.MyPass}@cluster0.ywrmz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("RepoDB");
      const RepoCollection = database.collection("RepoCollection");
      const usersCollection = database.collection("userInformation");
     
      app.post('/repository', async (req, res) => {
          const move = req.body;
          const result = await RepoCollection.insertOne(move);
          res.json(result);
      })

      app.get('/repository', async (req, res) => {
          const findingResult =  RepoCollection.find({});
          const  result = await findingResult.toArray();
          res.json(result);
      })
     
      app.post('/users', async (req, res) =>{
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.json(result);
      })

      app.get('/users', async (req, res) =>{
        const findDing = usersCollection.find({});
        const result = await findDing.toArray();
        res.json(result);
      })
      app.put('/users', async (req, res) => {
        const user = req.body;
        const filter = { email: user.email};
        const option = {upsert: true};
        const updateDoc= {
            $set: user
        };
        const result = await usersCollection.updateOne(filter, updateDoc, option);
        res.json(result);
    });

      app.get('/created', async (req, res) =>{
        const email = req.query.email;
        console.log(email);
        const query = {email: email}
        const user = await RepoCollection.find(query).toArray();
        console.log(user);
        res.json(user);
      })

      app.delete('/repository/:id', async (req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await RepoCollection.deleteOne(query);
        res.json(result);
      })
      

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', async (req, res) =>{
    res.send("Github server is running");
})

app.listen(port, () =>{
    console.log("listening on port "+port);
})