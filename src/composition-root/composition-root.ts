import { JwtService } from "../application/jwt-service";
import { AuthController } from "../controllers/auth-controller";
import { BlogController } from "../controllers/blogs-controller";
import { AuthService } from "../domain/auth-service";
import { EmailService } from "../domain/email-service";
import { SecurityService } from "../domain/security-service";
import { UsersService } from "../domain/users-service";
import { AuthRepository } from "../repositories/auth-repository";
import { PasswordRecoveryRepository } from "../repositories/password-recovery-repository";
import { SecurityQueryRepository } from "../repositories/security-query-repository";
import { SecurityRepository } from "../repositories/security-respository";
import { UsersQueryRepository } from "../repositories/users-query-repository";
import { UsersRepository } from "../repositories/users-repository";
import { BlogsService } from "../domain/blogs-service";
import { PostsService } from "../domain/posts-service";
import { PostsQueryRepository } from "../repositories/posts-query-repository";
import { BlogsQueryRepository } from "../repositories/blogs-query-repository";
import { BlogsRepository } from "../repositories/blogs-repository";
import { PostsRepository } from "../repositories/posts-repository";
import { CommentController } from "../controllers/comments-controller";
import { CommentsService } from "../domain/comments-service";
import { CommentsQueryRepository } from "../repositories/comments-query-repository";
import { CommentsRepository } from "../repositories/commets-repository";
import { PostController } from "../controllers/posts-controller";
import { SecurityController } from "../controllers/security-controller";
import { UserController } from "../controllers/users-controller";
import { TestingController } from "../controllers/testing-controller";


const usersQueryRepository = new UsersQueryRepository()
const securityQueryRepository = new SecurityQueryRepository()
const postsQueryRepository = new PostsQueryRepository()
const blogsQueryRepository = new BlogsQueryRepository()
const commentsQueryRepository = new CommentsQueryRepository()

const passwordRecoveryRepository = new PasswordRecoveryRepository()
const usersRepository = new UsersRepository()
const authRepository = new AuthRepository()
const securityRepository = new SecurityRepository()
const blogsRepository = new BlogsRepository()
const postsRepository = new PostsRepository()
const commentsRepository = new CommentsRepository()

const emailService = new EmailService()
const usersService = new UsersService(usersRepository)
const commentsService = new CommentsService(commentsRepository)
const blogsService = new BlogsService(blogsRepository)
const postsService = new PostsService(blogsRepository, postsRepository)
const authService = new AuthService(passwordRecoveryRepository, usersRepository, usersQueryRepository, usersService, emailService) 
export const jwtService = new JwtService(authRepository, usersQueryRepository)
const securityService = new SecurityService(jwtService, securityRepository, securityQueryRepository)


export const authController = new AuthController(jwtService, authService, securityService)
export const blogController = new BlogController(blogsService, postsService, postsQueryRepository, blogsQueryRepository)
export const commentController = new CommentController(commentsService, commentsQueryRepository)
export const postController = new PostController(postsService, commentsService, commentsQueryRepository, postsQueryRepository)
export const securityController = new SecurityController(jwtService, securityService, securityQueryRepository)
export const userController = new UserController(authService, usersService, usersQueryRepository)

export const testingController = new TestingController(postsRepository, blogsRepository, usersRepository, commentsRepository, securityRepository)