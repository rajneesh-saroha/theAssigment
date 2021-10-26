const { Schema } = require("mongoose");
const Mongoose = require("mongoose");
Mongoose.Promise = global.Promise;
const url = "mongodb://127.0.0.1/DB";

const dataSchema = Schema(
  {
    uName: { type: String },
    uEmail: { type: String },
    providerIdentityImg: {
      type: String,
    },
  },
  { collection: "data", timestamps: true }
);
let collection = {};

collection.getDataCollection = () => {
  return Mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((database) => {
      return database.model("data", dataSchema);
    })
    .catch((err) => {
      let error = new Error("Could not connect to the database");
      error.status = 500;
      throw error;
    });
};

module.exports = collection;
