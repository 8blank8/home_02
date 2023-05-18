import { collectionBlog } from "../db/db"

const optionsCollection = {
    projection: {_id: 0}
} 

export const blogsQueryRepository = {
    async findBlogs(){
        return collectionBlog.find({}, optionsCollection).toArray()
    },

    async findBlogsById(id: string){
        return await collectionBlog.findOne({id}, optionsCollection )
    },
}