import { DeviceDbType } from "../models/security/deviceDbModel"
import { v4 as uuidv4 } from "uuid"
import { securityRepository } from "../repositories/security-respository"
import { DevicePostType } from "../models/security/devicePostModel"
import { securityQueryRepository } from "../repositories/security-query-repository"
import { jwtService } from "../application/jwt-service"

// iat: string, exp: string, ip: string, title: string = 'unknown', userId: string

export const securityService = {
    async postDevice(device: DeviceDbType){
        const createdDevice: DeviceDbType = {
            ip: device.ip,
            title: device.title ?? 'Unknown',
            lasActiveDate: device.lasActiveDate,
            experationDate: device.experationDate,
            deviceId: device.deviceId,
            userId: device.userId
        }
        // console.log(createdDevice)
        return await securityRepository.postDevice(createdDevice)
    },

    async deleteDevices(userId: string, deviceId: string){
        return await securityRepository.deleteDevices(userId, deviceId)
    },

    async deleteOneDevice(deviceId: string){
        return await securityRepository.deleteOneDevice(deviceId)
    },

    async checkDeletingDevice(userId: string, deviceId: string){
        const device = await securityQueryRepository.findOneDevice(deviceId)
        if(!device) return false
        
        if(device.userId !== userId) return false

        return true
    },

    async updateDates(token: string){
        const deviceId = await jwtService.getDeviceIdByToken(token)

        const newAccessToken = await jwtService.createAccessToken(deviceId)
        const newRefreshToken = await jwtService.createRefreshToken(deviceId)

        const date = await jwtService.getDatesToken(newRefreshToken)
        if(!date) return false

        const isUpdate = await securityRepository.updateDates(deviceId, date)
        if(!isUpdate) return false

        return {
            newAccessToken, 
            newRefreshToken
        }
    }
}