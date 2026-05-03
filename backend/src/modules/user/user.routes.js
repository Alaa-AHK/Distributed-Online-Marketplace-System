import { authMiddleware } from "../../middleware/authMiddleware.js"
import { checkEmail } from "../../middleware/checkEmail.js"
import { deleteUser, getUser, login, postUser, register, updateUser,verifyAccount,getMe} from "./user.controller.js"
import express,{ Router } from "express"

export const UserRoutes=Router()
UserRoutes.use(express.json())

UserRoutes.get('/user',authMiddleware,getUser)
UserRoutes.get('/profile',authMiddleware,getMe)

UserRoutes.post('/user',authMiddleware,postUser)

UserRoutes.patch('/user/:id',authMiddleware,updateUser)

UserRoutes.delete('/user/:id',authMiddleware,deleteUser)

UserRoutes.post('/user/register',checkEmail,register)

UserRoutes.post('/user/login',login)

UserRoutes.get('/user/verify/:email' ,verifyAccount)
