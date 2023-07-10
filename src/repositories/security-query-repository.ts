import { DeviceModel } from "../db/db"
import { DeviceDbType } from "../models/security/deviceDbModel"


export class SecurityQueryRepository {
    async findDevice(userId: string){
        const device = await DeviceModel.find({userId: userId}).lean()
        if(!device) return null

        return device.map(this._mapDevice)
    }

    async findOneDevice(deviceId: string){
        return await DeviceModel.findOne({deviceId: deviceId})
    }

    _mapDevice(device: DeviceDbType){
        return {
            ip: device.ip,
            title: device.title,
            lastActiveDate: device.lastActiveDate,
            deviceId: device.deviceId
        }
    }

    async findDeviceById(deviceId: string){
        return await DeviceModel.findOne({deviceId: deviceId})
    }
}
