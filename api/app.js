require("dotenv").config();
var express = require("express");
// var path = require("path");
var cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");
const cors = require("cors");

var app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const collection = require("./connection");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var salt = bcrypt.genSaltSync(saltRounds);
const hashPassword = bcrypt.hashSync(process.env.PASSWORD, salt);
let accessToken = "";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null || "") return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userObj) => {
    if (err) {
      return res.sendStatus(403);
    }
    let user = { name: userObj.name };
    accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "5m",
    });
  });

  next();
}

function addData(fullName, email, identityImg) {
  return collection.getDataCollection().then((model) => {
    return model
      .create({
        uName: fullName,
        uEmail: email,
        providerIdentityImg: identityImg,
      })
      .then((newData) => {
        if (newData) {
          return newData;
        } else {
          // let err = new Error("Data not inserted");
          // err.status = 500;
          // throw err;
        }
      });
  });
}
function getAll() {
  return collection.getDataCollection().then((model) => {
    return model.find().then((data) => {
      if (data || data == []) {
        return data;
      } else {
        // let err = new Error("Data not found");
        // err.status = 500;
        // throw err;
      }
    });
  });
}
app.post("/login", (req, res) => {
  if (
    req.body.username == process.env.USER_NAME &&
    bcrypt.compareSync(req.body.password, hashPassword)
  ) {
    const username = req.body.username;
    const user = { name: username };
    accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "5m",
    });
    res.status(201);
    res.json({ accessToken: accessToken });
  }
});
app.post("/addData", authenticateToken, (req, res) => {
  try {
    addData(req.body.fullName, req.body.email, req.body.identityImg).then(
      (response) => {
        if (response) {
          res.status(201);
          res.json({ accessToken: accessToken, data: response });
        } else {
          res.status(404);
        }
      }
    );
  } catch (err) {
    res.sendStatus(err.status);
  }
});
app.post("/logout", (req, res) => {
  accessToken = "";
  res.status(201);
  res.json({ accessToken: accessToken });
});
app.post("/getData", authenticateToken, (req, res) => {
  try {
    getAll().then((response) => {
      if (response) {
        res.status(201);

        res.json({ accessToken: accessToken, data: response });
      } else {
        res.sendStatus(404);
      }
    });
  } catch (err) {
    res.sendStatus(err.status);
  }
});
const appPort = 4000;
app.listen(appPort);
console.log("Service Started at port:", appPort);
module.exports = app;
