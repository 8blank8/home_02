import { collectionPost } from "../db/db"


const optionsCollection = {
    projection: {_id: 0}
} 

export const postsQueryRepository = {
    async findPosts(){
        return collectionPost.find({}, optionsCollection).toArray()
    },

    async findPostById(id: string){
        return collectionPost.findOne({id}, optionsCollection)
    },
}