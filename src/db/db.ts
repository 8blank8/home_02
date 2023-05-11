import { MongoClient } from "mongodb";
import dotenv from 'dotenv';


dotenv.config()

const mongoUri = process.env.MONGO_URL || "mongodb://0.0.0.0:27017/"
console.log(mongoUri)

const client  = new MongoClient(mongoUri)

const blogDB = client.db('BlogPlatform')
export const collectionBlog = blogDB.collection('blogs')
export const collectionPost = blogDB.collection('posts')

export const runDb = async () => {
    try{
        await client.connect()

        await client.db('test').command({ping: 1})
        console.log('Connected successfully to mongo server')
    } catch {
        console.log('Connection failed')

        await client.close()
    }
}