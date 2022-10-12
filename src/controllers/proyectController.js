import Project from "../models/Project.js"
import User from "../models/User.js"

const getProjects = async (req, res) => {
    const project = await Project.find({
        '$or': [
            { 'partners': {$in: req.user}}, 
            { 'creator': {$in: req.user}} 
        ]
    }).select('-tasks')
    res.status(200).json(project)
}

const newProject = async (req, res) => {

    const project = new Project(req.body)
    project.creator = req.user._id
        try {
            const storedProjects = await project.save()
            res.status(200).json(storedProjects)
        } catch (error) {
            console.log(error)
        }

}

const getProject = async (req, res) => {
    const { id } = req.params
    const project = await Project.findById(id).populate({ path: 'tasks', populate: { path: 'completed', select: 'name email _id' } }).populate('partners', 'name email _id')
    if(!project){
        const err = new Error('No encontrado')
        return res.status(404).json({msg: err.message})
    }
    if (project.creator.toString() !== req.user._id.toString() && !project.partners.some(partner => partner._id.toString() === req.user._id.toString()))  {
        const err = new Error('Accion no valida')
        return res.status(401).json({msg: err.message})
    }
    res.status(200).json(project)
}

const editProject = async (req, res) => {
    const { id } = req.params
    const project = await Project.findById(id)
    if(!project){
        const err = new Error('No encontrado')
        return res.status(404).json({msg: err.message})
    }
    if (project.creator.toString() !== req.user._id.toString()) {
        const err = new Error('Accion no valida')
        return res.status(401).json({msg: err.message})
    }

    project.name = req.body.name || project.name
    project.description = req.body.description || project.description
    project.deliveryDate = req.body.deliveryDate || project.deliveryDate
    project.client = req.body.client || project.client

    try {
        const storedProjects = await project.save()
        res.status(200).json(storedProjects)
    } catch (error) {
        console.log(error);
    }
}

const deleteProject = async (req, res) => {
    const { id } = req.params
    const project = await Project.findById(id)
    if(!project){
        const err = new Error('No encontrado')
        return res.status(404).json({msg: err.message})
    }
    if (project.creator.toString() !== req.user._id.toString()) {
        const err = new Error('Accion no valida')
        return res.status(401).json({msg: err.message})
    }

    try {
        await project.deleteOne()
        res.status(201).json({msg: 'Proyecto Eliminado'})
    } catch (error) {
        console.log(error)
    }
}

const searchPartner = async (req, res) => {
    const {email} = req.body
    //? Se realiza una consulta y optenemos la información deseada
    const user = await User.findOne({email}).select('-is_confirmed -createdAt -updatedAt -password -token -__v')

    //? Validar si el usuraio existe
    if(!user) {
        const error = new Error('Usuario no encontrado')
        return res.status(404).json({msg: error.message})
    }
    res.status(200).json(user)
}

const addPartners = async (req, res) => {
    const project = await Project.findById(req.params.id)
    //? Validar que el proyecto exista
    if(!project){
        const err = new Error('Proyecto no encontrado')
        res.status(404).json({msg: err.message})
    }
    //? Validar que el creador solo pueda agregar a colaboradores
    if(project.creator.toString() !== req.user._id.toString()){
        const err = new Error('Acción no válida')
        res.status(404).json({msg: err.message})
    }

    const {email} = req.body
    //? Se realiza una consulta y obtenemos la información deseada
    const user = await User.findOne({email}).select('-is_confirmed -createdAt -updatedAt -password -token -__v')
    // console.log(user._id.toString());
    //? Validar si el usuraio existe
    if(!user) {
        const error = new Error('Usuario no encontrado')
        return res.status(404).json({msg: error.message})
    }
    // console.log(project.creator.toString())
    // console.log(req.user._id.toString())
    //? El colavorador no es el admin del proyecto
    if(project.creator.toString() === user._id.toString()){
        const error = new Error('El Creador del Proyecto no puede ser colaborador')
        return res.status(404).json({msg: error.message})
    }
    
    //? Revisar que no esté ya agreado un usuario al proyecto
    if(project.partners.includes(user._id)){
        const error = new Error('El Usuario ya pertenece al proyecto')
        return res.status(404).json({msg: error.message})
    }

    //Todo correcto
    project.partners.push(user._id)
    await project.save()
    res.status(201).json({msg: 'Colaborador Agregado Correctamente'})

}

const deletePartners = async (req, res) => {
    const project = await Project.findById(req.params.id)
    //? Validar que el proyecto exista
    if(!project){
        const err = new Error('Proyecto no encontrado')
        res.status(404).json({msg: err.message})
    }
    //? Validar que el creador solo pueda agregar a colaboradores
    if(project.creator.toString() !== req.user._id.toString()){
        const err = new Error('Acción no válida')
        res.status(404).json({msg: err.message})
    }
    // console.log(req.body)
    project.partners.pull(req.body.id)
    await project.save()
    res.status(201).json({msg: 'Colaborador Eliminado Correctamente'})
}   

export {
    getProjects,
    newProject,
    getProject,
    editProject,
    deleteProject,
    searchPartner,
    addPartners,
    deletePartners,
}

