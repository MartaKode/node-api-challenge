const express = require('express')
const cors = require('cors') //~~~~~Stretch~~~~~

const projectsRouter = require('../projects/projectsRouter.js')
const actionsRouter = require('../actions/actionsRouter.js')

const router = express.Router()

router.use(express.json())  //json middleware
router.use(cors()) //~~~~Stretch~~~~

router.get('/', (req,res) => {
    res.send('<h1>Marta`s sprint challenge api page </h1>')
})

router.use('/projects', projectsRouter)
router.use('/actions', actionsRouter)

module.exports = router