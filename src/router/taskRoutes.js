import express from 'express'
import {  addTask,
    getTask,
    updateTask,
    deleteTask,
    changeStatus
} from '../controllers/taskController.js'
import cheackAuth from '../middleware/cheackAuth.js'


const router = express.Router()

router.post('/', cheackAuth, addTask)
router.route('/:id')
    .get(cheackAuth, getTask)
    .put(cheackAuth, updateTask)
    .delete(cheackAuth, deleteTask)

router.post('/state/:id', cheackAuth, changeStatus)


export default router