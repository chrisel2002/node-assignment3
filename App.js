
const express = require("express");
const mongoose = require("mongoose");
const winston = require("winston");
const logger = winston.createLogger({
  level: "info", 
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), 
    new winston.transports.File({ filename: "app.log" }), 
  ],
});



const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/mynewdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  logger.info("Connected to database");
})
.catch(err => {
  logger.error("Error connecting to database:", err);
});

const schema = {
  name: String,
  email: String,
  id: Number,
};

const mongomodel = mongoose.model("users1", schema);

app.post("/post", async (req, res) => {
  logger.info("Inside POST function");

  // Check for required fields
  if (!req.body.name || !req.body.email || !req.body.id) {
    const errorMessage = "Missing required fields: name, email, or id";
    logger.error(errorMessage);

    return res.status(400).json({
      status: 400,
      message: errorMessage,
    });
  }

  try {
    const existingUser = await mongomodel.findOne({ email: req.body.email});

    if (existingUser) {
      const errorMessage = "User with the same Email already exists";
      logger.error(errorMessage);

      return res.status(409).json({
        status: 409,
        message: errorMessage,
      });
    }
    const data = new mongomodel({
      name: req.body.name,
      email: req.body.email,
      id: req.body.id,
    });

    const savedData = await data.save();
    logger.info("Data saved:", savedData);

    const status = 200;
    const message = "User created successfully";

    res.json({
      status: status,
      message: message,
      data: savedData,
    });
  } catch (error) {
    logger.error("Error saving data:", error);
    const statusCode = error.statusCode || 500;
    const statusMessage = error.message || "Internal Server Error";

    res.status(statusCode).json({
      status: statusCode,
      message: statusMessage,
    });
  }
});

app.put("/update/:id", async (req, res) => {
  logger.info("Inside PUT function");

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
      logger.info("No data found for update");
      res.status(404).send({message:"Nothing found"});
    } else {
      logger.info("Updated data:", updatedData);
      res.send(updatedData);
    }
  } catch (error) {
    logger.error("Error updating document:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/users", async (req, res) => {
  logger.info("Inside GET function");

  try {
    const users = await mongomodel.find();

    if (users.length === 0) {
      logger.info("No users found");
      res.status(400).send("No users found");
    } else {
      logger.info("Users found:", users);
      res.send(users);
    }
  } catch (error) {
    logger.info("Error retrieving users:", error);
    res.send("Internal Server Error");
  }
});

app.listen(3006, () => {
  logger.info("Server is running on port 3006");
});

module.exports = app; 

