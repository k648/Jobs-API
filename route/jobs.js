const express = require('express')
const jobsController = require('../controller/jobs')
const authorizeUser = require('../middleware/authRole')

const router = express.Router()


router.post('/jobs',jobsController.createJob)
router.delete('/jobs/:id',authorizeUser('admin','superAdmin'),jobsController.deleteJob)
router.get('/jobs',jobsController.getAllJobs)
router.get('/jobs/:id',jobsController.getJob)
router.patch('/jobs/:id',authorizeUser('admin','superAdmin'),jobsController.updateJob)


module.exports = router
