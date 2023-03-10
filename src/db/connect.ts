import mongoose, { ConnectOptions } from "mongoose";
import config from "config";
import log from "../logger";

function connect() {
    const dbUri = config.get("dbUri") as string;
    mongoose.set("strictQuery", false);
    return mongoose
    .connect(dbUri,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions)
    .then(()=>{
        log.info("Database connected successfully.");
    })
    .catch(e=>{
        log.error("db error ",e);
        process.exit(1);
    });
}

export default connect;