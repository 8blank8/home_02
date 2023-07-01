import { collectionDevice } from "../db/db"
import { DeviceDbType } from "../models/security/deviceDbModel"


export const securityQueryRepository = {
    async findDevice(deviceId: string){
        const device = await collectionDevice.findOne({deviceId: deviceId})
        if(!device) return null
        
        return this._mapDevice(device)
    },

    async findOneDevice(deviceId: string){
        return await collectionDevice.findOne({deviceId: deviceId})
    },

    _mapDevice(device: DeviceDbType){
        return {
            ip: device.ip,
            title: device.title,
            lastActiveDate: device.lasActiveDate,
            deviceId: device.deviceId
        }
    }
}