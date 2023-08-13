const express=require('express');
const bodyParser=require('body-parser');
const apiRoutes=require('./routes/index');
const db=require('./models/index');
const app=express();
const {PORT}=require('./config/serverconfig');
const setupAndStartService=()=>{
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    app.use('/api',apiRoutes);

    app.listen(PORT,()=>{
        console.log(`Server Started at PORT ${PORT}`);

        if(process.env.DB_SYNC){
            db.sequelize.sync({alter:true});
        }
    });
}
setupAndStartService();