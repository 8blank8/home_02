import { MongoClient } from "mongodb";
import dotenv from 'dotenv';


dotenv.config()
// 'mongodb://0.0.0.0:27017'
 
const mongoUri = process.env.MONGO_URL
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
export const collectionPost = blogDB.collection('posts')
export const collectionBlog = blogDB.collection('blogs')


