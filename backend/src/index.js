
import connectDB from "./db/index.js";
import { app } from "./app.js";
import {config} from "dotenv";
config();


connectDB().then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server running on port ${process.env.PORT}`);
    })
}).catch((err)=>{
    console.error("Database connection Error: ", err);
});
































// const app = express();

// (async ()=>{
//     try{
//        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//         console.log("Connected to DB");
//         app.on("error", (error)=>{
//             console.error("Error: ", error);
//             throw error;
//         })
//         app.listen(process.env.PORT, ()=>{
//             console.log(`Server running on port ${process.env.PORT}`);
//         });
//     }catch(err){
//         console.error("Error: ",err);
//     }
// })();