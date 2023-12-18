import { UserEntity } from "./user.entity";

//CAPA DE ABSTRACCION DE DIFERENTES METODOS, 
export interface UserRepository{
    findUserById(uuid:string):Promise<UserEntity | null>;
    findUserEmail(email:string):Promise<any>;
    findListTodo(email:string,newItem:Object):Promise<any>;
    findDeleteTodo(email: string,id:number):Promise<any>;
    registerUser(user:UserEntity):Promise<UserEntity|null>;
    listUser():Promise<UserEntity[] | null>;
    updateListImagen(email: string,url:string):Promise<UserEntity[] | null>;
    findUserId(user:any):Promise<any | null>;
    tokenUser(option:boolean,id:string,oldTokens:any,tokenObject?:any,newTokens?:any):Promise<any | null>;
    findUser(user:any):Promise<any |null>;
}
