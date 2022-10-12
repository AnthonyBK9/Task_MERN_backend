import mongoose from "mongoose"

const projectsSchema = mongoose.Schema({
    name: { 
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    deliveryDate: {
        type: Date,
        default: Date.now()
    }, 
    client:{
        type: String,
        trim: true,
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    tasks: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        }
    ],
    partners: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        }
    ],
    },
    {
        timestamps: true
    }
)

const Project = mongoose.model('Project', projectsSchema)
export default Project