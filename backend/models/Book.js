const mongoose = required('mongoose');

const booksSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imgUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [{
        userId: { type: String, required: true },
        rating: { type: Number, required: true }
    }],
    averageRating: { type: Number, default: 0 }
});

booksSchema.pre('save', function(next) {
    if (this.ratings.length > 0) {
        const totalRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
        this.averageRating = totalRating / this.ratings.length;
    }
    next();
});

module.exports = mongoose.model('Book', booksSchema);