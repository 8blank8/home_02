import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
import { BlogsType } from "../models/BlogsModel";
import { PostsType } from "../models/PostsModel";


dotenv.config()
// process.env.MONGO_URL
 
const mongoUri = 'mongodb://0.0.0.0:27017'
console.log(mongoUri) 

if(!mongoUri){ 
    throw Error('Connection failed')
} 
 
export const client = new MongoClient(mongoUri);

export const runDb = async () => {
    try{
        await client.connect()
        console.log('Connected successfully to mongo server')
    } catch { 
        await client.close()
        console.log('Connection failed')
    }
}

const blogDB = client.db('BlogPlatform')
export const collectionPost = blogDB.collection<PostsType>('posts')
export const collectionBlog = blogDB.collection<BlogsType>('blogs')


