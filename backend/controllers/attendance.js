import Attendance from "../model/Attendance.js";
import Student from "../model/Student.js";

export const create = async(req, res) => {
    try {
        const {
            indexNo,
            date,
            time,
            timestamp,
            isEntered
        } = req.body
        const student = await Student.findOne({ indexNo: indexNo })
        if(!student) {
            return res.status(400).json({ message: "Student does not exist" })
        }
        const attendance = new Attendance({
            student: student._id,
            indexNo,
            date,
            time,
            timestamp,
            isEntered
        })

        const saveRecord = await attendance.save()
        const updateStudent = await Student.findByIdAndUpdate(student._id, { $push: { attendance: savedRecord._id } }, { new: true })
        res.status(201).send({ message: "SUCCESS", saveRecord, updateStudent })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const findAll = async(req, res) => {
    try {
        
    } catch (error) {
        
    }
}