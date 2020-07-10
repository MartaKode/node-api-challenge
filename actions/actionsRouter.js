const express = require('express')

// const projectDb = require('../data/helpers/projectModel')
const actionDb = require('../data/helpers/actionModel')

const router = express.Router()

router.use('/:id', validateActiontId)
// CRUD operations:
//``````````GET```````````
//get actions
router.get('/', (req, res) => {
    actionDb.get()
        .then(actions => {
            console.log(actions)
            res.status(200).json(actions)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: 'error fetching actions' })
        })
})

//get action by id
router.get('/:id', (req, res) => {
    res.status(200).json(req.action)
})

//`````````POST``````````` 
// --> done in projectsRouter


//````````````DELETE```````````
router.delete('/:id', (req, res) => {
    actionDb.get(req.params.id)
        .then(deletedAction => {

            actionDb.remove(req.params.id)
                .then(totalDeleted => {
                    res.status(200).json({ message: `successfully deleted ${totalDeleted} action(s)`, deleted_action: deletedAction })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({ error: 'error deleting action' })
                })

        })
        .catch(err => {
            console.log(err)
        })
})

//````````````PUT`````````````
router.put('/:id', validateAction, (req, res) => {
    console.log('req.body',req.body)
    actionDb.update(req.params.id, req.body)
    .then( updatedAction => {
        console.log(updatedAction)
        res.status(200).json({message:'successfully updated', updated_action: updatedAction})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error: 'error updating action'})
    })
})



// `````````````````custom middleware? 
function validateActiontId(req, res, next) {
    actionDb.get(req.params.id)
        .then(action => {
            console.log('validateActionId:', action)
            if (!action) {
                res.status(404).json({ message: 'invalid action id' })
            } else {
                req.action = action
                next()
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: 'error validating action id' })
        })
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