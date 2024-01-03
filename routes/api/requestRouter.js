/**
 * requestRouter.js
 * Routes for managing requests in the library system.
 */

// GET /requests: Fetches all requests (accessible by admin).
// POST /requests: Creates a new request (accessible by authenticated users).
// GET /requests/:requestId: Fetches a specific request by ID (accessible by authenticated users).
// DELETE /requests/:requestId: Deletes a specific request by ID (accessible by admin).


const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const requestRouter = express.Router();
const authenticate = require('../../authenticate');
const cors = require('../cors');
const Request = require('../../models/request');

requestRouter.use(bodyParser.json());

requestRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Request.find({})
        .populate('userId')
        .populate('bookId')
        .then((requests) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(requests);
        })
        .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Request.create(req.body)
        .then((request) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(request);
        })
        .catch((err) => next(err));
});

requestRouter.route('/:requestId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Request.findById(req.params.requestId)
        .populate('userId')
        .populate('bookId')
        .then((request) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(request);
        })
        .catch((err) => next(err));
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Request.findByIdAndRemove(req.params.requestId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        })
        .catch((err) => next(err));
});

module.exports = requestRouter;
