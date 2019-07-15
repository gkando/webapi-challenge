const express = require('express');

const db = require('../data/helpers/actionModel.js');
const router = express.Router();


//C
router.post('/', validateAction, (req, res) => {
  const action = req.body;
  db.insert(action)
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
router.get('/:id', validateActionId, (req, res) => {
  const action = req.body.action
  if (action) {
    res.status(200).json({
      success: true,
      action: action
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'The Project Information Could Not Be Retrieved',
    });
  }
});

//U
router.put('/:id', validateAction, validateActionId, (req, res) => {  
  const id = req.params.id;
  const old  = req.body.action;
  delete req.body.action;
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
router.delete('/:id', validateActionId, (req, res) => {
  db.remove(req.params.id)
  .then(count => {
    res.status(200).json({ 
      success: true, 
      message: 'The action has been deleted.',
      count: count
    });
  }) 
    .catch(error => {
      console.log(error);
      res.status(500).json({
      success: false,
      message: 'The action could not be removed',
    });
  });
});

//middleware
function validateActionId(req, res, next) {
  const id = req.params.id
  db.get(id)
  .then(action => {
    if (action === null) {
      res.status(404).json({
        success: false,
        message: 'An Action With the Specified ID Does Not Exist.'
      });
    } else{
      req.body.action = action;
      next();
    }
  })
}

function validateAction(req, res, next) {
  if (!req.body.project_id || !req.body.description || !req.body.notes) {   
    let msg =  typeof Object.keys(req.body) !== 'undefined' ? 'Body Null' : Object.keys(req.body.project_id).length === 0 ?
      'Missing Project ID' :
      'Missing Required Description and/or Notes Field'
    res.status(400).json({
      success: false,
      errorMessage: msg
    });
  } else {
    next();
  }
};

module.exports = router;