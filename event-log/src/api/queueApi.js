"use strict";

const servicesInfoRouter = require('express').Router();
const MongoClient = require('mongodb').MongoClient;

const MONGO_URI = "mongodb://queue:aaaa1111@ds159254.mlab.com:59254/temp-db";
const DB_NAME = "temp-db";
const COLLECTION_NAME = "events";

let eventsCollection;
let currentIndex;
// TODO: Connect to mongodb only when needed and than close the connection.

// Connect using MongoClient
MongoClient.connect(MONGO_URI, function(err, client) {
    if (err) {
        console.log('resetPassword', 'can\'t connect to mongoDb')
    }
    else {
        eventsCollection = client.db(DB_NAME).collection(COLLECTION_NAME);
        eventsCollection.count({}, function (err, count) {
            if (!err) {
                currentIndex = count;
                console.log('Starting with ' + count + ' events in the queue');
            }
        });
    }
});

servicesInfoRouter.get('/api/v1/get-event/:offset', function (req, res) {
    eventsCollection.findOne({offset: parseInt(req.params.offset)}, function (err, event) {
        if (err) {
            res.send(err)
        }
        else {
            res.send(event);
        }
    });
});

servicesInfoRouter.get('/api/v1/get-events/:offset/:count', function (req, res) {
    const startIndex = parseInt(req.params.offset);
    const endIndex = startIndex + parseInt(req.params.count);

    eventsCollection.find({offset: {"$gte": startIndex, "$lt": endIndex}}).toArray(function (err, events) {
        if (err) {
            res.send(err)
        }
        else {
            res.send(events);
        }
    });
});


servicesInfoRouter.post('/api/v1/add-event', function (req, res) {
    const newOffset = currentIndex++;

    eventsCollection.insert({offset: newOffset}, function (err) {
        if (!err) {
            res.send({index: newOffset});
        }
        else {
            err = 'mongoDbError';
            res.send(err);
        }
    });
});

module.exports = servicesInfoRouter;
