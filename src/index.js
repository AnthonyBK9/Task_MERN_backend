import express from 'express'
import http from 'http'
import connectDB from './config/db.js'
import dotenv from 'dotenv'
import cors from 'cors'
import usuarioRoutes from './router/userRoutes.js'
import proyectRoutes from './router/projectRoutes.js'
import taskRoutes from './router/taskRoutes.js'

//?? Socket.io
import { Server } from 'socket.io'


dotenv.config()
const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
connectDB() //Conexión a la base de datos
app.use(cors())

//? Configuración de Socket.io 
const httpServer = http.createServer(app)
const io = new Server(httpServer,{
    cors: {
        origin: '*'
    }
})

io.on('connection', (socket) => {
    //? Verificamos si la conexión fue correcta
    console.log('Conectado a socket.io');
    
    //?Definir los eventos de socket.io
    socket.on('openProject', (project) => {
        socket.join(project)
    })

    socket.on('newTask', (task) => {
        //? Extraer el proyecto de la tarea
        const project = task.project
        //? Se emite para consumirlo desde el Front End
        socket.to(project).emit('addTask', task);     
    })

    socket.on('deleteTask', (task) => {
        console.log(task);
        const project = task.project
        socket.to(project).emit('removeTask', task);
    })

    socket.on('updateTask', task => {
        const project = task.project._id
        socket.to(project).emit('updatedTask', task)
    });

    socket.on('completeTask', task => {
        const project = task.project._id
        socket.to(project).emit('completedTask', task)
    })
})

//Configuracion CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Routing
app.use('/api/users', usuarioRoutes)
app.use('/api/projects', proyectRoutes)
app.use('/api/task', taskRoutes)

httpServer.listen(port, () => {
    console.log('Servidor corriendo en el puerto', port)
})

