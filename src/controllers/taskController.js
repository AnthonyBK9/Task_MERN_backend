import Project from "../models/Project.js"
import Task from "../models/Task.js"

const addTask = async (req, res) => {

    const { project } = req.body
    const thereIsProject = await Project.findById(project)
    if(!thereIsProject){
        const error = new Error('El Proyecto no Existe')
        return res.status(404).json({message: error.message})
    }

    if(thereIsProject.creator.toString() !== req.user._id.toString()){
        const error = new Error('No tienes los permisos para añadir tareas')
        return res.status(403).json({message: error.message})
    }

    try {
        const storedTask = await Task.create(req.body)
        // Almacena el ID en el proyecto
        thereIsProject.tasks.push(storedTask._id)
        await thereIsProject.save()
        res.status(201).json(storedTask)
    } catch (error) {
        console.log(error)
    }

}

const getTask = async (req, res) => {

    const { id } = req.params
    const task = await Task.findById(id).populate('project')

    if (!task) {
        const error = new Error('Tarea no encontrada')
        return res.status(404).json({message: error.message})
    }

    if (task.project.creator.toString() !== req.user._id.toString()) {
        const error = new Error('Accion no valida')
        return res.status(403).json({message: error.message})
    }
    res.status(200).json(task)


}

const updateTask = async (req, res) => {
    const { id } = req.params
    const task = await Task.findById(id).populate('project')

    if (!task) {
        const error = new Error('Tarea no encontrada')
        return res.status(404).json({message: error.message})
    }

    if (task.project.creator.toString() !== req.user._id.toString()) {
        const error = new Error('Accion no valida')
        return res.status(403).json({message: error.message})
    }

    task.name = req.body.name || task.name
    task.description = req.body.description || task.description
    task.priority = req.body.priority || task.priority
    task.deliveryDate = req.body.deliveryDate || task.deliveryDate

    try {
        const addTask = await task.save()
        res.status(201).json(addTask)
    } catch (error) {
        console.log(error)
    }

}

const deleteTask = async (req, res) => {
    const { id } = req.params
    const task = await Task.findById(id).populate('project')

    if (!task) {
        const error = new Error('Tarea no encontrada')
        return res.status(404).json({message: error.message})
    }

    if (task.project.creator.toString() !== req.user._id.toString()) {
        const error = new Error('Accion no valida')
        return res.status(403).json({message: error.message})
    }

    try {
        const project = await Project.findById(task.project)
        project.tasks.pull(task._id)
        await Promise.allSettled([await project.save(), await task.deleteOne() ])
        res.status(201).json({msg: 'Tarea eliminada'})
    } catch (error) {
        console.log(error);
    }
}

const changeStatus = async (req, res) => {
    const { id } = req.params
    const task = await Task.findById(id).populate('project')

    if (!task) {
        const error = new Error('Tarea no encontrada')
        return res.status(404).json({message: error.message})
    }
    //Validar que sea el creador o colaborador para marcar completada la tarea
    if (task.project.creator.toString() !== req.user._id.toString() && 
        !task.project.partners.some(partner => partner._id.toString() === req.user._id.toString())) {
        const error = new Error('Accion no valida')
        return res.status(403).json({message: error.message})
    }

    task.state = !task.state
    task.completed = req.user._id
    await task.save()
    const storedTask = await Task.findById(id).populate('project').populate('completed')
    res.status(200).json(storedTask)
}

export {
    addTask,
    getTask,
    updateTask,
    deleteTask,
    changeStatus
}