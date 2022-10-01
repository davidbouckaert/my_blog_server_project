import { Document } from "mongoose";

export interface BlogModel extends Document {
    title:string;
    snippet:string;
    body:string;
}