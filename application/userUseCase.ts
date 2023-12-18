import { UserRepository } from "../domain/user.repository";
import { UserValue } from "../domain/user.value";

export class UserUseCase  {
    
    constructor(private readonly userRepository:UserRepository){

    }
    public registerUsers = async({name,email,password,url}:{name:string,email:string,password:string,url:string})=>{
        const userValue = new UserValue({name,email,password,url});
        const userCreated = await this.userRepository.registerUser(userValue)
        return userCreated
    }
    
    public getAllUsers = async() => {
        const user = await this.userRepository.listUser();
        return user;
    }

    public getDetailUser = async (uuid:string) =>{
        const user = await this.userRepository.findUserById(uuid);
        return user
    }
    public getDetaiEmail = async (email:string) =>{
        const user = await this.userRepository.findUserEmail(email);
        return user
    }

    public updateList = async (email:string,url:string)=>{
        const user = await this.userRepository.updateListImagen(email,url);
        return user
    }

    public updateTodoList = async (email:string,newItem:Object) =>{
        const todolist = await this.userRepository.findListTodo(email,newItem);
        return todolist
    }
    public deleteTodoList = async (email: string,id:number) =>{
        const todolist = await this.userRepository.findDeleteTodo(email,id);
        return todolist
    }

    public updateToken = async (option:boolean,_id:string,oldTokens?:any,tokenObject?:any,newTokens?:any)=>{
        const user = await this.userRepository.tokenUser(option,_id,oldTokens,tokenObject,newTokens);
        return user
    }

    public getUserId = async (id:any)=>{
        const user = await this.userRepository.findUserId(id);
        return user;
    }
    
    public searchUser = async (tokenUser:any)=>{
        const user = await this.userRepository.findUser(tokenUser);
        return user;
    }
  

}