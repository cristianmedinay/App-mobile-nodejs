import express from 'express'
import { createServer } from 'http'  
import { Server } from 'socket.io'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './infrastructure/router/auth.routes'
import passport from 'passport'
import passportMiddleware from './infrastructure/middleware/passport'
import specialRoutes from './infrastructure/router/special.routes'
import cookies  from 'cookie-parser';
import 'dotenv/config'
const app = express();

require('dotenv').config({ path: `${__dirname}/../.env` })

//settings
/* app.set('port', process.env.PORT || 3000) */


//middlewares, leer formatos json y urlencoded

app.use(express.urlencoded({extended:false}))
app.use(express.json())
const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin: ['http://localhost:5173',"http://127.0.0.1:3000"]
    }
});

app.use(cookies());
app.use(cors({
    origin: ['http://localhost:3000','http://192.168.1.37:3000','http://127.0.0.1:3000','http://localhost:3001','http://localhost:5173'],
    credentials: true
}));
app.use(morgan('dev'))

console.log(process.env.KEYS)

app.use(passport.initialize())
passport.use(passportMiddleware)
//routes

interface User {
    name: string;
}
/* app.get('/',(req,res)=>{
    res.send(`The api is at http://localhost:${app.get('port')}`)
}) */
app.use(authRoutes);
app.use(specialRoutes);
let users: User[] = [{'name':'this.nombreUsuario1696780753597' },{ 'name':'this.nombreUsuario1696782325330'}]
let datos:any = [];
io.on('connection', (socket) => {

    console.log('a user connected');

    socket.on('increment', (arg) => {
        
        datos.push(arg)
      
        if(datos.length>1){

        const indiceAReemplazar = datos.findIndex((objeto:any) => objeto.remitente === arg.remitente);
      
        if (indiceAReemplazar !== -1) {            
            datos[indiceAReemplazar] = arg;        
        }

        const mensajesSinDuplicados = Array.from(new Set(datos.map((mensaje:any) => mensaje.remitente))).map((remitente:any) => datos.find((mensaje:any) => mensaje.remitente === remitente));
  
        io.emit('nuevoMensaje', mensajesSinDuplicados);

        }else{

        io.emit('nuevoMensaje', datos);

        }
       

    });
});

export { app,io};