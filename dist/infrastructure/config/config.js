"use strict";
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
/* import dotenv from 'dotenv';
dotenv.config(); */
/* export default {
   
    jwtSecret: process.env.privateKey || '',
    DB:{
        URI:process.env.MONGODB_URI || '',
        USER: process.env.MONGODB_USER,
        PASSWORD: process.env.MONGODB_PASSWORD
    }

} */
exports.default = {
    MONGODB_URI: (_a = process.env.MONGODB_URI) !== null && _a !== void 0 ? _a : '',
    jwtSecret: (_b = process.env.JWT_SECRET) !== null && _b !== void 0 ? _b : '',
    DB: {
        URI: (_c = process.env.MONGODB_URI) !== null && _c !== void 0 ? _c : '',
        USER: (_d = process.env.MONGODB_USER) !== null && _d !== void 0 ? _d : '',
        PASSWORD: (_e = process.env.MONGODB_PASSWORD) !== null && _e !== void 0 ? _e : '',
    }
};
