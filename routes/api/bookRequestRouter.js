const express = require('express');
const bodyParser = require('body-parser');
const bookRequestRouter = express.Router();
const mongoose = require('mongoose');

const BookRequest = require('../../models/bookRequest');
const Books = require('../../models/books');
const Users = require('../../models/users');

const cors = require('cors');
const authenticate = require('../../authenticate');

bookRequestRouter.use(bodyParser.json());

bookRequestRouter.route('/')
    .options(cors(), (req, res) => { res.sendStatus(200); })
    .get(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        BookRequest.find({})
            .populate('userId')
            .populate('bookId')
            .then((requests) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(requests);
            })
            .catch((err) => next(err));
    })
    .post(cors(), authenticate.verifyUser, (req, res, next) => {
        const allowedStatusValues = ['Pending', 'Approved', 'Rejected'];
        // Validate status value
        if (!allowedStatusValues.includes(req.body.status)) {
            const err = new Error(`Invalid status value. Allowed values are ${allowedStatusValues.join(', ')}`);
            err.status = 400;
            return next(err);
        }
        Books.findById(req.body.bookId)
            .then((requiredBook) => {
                Users.findById(req.user._id)
                    .then((requiredUser) => {
                        if (!requiredBook) {
                            const err = new Error("Book doesn't exist");
                            err.status = 400;
                            return next(err);
                        } else if (!requiredUser) {
                            const err = new Error("User doesn't exist");
                            err.status = 400;
                            return next(err);
                        } else if (requiredBook._id && requiredUser._id) {
                            const newRequest = {
                                userId: req.user._id,
                                bookId: req.body.bookId,
                                copyNumber: req.body.copyNumber,
                                requestDate: req.body.requestDate,
                                dueDate: req.body.dueDate,
                                reason: req.body.reason,
                                status: req.body.status
                            };

                            BookRequest.create(newRequest)
                                .then((request) => {
                                    BookRequest.findById(request._id)
                                        .populate('userId')
                                        .populate('bookId')
                                        .then((populatedRequest) => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(populatedRequest);
                                        })
                                        .catch((err) => next(err));
                                })
                                .catch((err) => next(err));
                        }
                    })
                    .catch((err) => next(err));
            })
            .catch((err) => next(err));
    })
    .put(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /bookRequests');
    })

    .delete(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on /bookRequests');
    });


bookRequestRouter.route('/user')
.options(cors(), (req, res) => { res.sendStatus(200); })
.get(cors(), authenticate.verifyUser, (req, res, next) => {
    try {
        // Assuming req.user._id is a valid user ID
        const userId = new mongoose.Types.ObjectId(req.user._id);

        // Fetch all book requests based on the userId
        BookRequest.find({ userId: userId })
            .populate('userId')
            .populate('bookId')
            .then((requests) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(requests);
            })
            .catch((err) => next(err));
    } catch (err) {
        return next(err);
    }
});



bookRequestRouter.route('/:requestId')
    .options(cors(), (req, res) => { res.sendStatus(200); })
    .get(cors(), authenticate.verifyUser, (req, res, next) => {
        BookRequest.findById(req.params.requestId)
            .populate('userId')
            .populate('bookId')
            .then((request) => {
                if (request && (request.userId._id.toString() === req.user._id.toString() || req.user.admin)) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(request);
                } else if (!request) {
                    const err = new Error("Request not found");
                    err.status = 404;
                    return next(err);
                } else {
                    const err = new Error("Unauthorized");
                    err.status = 401;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    })
    .post(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /bookRequests/' + req.params.requestId);
    })
    .delete(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        BookRequest.findOneAndDelete({ _id: req.params.requestId })
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            })
            .catch((err) => next(err));
    })
    .put(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const allowedStatusValues = ['Pending', 'Approved', 'Rejected'];
        const { status, dueDate, copyNumber, reason } = req.body;

        // Validate status value
        if (!allowedStatusValues.includes(status)) {
            const err = new Error(`Invalid status value. Allowed values are ${allowedStatusValues.join(', ')}`);
            err.status = 400;
            return next(err);
        }

        BookRequest.findByIdAndUpdate(req.params.requestId, {
            $set: {
                status: status,
                dueDate: dueDate,
                copyNumber: copyNumber,
                reason: reason,
            }
        }, { new: true })
            .populate('userId')
            .populate('bookId')
            .then((updatedRequest) => {
                if (updatedRequest) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(updatedRequest);
                } else {
                    const err = new Error("Request not found");
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    });

module.exports = bookRequestRouter;
