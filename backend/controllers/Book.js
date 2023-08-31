const Book = require('../models/Book');
const fs = require ('fs');

exports.createBook = (req, res) => {
  try {
    const bookObject = JSON.parse(req.body.book);

    delete bookObject._id;
    delete bookObject._userId;

    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    
    book.save()
      .then(() => {
        res.status(201).json({ message: 'Livre enregistré' });
      })
      .catch(error => {
        res.status(400).json({ error });
      });
  } catch (error) {
    res.status(400).json({ error: "Invalid book data" });
  }
};

exports.rateBook = (req, res) => {
  const { userId, rating } = req.body;

  if (rating < 0 || rating > 5) {
    return res.status(400).json({ error: 'La note doit être comprise entre 0 et 5' });
  }

  Book.findById(req.params.id)
    .then(book => {
      if (!book) {
        return res.status(404).json({ error: 'Livre non trouvé' });
      }
      if (book.ratings.some(rating => rating.userId === userId)) {
        return res.status(400).json({ error: 'L\'utilisateur a déjà noté ce livre' });
      }

      book.ratings.push({ userId, grade: rating });

      const totalRatings = book.ratings.length;
      const totalSum = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
      const averageRating = totalSum / totalRatings;
      book.averageRating = averageRating;

      return book.save();
    })
    .then(updatedBook => {
      res.status(200).json(updatedBook);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
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
    Book.findOne({_id: req.params.id})
    .then(book => {
      if(book.userId != req.auth.userId){
        res.status(401).json({message : 'non-autorisé' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({_id: req.params.id})
          .then(() => {res.status(200).json({message : 'Livre supprimé'})})
          .catch(error => res.status(401).json({ error }));
        })
      }
    })
    .catch(error => res.status(500).json({ error }));
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

exports.getBestRatedBooks = (req, res) => {
  console.log('Début de la recherche des livres les mieux notés');

  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then(books => {
      console.log('Livres trouvés :', books);
      res.status(200).json(books);
    })
    .catch(error => {
      console.error('Erreur lors de la recherche des livres :', error);
      res.status(500).json({ error });
    });
};