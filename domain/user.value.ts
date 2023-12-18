import { UserEntity } from "./user.entity";
import { v4 as uuidv4 } from 'uuid';

export class UserValue implements UserEntity{
    uuid:string;
    name:string;
    email:string;
    password:string;
    url:string;

    constructor({name, email, password, url}:{name:string,email:string,password:string,url:string}){
        this.uuid=uuidv4();
        this.name=name;
        this.email=email;   
        this.password=password;   
        this.url=url;
    }
    
}