import { collectionRateLimit } from "../db/db"
import { RateLimitType } from "../models/rate_limit/rateLimitDbModel"


export const rateLimitRepository = {

    async findRateLimit(ip: string){
        return await collectionRateLimit.findOne({ip: ip})
    }, 

    async createRateLimit(data: RateLimitType){
        return await collectionRateLimit.insertOne(data)
    }, 

    async updateRateLimitCount(data: RateLimitType){
        const res = await collectionRateLimit.updateOne({ip: data.ip}, {$set: {count: data.count, time: data.time}})
        return res.modifiedCount === 1
    }, 

    async updateRateLimitAll(data: RateLimitType){
        const res = await collectionRateLimit.updateOne({ip: data.ip}, {$set: {time: data.time, count: data.count}})
        return res.modifiedCount === 1
    },

    async deleteAll(){
        return collectionRateLimit.deleteMany({})
    }
}