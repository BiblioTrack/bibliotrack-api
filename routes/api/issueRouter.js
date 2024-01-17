const express = require('express');
const bodyParser = require('body-parser');
const issueRouter = express.Router();
const mongoose = require('mongoose');

const Issue = require('../../models/issues');
const BookRequest = require('../../models/bookRequest');
const authenticate = require('../../authenticate');
const cors = require('cors');

issueRouter.use(bodyParser.json());

issueRouter.route('/')
  .options(cors(), (req, res) => { res.sendStatus(200); })
  .get(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Issue.find({})
      .populate({
        path: 'request',
        populate: { path: 'userId bookId' }
      })
      .then((issues) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(issues);
      })
      .catch((err) => next(err));
  })
  .post(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    BookRequest.findById(req.body.request)
      .then((bookRequest) => {
        if (!bookRequest) {
          const err = new Error("Book request not found");
          err.status = 404;
          return next(err);
        }

        const newIssue = {
          request: bookRequest._id,
          issueDate: req.body.issueDate || new Date(),
          returnDate: req.body.returnDate || null,
          isReturned: req.body.isReturned || false
        };

        Issue.create(newIssue)
          .then((issue) => {
            res.status(200).json(issue);
          })
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  })
  .put(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /issues');
  })
  .delete(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Issue.deleteMany({})
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      })
      .catch((err) => next(err));
  });

issueRouter.route('/:issueId')
  .options(cors(), (req, res) => { res.sendStatus(200); })
  .get(cors(), authenticate.verifyUser, (req, res, next) => {
    Issue.findById(req.params.issueId)
      .populate({
        path: 'request',
        populate: { path: 'userId bookId' }
      })
      .then((issue) => {
        if (issue && (issue.request.userId._id.equals(req.user._id) || req.user.admin)) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(issue);
        } else if (!issue) {
          const err = new Error("Issue not found");
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
    res.end('POST operation not supported on /issues/' + req.params.issueId);
  })
  .delete(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Issue.findOneAndDelete({ _id: req.params.issueId })
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      })
      .catch((err) => next(err));
})
  .put(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Issue.findByIdAndUpdate(req.params.issueId, {
      $set: {
        returnDate: new Date(),
        isReturned: true
      }
    }, { new: true })
      .then((updatedIssue) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(updatedIssue);
      })
      .catch((err) => next(err));
  });

module.exports = issueRouter;

