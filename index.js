const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ylija.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  // console.log('connection err', err)

  const bookCollection = client.db("DevelopersBook").collection("books");
  // perform actions on the collection object

  app.get('/books', (req, res) => {
    bookCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })

  // app.get('/checkout/:id', (req, res) => {
  //   bookCollection.find({  id})
  //     .toArray((err, items) => {
  //       res.send(items)
  //     })
  // })

  app.post('/addBook', (req, res) => {
    const newBook = req.body;
    console.log(newBook)
    bookCollection.insertOne(newBook)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })

  app.delete('deleteBook/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log('delete this', id);
    bookCollection.findOneAndDelete({ _id: id })
      .then(documents => res.send(!!documents.value))
  })

  // client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})