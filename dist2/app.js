"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const auth_routes_1 = __importDefault(require("./infrastructure/router/auth.routes"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("./infrastructure/middleware/passport"));
const special_routes_1 = __importDefault(require("./infrastructure/router/special.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const app = (0, express_1.default)();
exports.app = app;
require('dotenv').config({ path: `${__dirname}/../.env` });
//settings
/* app.set('port', process.env.PORT || 3000) */
//middlewares, leer formatos json y urlencoded
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ['http://localhost:5173', "http://127.0.0.1:3000"]
    }
});
exports.io = io;
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://192.168.1.37:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://localhost:5173'],
    credentials: true
}));
app.use((0, morgan_1.default)('dev'));
console.log(process.env.KEYS);
app.use(passport_1.default.initialize());
passport_1.default.use(passport_2.default);
/* app.get('/',(req,res)=>{
    res.send(`The api is at http://localhost:${app.get('port')}`)
}) */
app.use(auth_routes_1.default);
app.use(special_routes_1.default);
let users = [{ 'name': 'this.nombreUsuario1696780753597' }, { 'name': 'this.nombreUsuario1696782325330' }];
let datos = [];
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('increment', (arg) => {
        datos.push(arg);
        if (datos.length > 1) {
            const indiceAReemplazar = datos.findIndex((objeto) => objeto.remitente === arg.remitente);
            if (indiceAReemplazar !== -1) {
                datos[indiceAReemplazar] = arg;
            }
            const mensajesSinDuplicados = Array.from(new Set(datos.map((mensaje) => mensaje.remitente))).map((remitente) => datos.find((mensaje) => mensaje.remitente === remitente));
            io.emit('nuevoMensaje', mensajesSinDuplicados);
        }
        else {
            io.emit('nuevoMensaje', datos);
        }
    });
});
