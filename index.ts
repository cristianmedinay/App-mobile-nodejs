import {app,io} from './app'
import dbInit from './infrastructure/database/database'
const port =  process.env.PORT || 3002
dbInit()
io.listen(5000);
app.listen(port,()=>console.log(`Listo por el puerto ${port}`));