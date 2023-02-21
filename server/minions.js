const express = require('express');
const bodyParser = require('body-parser');
const db = require('./server/db')

const minionRouter = express.Router();
minionRouter.use(bodyParser.json());

let minions = db.getAllFromDatabase('minions');

minionRouter.use('/:minionId', (req, res, next) => {
    let minionId = req.params.minionId;
    let minionIndex = minions.findIndex(obj => obj.id === minionId);
    if(minionIndex !== -1){
      req.minionIndex = minionIndex;
      req.minionId = minionId;
      next();
    } else {
      res.status(404).send('Minon not found!');
    }
})

const workRouter = require('./work');
minionRouter.use('/:minionId/work', workRouter);

minionRouter.get('/',  (req, res, next) => {
  res.send(minions);
})

minionRouter.get('/:minionId',  (req, res, next) => {
  res.send(minions[req.minionIndex]);
})

minionRouter.post('/', (req, res, next) => {
  const receivedMinion = req.body;
  if(!receivedMinion){
      res.status(400).send();
  } else {
      db.addToDatabase('minions', receivedMinion);
      res.status(201).send(receivedMinion);
  }
})

minionRouter.put('/:minionId',  (req, res, next) => {
  db.updateInstanceInDatabase('minions', req.body);
  minions = db.getAllFromDatabase('minions');
  res.send(minions[req.minionIndex]);
})

minionRouter.delete('/:minionId',  (req, res, next) => {
  db.deleteFromDatabasebyId('minions', req.params.minionId);
  res.status(204).send();
})


module.exports = minionRouter;