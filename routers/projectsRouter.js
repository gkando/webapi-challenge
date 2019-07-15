const express = require('express');

const db = require('../data/helpers/projectModel.js');
const router = express.Router();

//C
router.post('/', validateProject, (req, res) => {
  const project = req.body;
  db.insert(project)
  .then(result => {
    console.log(result)
    res.status(201).json({
      success: true,
      result: result
    });
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({
      success: false,
      error: error
    });
  });
});

//R 
router.get('/:id', validateProjectId, (req, res) => {
  const project = req.body.project
  if (project) {
    res.status(200).json({
      success: true,
      project: project
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'The Project Information Could Not Be Retrieved',
    });
  }
});

router.get('/:id/actions', validateProjectId, (req, res) => {
  const id = req.params.id;
  db.getProjectActions(id)
  .then(result => {
    res.status(201).json({
      success: true,
      result: result
    });
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({
      success: false,
      error: error
    });
  });
});

//U
router.put('/:id', validateProject, validateProjectId, (req, res) => {  
  const id = req.params.id;
  const old  = req.body.project;
  delete req.body.project;
  const changes  = req.body;
  db.update(id, changes)
  .then(count => {
    res.status(200).json({
      success: true, 
      changes: changes,
      old: old, 
      count:   count
    });
  })
  .catch(error => {
    console.log(error)
    res.status(500).json(error);
  })  
});


//D
router.delete('/:id', validateProjectId, (req, res) => {
  db.remove(req.params.id)
  .then(count => {
    res.status(200).json({ 
      success: true, 
      message: 'The project has been deleted.',
      count: count
    });
  }) 
    .catch(error => {
      console.log(error);
      res.status(500).json({
      success: false,
      message: 'The user could not be removed',
    });
  });
});

//custom middleware
function validateProjectId(req, res, next) {
  const id = req.params.id
  db.get(id)
  .then(project => {
    if (project === null) {
      res.status(404).json({
        success: false,
        message: 'The Project With the Specified ID Does Not Exist.'
      });
    } else{
      req.body.project = project;
      next();
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      success: false,
      error: 'The Project Information Could Not Be Retrieved',
    });
  })
};

function validateProject(req, res, next) {
  if (!req.body.name || !req.body.description) {   
    let msg =  typeof Object.keys(req.body) !== 'undefined' ? 'Body Null' : Object.keys(req.body.name).length === 0 ?
      'Missing Project Name' :
      'Missing Required Description Field'
    res.status(400).json({
      success: false,
      errorMessage: msg
    });
  } else {
    next();
  }
};

module.exports = router;