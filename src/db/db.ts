import { MongoClient } from "mongodb";
import { BlogsType } from "../models/blog_models/BlogsModel";
import { PostsType } from "../models/post_models/PostsModel";
import { UserType } from "../models/user_models/UserModel";
import { settingEnv } from "../setting-env";
import { CommentType } from "../models/comment_models/CommentModel";
import { AuthTokenType } from "../models/auth_models/AuthModel";
import { DeviceDbType } from "../models/security/deviceDbModel";


 
const mongoUri = settingEnv.MONGO_URL

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
export const collectionUser = blogDB.collection<UserType>('users')
export const collectionComment = blogDB.collection<CommentType>('comments')
export const collectionAuth = blogDB.collection<AuthTokenType>('auth')
export const collectionDevice = blogDB.collection<DeviceDbType>('device')


