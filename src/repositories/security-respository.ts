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
        const deleteDevice = await collectionDevice.deleteOne({deviceId})
        return deleteDevice.deletedCount === 1
    }
}