import express from "express"
import { findAll, create } from "../controllers/student.js"
import { verifyToken } from "../middleware/auth.js"
import router from "./auth.js"


const studentRoutes = express.Router()

studentRoutes.get('/', verifyToken, findAll)
studentRoutes.post('/', verifyToken, create)

export default studentRoutes;


