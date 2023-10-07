import express from "express"
import { findAll,findOneByStudentId,getReport } from "../controllers/user.js"
import { verifyToken } from "../middleware/auth.js"


const userRoutes = express.Router();

userRoutes.get('/', verifyToken,findAll);
userRoutes.get('/', verifyToken,findOneByStudentId);
userRoutes.get('/report', verifyToken,getReport);

export default userRoutes;