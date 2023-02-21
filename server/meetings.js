const express = require('express');
const bodyParser = require('body-parser');
const db = require('./server/db');
const checkMillionDollarIdea = require('./checkMillionDollarIdea');

const meetingRouter = express.Router();


meetingRouter.use(bodyparser.json());

let meetings = db.getAllFromDatabase('meetings');

meetingRouter.get('/',  (req, res, next) => {
  res.send(meetings);
})

meetingRouter.post('/', (req, res, next) => {
  const newMeeting = db.createMeeting();
  if(!newMeeting){
      res.status(400).send();
  } else {
      db.addToDatabase('meetings', newMeeting);
      res.status(201).send(newMeeting);
  }
})

meetingRouter.delete('/',  (req, res, next) => {
    db.deleteAllFromDatabase('meetings');
    meetings = [];
    res.status(204).send();
})

 module.exports = meetingRouter;