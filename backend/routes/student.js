import express from "express"
import { findAll, create, removeStudent,findOneByStudentId, createMultiple,getAllWithAttendance } from "../controllers/student.js"
import { verifyAdminToken } from "../middleware/adminAuth.js"


const studentRoutes = express.Router()

studentRoutes.get('/', verifyAdminToken, findAll)
studentRoutes.post('/', verifyAdminToken, create)
studentRoutes.post('/multiple', verifyAdminToken, createMultiple);
studentRoutes.get('/:studentId', verifyAdminToken, findOneByStudentId);
studentRoutes.post('/attendance', verifyAdminToken, getAllWithAttendance);
studentRoutes.delete('/remove', verifyAdminToken, removeStudent)


export default studentRoutes;


