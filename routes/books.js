const express = require('express');
const router = express.Router();
const Book = require('../model/book');


router.get('/books', (req, res) => {
    let category = req.query.category;
    let title = req.query.title;

    if(title) {
        Book.find({title: new RegExp(title, 'i')}).then((books) => {
            res.send(books);
        });
    }
    else if(category) {
        Book.find({category: category}).then((books) => {
            res.send(books);
        });
    }else {
        Book.find({}).then((books) => {
            res.send(books);
        });
    }

});

router.get('/books/categories', (req, res) => {
    Book.find({}).distinct('category').then((categories) => {
        res.send(categories);
    });
});

router.get('/books/:id', (req, res) => {
    Book.findById({_id: req.params.id}).then((book) => {
        res.send(book);
    });
});


module.exports = router;