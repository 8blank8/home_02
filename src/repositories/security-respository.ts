import { collectionDevice } from "../db/db";
import { DeviceDbType } from "../models/security/deviceDbModel";


export const securityRepository = {
    async postDevice(device: DeviceDbType){
        return await collectionDevice.insertOne(device)
    },

    async deleteDevices(userId: string, deviceId: string){
        return await collectionDevice.deleteMany({userId: userId, $nor: [{deviceId: deviceId}]})
    },

    async deleteOneDevice(deviceId: string){
        const deleteDevice = await collectionDevice.deleteOne({deviceId: deviceId})
        return deleteDevice.deletedCount === 1
    },

    async updateDates(deviceId: string, dates: any){
        const res = await collectionDevice.updateOne({deviceId: deviceId}, {$set: {lastActiveDate: dates.lastActiveDate, experationDate: dates.experationDate}})
        return res.modifiedCount === 1
    }, 

    async deleteAllDevice(){
        return await collectionDevice.deleteMany({})
    }
}