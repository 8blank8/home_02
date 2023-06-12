import express from "express";
import { testingRouter } from "./routes/testing-router";
import { blogsRouter } from "./routes/blogs-router";
import { postsRouter } from "./routes/posts-router";
import { authRouter } from "./routes/auth-router";
import { userRouter } from "./routes/users-router";
import { commentsRouter } from "./routes/comments-router";
import { emailRouter } from "./routes/email-router";
import cookieParser from "cookie-parser";

export const app = express();

const jsonBodyMidleware = express.json()

app.use(jsonBodyMidleware)
app.use(cookieParser())

app.use('/testing/all-data', testingRouter)
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
app.use('/email', emailRouter)