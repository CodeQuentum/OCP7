const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  ratings: [
    {
      userId: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        required: true
      }
    }
  ],
  averageRating: {
    type: Number,
    default: 0
  }
});

bookSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    const totalRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    this.averageRating = totalRating / this.ratings.length;
  }
  next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;