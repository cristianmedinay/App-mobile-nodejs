import {app,io} from './app'
import dbInit from './infrastructure/database/database'
const port =  process.env.PORT || 3000
dbInit()
io.listen(4000);
app.listen(port,()=>console.log(`Listo por el puerto ${port}`));