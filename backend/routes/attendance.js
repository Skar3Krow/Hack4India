import express from "express"
import { findAll, getReport, createMultiple, create } from "../controllers/attendance.js"
import { verifyAdminToken } from "../middleware/adminAuth.js"
import { verifyToken } from "../middleware/auth.js"


const attendanceRoutes = express.Router()


attendanceRoutes.get('/', verifyAdminToken, findAll)
attendanceRoutes.get('/', verifyToken, findAll)
attendanceRoutes.post('/', verifyAdminToken, create)
attendanceRoutes.post('/', verifyToken, create)
attendanceRoutes.post('/multiple', verifyAdminToken, createMultiple)
attendanceRoutes.post('/report', verifyAdminToken, getReport)
attendanceRoutes.post('/report', verifyToken, getReport)






export default attendanceRoutes