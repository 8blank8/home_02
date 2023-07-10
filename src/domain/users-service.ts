import { UsersRepository } from "../repositories/users-repository"

export class UsersService {

    usersRepository: UsersRepository
    constructor(){
        this.usersRepository = new UsersRepository()
    }

    async deleteUser(id: string){
        return await this.usersRepository.deleteUser(id)
    }

    async updatePassword(id: string, passwordHash: string){
        return await this.usersRepository.updatePassword(id, passwordHash)
    }

}
