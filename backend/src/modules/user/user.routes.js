import { authMiddleware } from "../../middleware/authMiddleware.js"
import { checkEmail } from "../../middleware/checkEmail.js"
import { deleteUser, getUser, login, postUser, register, updateUser,verifyAccount,getMe} from "./user.controller.js"
import express,{ Router } from "express"
import { userModel } from "../../../db/models/user.model.js" 

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

UserRoutes.get('/users/all', authMiddleware, async (req, res) => {
  try {
    const users = await userModel.find({}, 'userName email _id');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});