const express = require("express");
const app = express();

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const uri =
  "mongodb+srv://admin:1995@cluster0.kni9h.mongodb.net/userdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
app.use(urlencodedParser);
const password = 1995;

app.get("/", (req, res) => {
  //   res.send("you got me");
  res.sendFile(__dirname + "/index.html");
});

client.connect((err) => {
  const collection = client.db("userdb").collection("users");
  // perform actions on the collection object
  console.log("databased connected");
  //create
  app.post("/addUser", (req, res) => {
    console.log(req.body);
    collection.insertOne(req.body).then((data) => {
      console.log("data added");
      res.redirect("/");
    });
    // collection.insertOne(user).then((result) => {
    //   console.log("one product added");
    // });
  });

  app.get("/user/:id", (req, res) => {
    // const id = req.params.id;
    // console.log(req.params.id);
    collection
      .find({
        _id: ObjectId(req.params.id),
      })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  //read
  app.get("/users", (req, res) => {
    collection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //   console.log(collection);
  //   const user = { name: "shuvasish", age: 25 };

  //   client.close();

  //updateUser

  app.patch("/update/:id", (req, res) => {
    console.log(req.body);
    collection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: { user: req.body.userName, age: req.body.userAge },
        }
      )
      .then((result) => {
        // console.log(result);
        res.send(result.modifiedCount > 0);
      });
  });

  //delete
  app.delete("/delete/:id", (req, res) => {
    // console.log(req.params.id);
    collection
      .deleteOne({
        _id: ObjectId(req.params.id),
      })
      .then((result) => res.send(result.deletedCount > 0));
  });
});

app.listen(3000, () => {
  console.log("listening port on 3000");
});
