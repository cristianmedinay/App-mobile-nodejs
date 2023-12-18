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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUseCase = void 0;
const user_value_1 = require("../domain/user.value");
class UserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.registerUsers = ({ name, email, password, url }) => __awaiter(this, void 0, void 0, function* () {
            const userValue = new user_value_1.UserValue({ name, email, password, url });
            const userCreated = yield this.userRepository.registerUser(userValue);
            return userCreated;
        });
        this.getAllUsers = () => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.listUser();
            return user;
        });
        this.getDetailUser = (uuid) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserById(uuid);
            return user;
        });
        this.getDetaiEmail = (email) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserEmail(email);
            return user;
        });
        this.updateList = (email, url) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.updateListImagen(email, url);
            return user;
        });
        this.updateTodoList = (email, newItem) => __awaiter(this, void 0, void 0, function* () {
            const todolist = yield this.userRepository.findListTodo(email, newItem);
            return todolist;
        });
        this.deleteTodoList = (email, id) => __awaiter(this, void 0, void 0, function* () {
            const todolist = yield this.userRepository.findDeleteTodo(email, id);
            return todolist;
        });
        this.updateToken = (option, _id, oldTokens, tokenObject, newTokens) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.tokenUser(option, _id, oldTokens, tokenObject, newTokens);
            return user;
        });
        this.getUserId = (id) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserId(id);
            return user;
        });
        this.searchUser = (tokenUser) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUser(tokenUser);
            return user;
        });
    }
}
exports.UserUseCase = UserUseCase;
