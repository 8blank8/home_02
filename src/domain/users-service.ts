import { inject, injectable } from "inversify"
import { UsersRepository } from "../repositories/users-repository"


@injectable()
export class UsersService {

    constructor(@inject(UsersRepository) protected usersRepository: UsersRepository){}

    async deleteUser(id: string){
        return await this.usersRepository.deleteUser(id)
    }

    async updatePassword(id: string, passwordHash: string){
        return await this.usersRepository.updatePassword(id, passwordHash)
    }

}
