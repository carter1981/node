const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const dbConfig = require('../config');

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(`mongodb+srv://${dbConfig.dbUserName}:${dbConfig.dbPassword}@cluster0.6a3i8.mongodb.net/shop?retryWrites=true&w=majority`, {
    useUnifiedTopology: true,
  })
    .then(client => {
      //Database connection stored in _db variable
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }

  throw 'No database found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

