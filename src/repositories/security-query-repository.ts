import { collectionDevice } from "../db/db"
import { DeviceDbType } from "../models/security/deviceDbModel"


export const securityQueryRepository = {
    async findDevice(userId: string){
        const device = await collectionDevice.find({userId: userId}).toArray()
        if(!device) return null

        return device.map(this._mapDevice)
    },

    async findOneDevice(deviceId: string){
        return await collectionDevice.findOne({deviceId: deviceId})
    },

    _mapDevice(device: DeviceDbType){
        return {
            ip: device.ip,
            title: device.title,
            lastActiveDate: device.lastActiveDate,
            deviceId: device.deviceId
        }
    },

    async findDeviceById(deviceId: string){
        return await collectionDevice.findOne({deviceId: deviceId})
    }
}