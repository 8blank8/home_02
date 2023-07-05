import { MongoClient } from "mongodb";
import mongoose from "mongoose";

import { BlogsType } from "../models/blog_models/BlogsModel";
import { PostsType } from "../models/post_models/PostsModel";
import { UserType } from "../models/user_models/UserModel";
import { settingEnv } from "../setting-env";
import { CommentType } from "../models/comment_models/CommentModel";
import { AuthTokenType } from "../models/auth_models/AuthModel";
import { DeviceDbType } from "../models/security/deviceDbModel";
import { RateLimitType } from "../models/rate_limit/rateLimitDbModel";
import {AuthPasswordRecoveryType } from "../models/auth_models/AuthPasswordRecovery";


 
const uri = settingEnv.MONGO_URL

if(!uri){ 
    throw Error('Connection failed')
} 
 
// export const client = new MongoClient(uri + 'BlogPlatform');

export const runDb = async () => {
    try{
        await mongoose.connect(uri, {dbName: 'BlogPlatform'});
        // await client.connect()
        console.log('Connected successfully to mongo server')
    } catch {  
        // await client.close()
        await mongoose.disconnect()
        console.log('Connection failed')
    }
}

// const blogDB = client.db('BlogPlatform')
const PostSchema = new mongoose.Schema<PostsType>({
    id: String,
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true}
})

export const PostModel = mongoose.model('posts', PostSchema)

const BlogSchema = new mongoose.Schema<BlogsType>({
    id: {type: String, reqiured: true},
    name: {type: String, reqiured: true},
    description: {type: String, reqiured: true},
    websiteUrl: {type: String, reqiured: true},
    createdAt: {type: String, reqiured: true},
    isMembership: {type: Boolean, reqiured: true},
})

export const BlogModel = mongoose.model('blogs', BlogSchema)

const UserSchema = new mongoose.Schema<UserType>({
    id: {type: String, required: true},
    acountData: { type: {
        passwordHash: {type: String, required: true},
        login: {type: String, required: true},
        email: {type: String, required: true},
        createdAt: {type: Date, required: true}
    }},
    emailConfirmation: { type: {
        confirmationCode: {type: String, required: true},
        expirationDate: {type: Date, required: true},
        isConfirmed: {type: Boolean, required: true}
    }}
})

export const UserModel = mongoose.model('users', UserSchema)

const CommentSchema = new mongoose.Schema<CommentType>({
    id: {type: String, required: true},
    postId: {type: String, required: true},
    content: {type: String, required: true},
    commentatorInfo: { type: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true}
    }},
    createdAt: {type: String, required: true}
})

export const CommentModel = mongoose.model('comments', CommentSchema)

const AuthSchema = new mongoose.Schema<AuthTokenType>({
    refreshToken: {type: String, required: true}
})

export const AuthModel = mongoose.model('auth', AuthSchema)


const DeviceSchema = new mongoose.Schema<DeviceDbType>({
    ip: {type: String, required: true},
    title: {type: String, required: true},
    lastActiveDate: {type: String, required: true},
    experationDate: {type: String, required: true},
    deviceId: {type: String, required: true},
    userId: {type: String, required: true}
})

export const DeviceModel = mongoose.model('device', DeviceSchema)

const RateLimitSchema = new mongoose.Schema<RateLimitType>({
    ip: {type: String, required: true},
    url: {type: String, required: true},
    connectionTime: {type: Date, required: true}
})

export const RateLimitModel = mongoose.model('rate-limit', RateLimitSchema)


const PasswordRecoverySchema = new mongoose.Schema<AuthPasswordRecoveryType>({
    userId: {type: String, required: true},
    confirmationCode: {type: String, required: true},
    date: {type: String, required: true}
}) 

export const PasswordRecoveryModel = mongoose.model('password-recovery', PasswordRecoverySchema)


// export const PasswordRecoveryModel = mongoose.model('password-recovery', PasswordRecoverySchema)
// export const collectionPost = blogDB.collection<PostsType>('posts')
// export const collectionBlog = blogDB.collection<BlogsType>('blogs')
// export const collectionUser = blogDB.collection<UserType>('users')
// export const collectionComment = blogDB.collection<CommentType>('comments')
// export const collectionAuth = blogDB.collection<AuthTokenType>('auth')
// export const collectionDevice = blogDB.collection<DeviceDbType>('device')
// export const collectionRateLimit = blogDB.collection<RateLimitType>('rate-limit')


