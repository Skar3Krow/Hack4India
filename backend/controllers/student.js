import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Student from "../model/Student.js"

export const create = async(req, res) => {
    try {
        const {
            indexNo,
            firstName,
            lastName,
            DOB,
            gender,
            address,
            branch,
            contactNo1,
            contactNo2,
            guardianName,
            guardianAddress,
            guardianRelationship,
            guardianContact,
            specialCare,
            specialCareInfo
        } = req.body
        const newStudent = new Student({
            indexNo,
            firstName,
            lastName,
            DOB,
            gender,
            address,
            branch,
            contactNo1,
            contactNo2,
            guardianName,
            guardianAddress,
            guardianRelationship,
            guardianContact,
            specialCare,
            specialCareInfo
        })
        const savedStudent = await newStudent.save()
        res.status(201).json(savedStudent)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}