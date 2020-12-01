const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Project = require('../models/project-model')


//Route to retrieve all projects 
router.get('/projects', (req, res) => {
  Project.find()
    .then((allProjectsFromDB) => {
        //res.render('projects', allProjectsFromDB) => avant on aurait fait cela.
        res.json(allProjectsFromDB);
    });
});


//Route to add a new project 
router.post('/projects', (req, res) => {
  const  {title, description } = req.body; 
  Project.create({
    title,
    description
  }).then((response) => {
    res.json(response)
  });
});


// route to find project by ID
router.get('/projects/:id', (req, res) => {
  Project.findById(req.params.id)
    .then((theProjectFromDB) => {
      res.json(theProjectFromDB);
    });
});

// Route to update a project
router.put('/projects/:id', (req, res) => {
  const projectId = req.params.id;
  const projectWithNewDetails = req.body;

  Project.findByIdAndUpdate(projectId, projectWithNewDetails)
  .then(() => {
    res.json({message: `Project with ${req.params.id} was updated.`})
  })
})

// Route to delete a specific project
router.delete('/projects/:id', (req, res) => {
  Project.findByIdAndRemove(req.params.id)
  .then(() => {
    res.json({message: `Project with id ${req.params.id} was deleted`})
  })
})

module.exports = router;