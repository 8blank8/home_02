import { collectionDevice } from "../db/db";
import { DeviceDateType } from "../models/security/deviceDateModel";
import { DeviceDbType } from "../models/security/deviceDbModel";


export const securityRepository = {
    async postDevice(device: DeviceDbType){
        return await collectionDevice.insertOne(device)
    },

    async deleteDevices(userId: string, deviceId: string){
        return await collectionDevice.deleteMany({userId: userId, $nor: [{deviceId: deviceId}]})
    },

    async deleteOneDevice(deviceId: string){
        const deleteDevice = await collectionDevice.deleteOne({deviceId})
        return deleteDevice.deletedCount === 1
    },

    async updateDates(deviceId: string, dates: DeviceDateType){
        const res = await collectionDevice.updateOne({deviceId: deviceId}, {$set: {lasActiveDate: dates.iat, experationDate: dates.exp}})
        return res.modifiedCount === 1
    }, 

    async deleteAllDevice(){
        return await collectionDevice.deleteMany({})
    }
}