import { DeviceModel } from "../db/db";
import { DeviceDateType } from "../models/security/deviceDateModel";
import { DeviceDbType } from "../models/security/deviceDbModel";


class SecurityRepository {
    async postDevice(device: DeviceDbType){
        return await DeviceModel.insertMany(device)
    }

    async deleteDevices(userId: string, deviceId: string){
        return await DeviceModel.deleteMany({userId: userId, $nor: [{deviceId: deviceId}]})
    }

    async deleteOneDevice(deviceId: string){
        const deleteDevice = await DeviceModel.deleteOne({deviceId: deviceId})
        return deleteDevice.deletedCount === 1
    }

    async updateDates(deviceId: string, dates: DeviceDateType){
        const res = await DeviceModel.updateOne({deviceId: deviceId}, {$set: {lastActiveDate: dates.lastActiveDate, experationDate: dates.experationDate}})
        return res.modifiedCount === 1
    }

    async deleteAllDevice(){
        return await DeviceModel.deleteMany({})
    }
}

export const securityRepository = new SecurityRepository()