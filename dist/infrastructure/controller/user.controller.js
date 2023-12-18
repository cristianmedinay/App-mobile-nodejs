"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
/* import User, {IUser} from '../models/user' */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const privateKey = fs_1.default.readFileSync('jwtRS256.key');
const signOptions = {
    expiresIn: "10s",
    algorithm: "RS256"
};
function createToken(user) {
    const signedToken = jsonwebtoken_1.default.sign({ "UserInfo": {
            "email": user.email,
            "roles": user.roles,
            "items": user.items
        } }, privateKey, signOptions);
    /*  const obj:TokenData = {
        expiresIn:"10m",
        token:signedToken
    } */
    return signedToken;
}
function refreshToken(user) {
    const refreshToken = jsonwebtoken_1.default.sign({ "UserInfo": { name: user.name, email: user.email } }, privateKey, {
        expiresIn: "10s",
        //expiresIn: "1d",
        algorithm: "RS256"
    });
    /*   const obj:TokenData = {
         expiresIn:"1d",
         token:refreshToken
     } */
    return refreshToken;
}
class UserController {
    constructor(userUseCase) {
        this.userUseCase = userUseCase;
        this.getUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            /* console.log(req.query) */
            const user = yield this.userUseCase.getDetaiEmail(`${email}`);
            if (!user) {
                return res.status(400).json({ msg: 'el usuario no existe' });
            }
            res.send({ id: user.id, name: user.name, email: user.email, picture: user.url, available: user.available });
        });
        this.updatedUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, url } = req.body;
            console.log(req.body);
            yield this.userUseCase.updateList(`${email}`, url);
            /* res.status(200).json({status:true}) */
            const user = yield this.userUseCase.getDetaiEmail(`${email}`);
            if (!user) {
                return res.status(400).json({ msg: 'el usuario no existe' });
            }
            res.send({ id: user.id, name: user.name, email: user.email, picture: user.url, available: user.available });
        });
        this.getAllUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtener todos los usuarios
                const users = yield this.userUseCase.getAllUsers();
                // Verificar si hay usuarios
                if (!users || users.length === 0) {
                    return res.status(404).json({ msg: 'No se encontraron usuarios' });
                }
                // Mapear la información que deseas enviar en la respuesta
                const mappedUsers = users.map(user => ({
                    id: user.uuid,
                    name: user.name,
                    email: user.email,
                    picture: user.url,
                    available: user.available
                }));
                // Enviar la respuesta con la lista de usuarios
                res.status(200).json(mappedUsers);
                console.log(mappedUsers);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ msg: 'Error al obtener usuarios' });
            }
        });
        //registrarse
        this.signUp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            /* console.log(req.body) */
            if (!req.body.email || !req.body.password) {
                return res.status(400).json({ msg: 'Porfavor envia tu email y contraseña' });
            }
            const user = yield this.userUseCase.getDetaiEmail(req.body.email);
            if (user) {
                return res.status(400).json({ msg: 'El usuario existe' });
            }
            return yield this.userUseCase.registerUsers(req.body).then(result => {
                return res.status(201).json(result);
            }).catch(err => {
                return res.sendStatus(400).send({
                    message: err.message || "some error occured"
                });
            });
        });
        //login
        this.signIn = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const cookies = req.cookies;
            //console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
            if (!req.body.email || !req.body.password) {
                return res.status(400).json({ msg: 'Porfavor envia tu email y contraseña' });
            }
            const user = yield this.userUseCase.getDetaiEmail(req.body.email);
            if (!user) {
                return res.status(400).json({ msg: 'el usuario no existe', status: false });
            }
            const password = req.body.password;
            const isMatch = yield user.comparePasswords(password);
            const newUser = {
                uuid: user.uuid,
                name: user.name,
                email: user.email
            };
            //si existen tokens elimina y solo dejamos uno
            if (user.tokens.length > 0) {
                user.tokens.splice(0, user.tokens.length);
                yield user.save();
            }
            if (!isMatch) {
                return res.status(400).json({ msg: 'el correo o contraseña son incorrectas', status: false });
            }
            const roles = Object.values(user.roles).filter(Boolean);
            const tokenObject = createToken(user);
            const newRefreshToken = refreshToken(user);
            let newRefreshTokenArray = !cookies.jwt ? user.refreshToken : user.refreshToken.filter((rt) => rt !== cookies.jwt);
            if (cookies === null || cookies === void 0 ? void 0 : cookies.jwt) {
                const refreshToken = cookies.jwt;
                const foundToken = yield this.userUseCase.searchUser({ refreshToken: refreshToken });
                /* console.log(foundToken); */
                if (!foundToken) {
                    /*                   console.log('attempted refresh token reuse at login!')
                     */ newRefreshTokenArray = [];
                }
                user.refreshToken = user.refreshToken.filter((rt) => rt !== refreshToken);
                ;
                yield user.save();
                res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax', secure: false });
            }
            /* let oldTokens = user.tokens || [];
               if (oldTokens.length) {
                 oldTokens = oldTokens.filter((tim: any) => {
                   const timeDiff = (Date.now() - parseInt(tim.signedAt)) / 1000;
    
                   if (timeDiff < 85300) {
                     return tim;
                   }
                 });
               }  */
            /*  await this.userUseCase.updateToken(true,user._id,oldTokens,tokenObject); */
            user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = yield user.save();
            /*  console.log(result); */
            //res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'lax',secure: false, maxAge: 24 * 60 * 60 * 1000  })
            res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'lax', secure: false });
            res.status(200).json({ token: tokenObject, status: true, user: newUser, roles });
        });
        this.prueba = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const cookies = req.cookies;
            console.log(cookies);
            res.status(200).json({ status: true });
        });
        this.storeTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, items } = req.body;
            const user = yield this.userUseCase.updateTodoList(`${email}`, items);
            res.status(200).json({ status: true, users: user });
        });
        this.getUserTodoList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const user = yield this.userUseCase.getDetaiEmail(`${email}`);
            if (!user) {
                return res.status(400).json({ msg: 'el usuario no existe' });
            }
            res.status(200).json({ status: true, items: user.items });
        });
        this.deleteTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, id } = req.body;
            console.log(email);
            const user = yield this.userUseCase.deleteTodoList(`${email}`, id);
            res.status(200).json({ status: true });
        });
        this.handleRefreshToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const cookies = req.cookies;
            console.log(cookies);
            if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)) {
                return res.status(401).send({
                    message: 'unauthenticated'
                });
            }
            const refreshToken = cookies.jwt;
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
            const foundUser = yield this.userUseCase.searchUser({ refreshToken: refreshToken });
            //verificamos el refreshtoken
            if (!foundUser) {
                jsonwebtoken_1.default.verify(refreshToken, privateKey, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        return res.sendStatus(403);
                    console.log('attempted refresh token reuse!');
                    const hackedUser = yield this.userUseCase.searchUser({ name: decoded.username });
                    hackedUser.refreshToken = [];
                    const result = yield hackedUser.save();
                }));
                return res.sendStatus(403).send({
                    message: 'unauthenticated'
                });
            }
            const newRefreshTokenArray = foundUser.refreshToken.filter((rt) => rt !== refreshToken);
            jsonwebtoken_1.default.verify(refreshToken, privateKey, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log('expired refresh token');
                    foundUser.refreshToken = [...newRefreshTokenArray];
                    const result = yield foundUser.save();
                }
                if (err || foundUser.email !== decoded.email) {
                    return res.sendStatus(403);
                }
                //CREAMOS EL TOKEN
                const roles = Object.values(foundUser.roles);
                const accessToken = jsonwebtoken_1.default.sign({
                    "UserInfo": {
                        "email": decoded.email,
                        "roles": roles
                    }
                }, privateKey, { expiresIn: '10s', algorithm: "RS256" });
                //CREAMOS EL REFRESH
                const newRefreshToken = jsonwebtoken_1.default.sign({ "name": foundUser.name, "email": foundUser.email }, privateKey, { expiresIn: '1s', algorithm: "RS256" }
                //{ expiresIn: '1d', algorithm: "RS256" }
                );
                foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
                const result = yield foundUser.save();
                //GUARDAMOS EN LAS COOKIES EL REFRESH Y EN LA BBDD
                res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 });
                console.log(newRefreshToken);
                //devolvemos token
                res.json({ token: accessToken, status: true, roles });
            }));
        });
        this.isAuth = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (req.headers && req.headers.authorization) {
                const token = req.headers.authorization.split(' ')[1];
                const refreshToken = req.cookies.jwt;
                let user;
                //VERIFICAMOS TOKEN Y REFRESH
                if (!token && !refreshToken) {
                    return res.status(401).send('Access Denied. No token provided.');
                }
                try {
                    //VERIFICAMOS EL TOKEN Y USUARIO, PASAMOS AL SIGUIENTE FUNCION
                    const decode = jsonwebtoken_1.default.verify(token, privateKey);
                    user = yield this.userUseCase.getDetaiEmail(decode.UserInfo.email);
                    if (!user) {
                        return res.status(401).send({ message: 'unauthenticated expired' });
                    }
                    req.user = user;
                    next();
                }
                catch (error) {
                    //VERIFICAMOS EL REFRESH TOKEN
                    if (!refreshToken) {
                        return res.status(401).send('Access Denied. No refresh token provided.');
                    }
                    /*     try {
                        //CREAMOS VERIFY Y SING ENVIAMOS EL USUARIO
                        const roles = Object.values(user.roles).filter(Boolean);
                        const decoded:any = jwt.verify(refreshToken, privateKey);
                        const accessToken = jwt.sign({ "UserInfo": { "name": decoded.name, "roles": roles }}, privateKey, { expiresIn: "10m", algorithm: "RS256" });
                        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', secure: false })
                        .header('Authorization', accessToken)
                        .send(decoded);
                        console.log(decoded)
                        } catch (error) {
                          return res.status(400).send('Invalid Token.');
                        }
                    */
                    //VERIFICAMOS ERRORS DE TOKEN
                    if (error.name === 'JsonWebTokenError') {
                        return res.json({ success: false, message: 'unauthorized access!' });
                    }
                    if (error.name === 'TokenExpiredError') {
                        return res.json({
                            success: false,
                            message: 'sesson expired try sign in!',
                        });
                    }
                }
            }
            else {
                res.json({ success: false, message: 'unauthorized access!' });
            }
        });
        //
        this.signOut = (req, res) => __awaiter(this, void 0, void 0, function* () {
            /*  if (req.headers && req.headers.authorization) { */
            //verificamos cookies
            const cookies = req.cookies;
            if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)) {
                return res.sendStatus(204);
            }
            const refreshToken = cookies.jwt;
            //verificamos el refresh token
            const foundUser = yield this.userUseCase.searchUser({ refreshToken: refreshToken });
            if (!foundUser) {
                res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax', secure: false });
                return res.sendStatus(204);
            }
            //verificamos el token
            /* const token = req.headers.authorization.split(' ')[1];
            const {tokens,_id}:any = req.user;
            if (!token) {
              return res
                .status(401)
                .json({ success: false, message: 'Authorization fail!' });
            }
             console.log(token) */
            //borramos el token
            /*     const newTokens = tokens.filter((t:any) =>t.tokenObject!==token);
                await this.userUseCase.updateToken(false,_id,newTokens); */
            //borramos el refresh
            foundUser.refreshToken = foundUser.refreshToken.filter((rt) => rt !== refreshToken);
            ;
            yield foundUser.save();
            //borramos cookies
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax', secure: false });
            res.json({ success: true, message: 'Sign out successfully!' });
            console.log(cookies);
            /*  }else{
                 res.json({ success: false, message: 'Authorization fail!' });
     
             } */
        });
    }
}
exports.UserController = UserController;
