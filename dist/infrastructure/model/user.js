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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true,
        trim: true
    },
    uuid: {
        type: String,
        unique: true
    },
    roles: {
        User: {
            type: Number,
            default: 5
        },
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        require: true
    },
    url: {
        type: String,
        default: null
    },
    available: {
        type: Boolean,
        default: true
    },
    items: [
        {
            _id: { type: Number },
            title: { type: String },
            description: { type: String },
        }
    ],
    tokens: [{ type: Object }],
    refreshToken: [{ type: String }],
}, {
    timestamps: true
});
//CIFRANDO LA CONTRASEÑA ANTES DE GUARDAR EL DATO
//pre,save significa antes de guardar
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        //compruebo si el usuario nuevo a sido modificado, si no ha sido modificado next() continua, solo funciona para los antiguos usuarios
        if (!user.isModified('password'))
            return next();
        //si el usuario es nuevo encriptamos el password
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(user.password, salt);
        user.password = hash;
        next();
    });
});
//methodo creado para comparar contraseñas
userSchema.methods.comparePasswords = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
exports.default = (0, mongoose_1.model)('User', userSchema);
