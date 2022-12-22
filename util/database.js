const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const mongoUri =
  "mongodb+srv://alvinacosta:lokalsoul@node-udemy-2022.j8p86sm.mongodb.net/?retryWrites=true&w=majority";

let db;

const mongoConnect = async () => {
  try {
    const client = await MongoClient.connect(mongoUri);
    console.log("DB Connected");

    db = client.db("shop");
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getDb = () => {
  if (db) {
    return db;
  }

  throw "No database found!";
};

module.exports = { mongoConnect, getDb };
