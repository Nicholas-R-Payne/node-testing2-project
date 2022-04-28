const express = require("express");

const Pokemon = require('./pokemon/pokemon-model')

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.status(200).json({ api: "up" });
});

server.get("/pokemon", (req, res) => {
    Pokemon.getAll()
      .then(pokemon => {
        res.status(200).json(pokemon);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
  
  server.get("/pokemon/:id", (req, res) => {
    Pokemon.getById(req.params.id)
      .then(pokemon => {
        if(pokemon == null) {
          res.status(404).json({ message: 'Pokemon not found' });
          return;
        }
        res.status(200).json(pokemon);
      });
  });
  
  server.post("/pokemon", (req, res) => {
    Pokemon.insert(req.body)
      .then(pokemon => {
        res.status(201).json(pokemon);
      })
      .catch(error => {
        res.status(500).json(error);
      })
  });
  
  server.delete("/pokemon/:id", (req, res) => {
    Pokemon.remove(req.params.id)
      .then(pokemon => {
        if(pokemon == null) {
          res.status(404).json({ message: 'Pokemon not found' });
          return;
        }
        res.status(200).json(pokemon);
      });
  });
  
  server.put("/pokemon/:id", (req, res) => {
    Pokemon.update(req.params.id, req.body)
      .then(pokemon => {
        if(pokemon == null) {
          res.status(404).json({ message: 'Pokemon not found' });
          return;
        }
        res.status(200).json(pokemon);
      })
  });
  
module.exports = server;