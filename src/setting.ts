import express from "express";
import { testingRouter } from "./routes/testing-router";
import { blogsRouter } from "./routes/blogs-router";
import { postsRouter } from "./routes/posts-router";
import { authRouter } from "./routes/auth-router";
import { userRouter } from "./routes/users-router";

export const app = express();

const jsonBodyMidleware = express.json()

app.use(jsonBodyMidleware)
app.use('/testing/all-data', testingRouter)
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', userRouter)
app.use('/login', authRouter)