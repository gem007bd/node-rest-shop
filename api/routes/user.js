const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

//Create New user
router.post('/signup',  (req, res, next) => {
    // check the exsisting email address
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length >= 1) {
                return res.status(409).json({
                    message: 'Email exits!'
                })
            } else {
                // 10 is the salting number here
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User Created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                })
                            });
                    }
                });
            }
        })
 
});

// Get all users
router.get('/users', (req, res, next) => {
    User
    .find()
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    email: doc.email,
                    password: doc.password,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:2000/users/' + doc._id
                    }
                }
            })
        })
    })
});

// Delete user
router.delete('/:userId', (req, res, next) => {
    User.remove({
        _id: req.params.userId
    })
    .exec()
    .then(result => {
        res.status(200).json({
            message: result + 'User Deleted'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;