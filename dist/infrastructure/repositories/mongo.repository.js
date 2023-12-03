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
exports.MongoRepository = void 0;
const user_1 = __importDefault(require("../model/user"));
/**
 * MongoDB
 */
class MongoRepository {
    findUserEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findOne({ email: email });
            return user;
        });
    }
    findUserById(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findOne({ uuid });
            return user;
        });
    }
    findUserId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findById(id);
            return user;
        });
    }
    registerUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new user_1.default(newUser);
            return yield user.save();
        });
    }
    listUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.find();
            return user;
        });
    }
    findUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const u = yield user_1.default.findOne(user).exec();
            return u;
        });
    }
    tokenUser(option, id, oldTokens, tokenObject, newTokens) {
        return __awaiter(this, void 0, void 0, function* () {
            /* const tokenD = await User.findByIdAndUpdate(id, { tokens: newTokens });
              return tokenD; */
            let tokenD;
            if (option) {
                tokenD = yield user_1.default.findByIdAndUpdate(id, {
                    tokens: [...oldTokens, { tokenObject, signedAt: Date.now().toString() }],
                });
            }
            else {
                console.log('first');
                tokenD = yield user_1.default.findByIdAndUpdate(id, { tokens: { tokenObject: newTokens } });
                /*  tokenD = await User.findByIdAndUpdate(id, { tokens: {tokenObject: {
                     expiresIn: '',
                     token:newTokens
                   }} }); */
            }
            return tokenD;
        });
    }
}
exports.MongoRepository = MongoRepository;
