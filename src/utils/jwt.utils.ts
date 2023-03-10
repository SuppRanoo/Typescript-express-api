import jwt from "jsonwebtoken";
import config from "config";
import log from "../logger";
import { object } from "yup";

const privateKey = config.get("privateKey") as string;

export function sign(object: Object, options?: jwt.SignOptions | undefined){
    return jwt.sign(object, privateKey, options)
}

export function decode(token: string){
    try{
        const decoded = jwt.verify(token, privateKey);
        return {valid: true, expired: false, decoded};
    }
    catch(error){
        let e:any = error;
        return {valid: true, expired: e.message==="jwt expired", decoded:null};
    }
}