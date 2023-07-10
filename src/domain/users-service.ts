import { usersRepository } from "../repositories/users-repository"

class UsersService {

    async deleteUser(id: string){
        return await usersRepository.deleteUser(id)
    }

    async updatePassword(id: string, passwordHash: string){
        return await usersRepository.updatePassword(id, passwordHash)
    }

}

export const usersService = new UsersService()