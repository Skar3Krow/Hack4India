import express from "express"
import { findAll, getReport, createMultiple, create } from "../controllers/attendance.js"
import { verifyAdminToken } from "../middleware/adminAuth.js"


const attendanceRoutes = express.Router()



attendanceRoutes.get('/', verifyAdminToken, findAll)

attendanceRoutes.post('/', verifyAdminToken, create)

attendanceRoutes.post('/multiple', verifyAdminToken, createMultiple)

attendanceRoutes.get('/report', verifyAdminToken, getReport)


export default attendanceRoutes;



