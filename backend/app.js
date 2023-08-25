const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://quentin:15171517@cluster0.1xy4ice.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.post('/api/books', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
      message: 'Objet créé !'
    });
  });

app.get('/api/books', (req, res, next) => {
    const book = [
    {
        _id: "defzaefaezf",
        userId :"Blio",
        title :"Harry Potter à l\'écoles des sorciers",
        author : "J.K Rolling",
        imgUrl : " ",
        year : 1997,
        genre : "roman jeunesse",
        ratings : 5,
        averageRating : 4,
    },
    {
        _id: "defzaefaezfefgz",
        userId :"Blio",
        title :"Harry Potter et la chambres des secrets",
        author : "J.K Rolling",
        imgUrl : " ",
        year : 1998,
        genre : "roman jeunesse",
        ratings : 5,
        averageRating : 4,
    },
    ];
    res.status(200).json(book);
});
module.exports = app;