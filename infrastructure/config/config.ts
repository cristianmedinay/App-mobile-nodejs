import 'dotenv/config'
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
export default {
    MONGODB_URI:  process.env.MONGODB_URI ?? '',

    jwtSecret: process.env.JWT_SECRET ?? '',
    DB: {
        URI: process.env.MONGODB_URI ?? '',
        USER: process.env.MONGODB_USER ?? '',
        PASSWORD: process.env.MONGODB_PASSWORD ?? '',
    }

}