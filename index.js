const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

var uri = `mongodb://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0-shard-00-00.ahkxb.mongodb.net:27017,cluster0-shard-00-01.ahkxb.mongodb.net:27017,cluster0-shard-00-02.ahkxb.mongodb.net:27017/?ssl=true&replicaSet=atlas-bxflci-shard-0&authSource=admin&retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const userCollection = client.db("Solid_Tools_Corp").collection("all_users");
    const productCollection = client.db("Solid_Tools_Corp").collection("all_products");
    const reviewCollection = client.db("Solid_Tools_Corp").collection("all_reviews");


// ******************************
//     users 
// ******************************

    // get all users
    // http://localhost:5000/users
    app.get("/users", async (req, res) => {
      const query = {};
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });
    

    // find one item by id
    // http://localhost:5000/item/6274a3425a04790168facc8c
    app.get("/item/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await warehouseCollection.findOne(filter);
      res.send(result);
    });
    // find one item by email
    // http://localhost:5000/addedby/abdullah71faisal@gamil.com
    app.get("/addedby/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { addedby:email};
      const result = await warehouseCollection.find(filter).toArray();
      res.send(result);
    });

    // create one user
    // http://localhost:5000/item
    app.post("/user", async (req, res) => {
      const user = req.body;      
      const result = await userCollection.insertOne(user);
      res.send({ message: "user added", result});
    });
    

    //update item
    // http://localhost:5000/item/6274a3425a04790168facc8c
    app.put("/item/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateItem = {        
        $set: req.body,
      };
      const result = await warehouseCollection.updateOne(filter, updateItem);
      res.send({message: "item updated"})
    });

    // delete item
    // http://localhost:5000/item/6274a3425a04790168facc8c
    app.delete("/item/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const result = await warehouseCollection.deleteOne(filter);  
        res.send({message: "item deleted"})
      });


// ******************************
//     products 
// ******************************

// get all products
    // http://localhost:5000/products
    app.get("/products", async (req, res) => {
      const query = {};
      const result = await productCollection.find(query).toArray();
      res.send({ message: "all products loaded", result});
    });

    // create one product
    // http://localhost:5000/item
    app.post("/product", async (req, res) => {
      const item = req.body;
      const result = await productCollection.insertOne(item);
      res.send({ message: "product added", result});
    });









// ******************************
//     reviews 
// ******************************

 // http://localhost:5000/reviews
 app.get("/reviews", async (req, res) => {
  const query = {};
  const result = await reviewCollection.find(query).toArray();
  res.send({ message: "all reviews loaded", result});
});

// create one review
// http://localhost:5000/item
app.post("/review", async (req, res) => {
  const review = req.body;
  const result = await reviewCollection.insertOne(review);
  res.send({ message: "review added", result});
});




  } finally {
  }
}
run().catch(console.dir);

// backend initialize
app.get("/", (req, res) => {
  res.send("welcome to warehouse");
});

app.listen(port, () => {
  console.log("listening port", port);
});
