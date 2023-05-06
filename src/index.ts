import express from "express";
import { testingRouter } from "./routes/testing-router";
import { blogsRouter } from "./routes/blogs-router";
import { postsRouter } from "./routes/posts-router";

export const app = express();
const port = 3001;

const jsonBodyMidleware = express.json()

app.use(jsonBodyMidleware)
app.use('/testing/all-data', testingRouter)
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)

app.listen(port, () => {
   console.log(`app listen port ${port}`)
});