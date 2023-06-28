import { collectionDevice } from "../db/db"


export const securityQueryRepository = {
    async findDevice(userId: string){
        return await collectionDevice.find({userId: userId}).toArray()
    },

    async findOneDevice(deviceId: string){
        return await collectionDevice.findOne({deviceId: deviceId})
    }
}