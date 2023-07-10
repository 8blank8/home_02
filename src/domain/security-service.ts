import { DeviceDbType } from "../models/security/deviceDbModel"
import { DeviceDateType } from "../models/security/deviceDateModel"

import { JwtService } from "../application/jwt-service"

import { SecurityRepository } from "../repositories/security-respository"
import { SecurityQueryRepository } from "../repositories/security-query-repository"


export class SecurityService {

    constructor(
        protected jwtService: JwtService,
        protected securityRepository: SecurityRepository,
        protected securityQueryRepository: SecurityQueryRepository
    ){}

    async postDevice(device: DeviceDbType){
        const createdDevice: DeviceDbType = {
            ip: device.ip,
            title: device.title ?? 'Unknown',
            lastActiveDate: device.lastActiveDate,
            experationDate: device.experationDate,
            deviceId: device.deviceId,
            userId: device.userId
        }
        return await this.securityRepository.postDevice(createdDevice)
    }

    async deleteDevices(userId: string, deviceId: string){
        return await this.securityRepository.deleteDevices(userId, deviceId)
    }

    async deleteOneDevice(deviceId: string){
        return await this.securityRepository.deleteOneDevice(deviceId)
    }

    async checkDeletingDevice(userId: string, deviceId: string){
        const device = await this.securityQueryRepository.findOneDevice(deviceId)
        if(!device) return false
        
        if(device.userId !== userId) return false

        return true
    }

    async updateDates(token: string){
        const deviceId = await this.jwtService.getDeviceIdByToken(token)
        const user = await this.jwtService.getFullUserByToken(token)
        if(!user) return false

        const newAccessToken = await this.jwtService.createAccessToken(user.id)
        const newRefreshToken = await this.jwtService.createRefreshToken(deviceId, user.id)

        const dateObj: DeviceDateType = {
            lastActiveDate: new Date().toISOString(),
            experationDate: new Date().toISOString()
        }

        const isUpdate = await this.securityRepository.updateDates(deviceId, dateObj)
        if(!isUpdate) return false

        return {
            newAccessToken, 
            newRefreshToken
        }
    }
}
