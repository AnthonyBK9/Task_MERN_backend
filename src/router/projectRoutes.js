import express  from 'express'
import { getProjects,
    newProject,
    getProject,
    editProject,
    deleteProject,
    searchPartner,
    addPartners,
    deletePartners,
     } from '../controllers/proyectController.js'
import cheackAuth  from '../middleware/cheackAuth.js'

const router = express.Router()

router.route('/')
    .get(cheackAuth, getProjects)
    .post(cheackAuth, newProject)

router.route('/:id')
    .get(cheackAuth, getProject)
    .put(cheackAuth, editProject)
    .delete(cheackAuth, deleteProject)

router.post('/partners', cheackAuth, searchPartner)
router.post('/partners/:id', cheackAuth, addPartners)
router.post('/delete-partner/:id', cheackAuth, deletePartners)

export default router