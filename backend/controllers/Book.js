const Book = require('../models/Book');

exports.createBook = (req, res) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth._userId,
    imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.name}`
  });
  book.save()
  .then(() => {res.status(201).json({message:'Livre enregistré'})})
  .catch(error => res.status(400).json({ error }))
};

exports.modifyBook = (req, res) => {
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  Book.findOne({_id: req.params.id})
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message : 'Non autorisé'});
          } else {
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Livre modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.deleteBook = (req, res) => {
    Book.deleteOne({_id: req.params.id})
    .then(()=> res.status(200).json({ message: 'Livre supprimé !'}))
    .catch(error => res.status(404).json({ error }));
  };

exports.getOneBook = (req, res) =>{
    Book.findOne({_id: req.params.id})
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
  };

exports.getAllBooks =  (req, res) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};