const express = require('express')

const projectDb = require('../data/helpers/projectModel')
const actionDb = require('../data/helpers/actionModel')

const router = express.Router()

router.use('/:id', validateProjectId) // Buddy shortcut for middleware applied to multiple methods
// CRUD operations:
//``````````GET```````````
// get projects
router.get('/', (req, res) => {
    projectDb.get()
        .then(projects => {
            console.log(projects)
            res.status(200).json(projects)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: 'error fetching projects' })
        })
})

//get project by id
router.get('/:id', (req, res) => {
    res.status(200).json(req.project)
})

//get project's actions
router.get('/:id/actions', (req, res) => {
    projectDb.getProjectActions(req.params.id)
        .then(actions => {
            console.log(actions)
            res.status(200).json(actions)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: 'error fetching actions for that project' })
        })
})

//```````````POST```````````````````
//post new project
router.post('/', validateProject, (req, res) => {
    projectDb.insert(req.body)
        .then(newProject => {
            console.log(newProject)
            res.status(201).json(newProject)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'error adding new project' })
        })
})

//post new action by project id
router.post('/:id/actions', validateAction, (req, res) => {
    const upgradedReqBody = {...req.body, project_id: req.params.id}
    actionDb.insert(upgradedReqBody)
    .then(newAction =>{
        console.log(newAction)
        res.status(201).json(newAction)
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({message: 'error adding new action'})
    })
})

//``````````DELETE````````
router.delete('/:id', (req, res) =>{
  projectDb.get(req.params.id)
  .then(project =>{

    projectDb.remove(req.params.id)
    .then(totalDeleted =>{
        res.status(200).json({message: `successfully deleted ${totalDeleted} project(s)`, deleted_project: project})
    })

  })  
  .catch(err =>{
      console.log(err)
  })
})

// ````````PUT`````````
router.put('/:id', validateProject, (req, res) =>{ //should I validate project for put?
    projectDb.update(req.params.id, req.body)
    .then(updatedProject =>{
        console.log(updatedProject)
        res.status(200).json({message:'successfully updated', updated_project: updatedProject})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error: 'error updating project'})
    })
})


// `````````````````custom middleware? 
function validateProjectId(req, res, next) {
    projectDb.get(req.params.id)
        .then(project => {
            console.log('validateProjectId:', project)
            if (!project) {
                res.status(404).json({ message: 'invalid project id' })
            } else {
                req.project = project
                next()
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: 'error validating project id' })
        })
}

function validateProject(req, res, next) {
    if (!Object.keys(req.body).length) {
        res.status(404).json({ message: "you didn't provide any data" })
    } else if (!req.body.name || !req.body.description) {
        res.status(404).json({ message: "missing required fields name and/or description" })
    } else {
        next()
    }
}

function validateAction(req, res, next) {
    // console.log('validateActions description length:', req.body.description.length)
    if (!Object.keys(req.body).length) {
        res.status(404).json({ message: "you didn't provide any data" })
    } else if (!req.body.description || !req.body.notes) {
        res.status(404).json({ message: 'missing required fields description and/or notes' })
    } else if (req.body.description.length > 128) {
        res.status(400).json({ message: "max length for description is 128 characters" })
    } else {
        next()
    }
}

module.exports = router