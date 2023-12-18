import {Router} from 'express'
import { UserController } from '../controller/user.controller';
import {MongoRepository} from '../repositories/mongo.repository'
import { UserUseCase } from '../../application/userUseCase';



const router = Router();
/**
 * Iniciar Repository
 */
//const mosckUserRepository = new MongoRepository()
const userRepo = new MongoRepository()

/**
 * Iniciamos casos de uso
 */
const userUseCase = new UserUseCase(userRepo)

/**
 * Iniciar User Controller
 */
const userCtrl = new UserController(userUseCase)


router.post('/users',userCtrl.getUser)
router.post('/updated',userCtrl.updatedUser)
router.post('/allusers',userCtrl.getAllUsers)
router.post('/signup',userCtrl.signUp)
router.post('/signin',userCtrl.signIn)
router.post('/signout',userCtrl.isAuth,userCtrl.signOut);
//router.post('/signout',userCtrl.signOut);
router.post('/refresh',userCtrl.handleRefreshToken)
router.post('/prueba',userCtrl.prueba)
router.post('/storetodo',userCtrl.storeTodo)
router.post('/getusertodolist',userCtrl.getUserTodoList)
router.post('/deletetodo',userCtrl.deleteTodo)
export default router;