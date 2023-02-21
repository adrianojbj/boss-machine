const express = require('express');
const bodyParser = require('body-parser');
const db = require('./server/db');
const checkMillionDollarIdea = require('./checkMillionDollarIdea');

const ideaRouter = express.Router();
ideaRouter.use(bodyParser.json());

let ideas = db.getAllFromDatabase('ideas');

ideaRouter.use('/:ideaId', (req, res, next) => {
    let ideaId = req.params.ideaId;
    let ideaIndex = ideas.findIndex(obj => obj.id === ideaId);
    if(ideaIndex !== -1){
      req.ideaIndex = ideaIndex;
      req.ideaId = ideaId;
      next();
    } else {
      res.status(404).send('Idea not found!');
    }
})

ideaRouter.get('/',  (req, res, next) => {
  res.send(ideas);
})

ideaRouter.get('/:ideaId',  (req, res, next) => {
  res.send(ideas[req.ideaIndex]);
})

ideaRouter.post('/', (req, res, next) => {
  const receivedIdea = req.body;
  if(!receivedIdea){
      res.status(400).send();
  } else {
      db.addToDatabase('ideas', receivedIdea);
      res.status(201).send(receivedIdea);
  }
})

ideaRouter.put('/:ideaId',  (req, res, next) => {
  db.updateInstanceInDatabase('ideas', req.body);
  ideas = db.getAllFromDatabase('ideas');
  res.send(ideas[req.ideaIndex]);
})

ideaRouter.delete('/:ideaId',  (req, res, next) => {
  db.deleteFromDatabasebyId('ideas', req.params.ideaId);
  res.status(204).send();
})


module.exports = ideaRouter;