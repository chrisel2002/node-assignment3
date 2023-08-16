
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/mynewdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to database");
})
.catch(err => {
  console.error("Error connecting to database:", err);
});

const schema = {
  name: String,
  email: String,
  id: Number,
};

const mongomodel = mongoose.model("users1", schema);

app.post("/post", async (req, res) => {
  console.log("Inside POST function");

  try {
    const data = new mongomodel({
      name: req.body.name,
      email: req.body.email,
      id: req.body.id,
    });

    const savedData = await data.save();
    console.log("Data saved:", savedData);
    res.send("Posted");
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/update/:id", async (req, res) => {
  console.log("Inside PUT function");

  let upid = req.params.id;
  let upname = req.body.name;
  let upemail = req.body.email;

  try {
    const updatedData = await mongomodel.findOneAndUpdate(
      { id: upid },
      { $set: { name: upname, email: upemail } },
      { new: true }
    );

    if (updatedData === null) {
      console.log("No data found for update");
      res.send("Nothing found");
    } else {
      console.log("Updated data:", updatedData);
      res.send(updatedData);
    }
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/users", async (req, res) => {
  console.log("Inside GET function");

  try {
    const users = await mongomodel.find();

    if (users.length === 0) {
      console.log("No users found");
      res.send("No users found");
    } else {
      console.log("Users found:", users);
      res.send(users);
    }
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3005, () => {
  console.log("Server is running on port 3005");
});

module.exports = app; 

