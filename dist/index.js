"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const database_1 = __importDefault(require("./infrastructure/database/database"));
const port = process.env.PORT || 3002;
(0, database_1.default)();
app_1.io.listen(5000);
app_1.app.listen(port, () => console.log(`Listo por el puerto ${port}`));
