import { DocumentDefinition, FilterQuery } from "mongoose";
import User, {UserDocument} from "../model/user.model";
import { omit } from "lodash";

export async function createUser(input: DocumentDefinition<UserDocument>){
    try{
        return await User.create(input);
    }catch(e){
        throw new Error(e as string);
    }
}

export async function findUser(query: FilterQuery<UserDocument>){
    return User.findOne(query).lean();
}

export async function validateCredentials({
    email,
    password,
}:{
    email: UserDocument["email"];
    password: string;
}) {
    const user = await User.findOne({email});
    if(!user){
        return false;
    }
    const isValid = await user.comparePassword(password);
    if(!isValid){
        return false;
    }

    return omit(user.toJSON(), "password");
}