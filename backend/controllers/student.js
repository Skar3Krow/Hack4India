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


export const findAll = async(req, res) =>{
    if (req.query.updatedAfter) {
        const updatedAfter = new Date(req.query.updatedAfter);

        if (isNaN(updatedAfter.getTime())) {
            return res.status(400).send({ 
                message: "Query parameter 'updatedAfter' should be a valid timestamp/date string."
            });
        }

        Student.find({ updatedAt: { $gte: updatedAfter } }, '-attendance')
            .then(students => {
                res.send(students);
            })
            .catch(err => {
                res.status(500).send({
                    message: "Some error occurred while retrieving students."
                });
            });
    } else if (req.query.grade) {
        const grade = req.query.grade;

        // TODO: Validate grade (you can add your validation logic here)

        Student.find({ grade }, '-attendance')
            .then(students => {
                res.send(students);
            })
            .catch(err => {
                res.status(500).send({
                    message: "Some error occurred while retrieving students."
                });
            });
    } else if (req.query.class) {
        const studentClass = req.query.class;

        // TODO: Validate class (you can add your validation logic here)

        Student.find({ section: studentClass }, '-attendance')
            .then(students => {
                res.send(students);
            })
            .catch(err => {
                res.status(500).send({
                    message: "Some error occurred while retrieving students."
                });
            });
    } else {
        Student.find({}, '-attendance')
            .then(students => {
                res.send(students);
            })
            .catch(err => {
                res.status(500).send({
                    message: "Some error occurred while retrieving students."
                });
            });
    }
}

// export const removeStudent = async(req, res) => {
//     Student.findByIdAndRemove(req.params.id)
//     .then(student => {
//         if(!student) {
//             return res.status(404).send({
//                 message: "Student not found with id " + req.params.id
//             });
//         }
//         res.send({message: "Student deleted successfully!"});
//     }).catch(err => {
//         if(err.kind === 'ObjectId' || err.name === 'NotFound') {
//             return res.status(404).send({
//                 message: "Student not found with id " + req.params.id
//             });                
//         }
//         return res.status(500).send({
//             message: "Could not delete Student with id " + req.params.id
//         });
//     });
// }

export const findOneByStudentId = async(req, res)=> {
    const studnetIndexNo = req.params.studentId;
    Student.findOne({ indexNo: studnetIndexNo }, '-attendance')
    .then(student => {
        if(!student) {
            return res.status(404).send({
                message: "Student not found with Index No. " + studnetIndexNo
            });            
        }
        res.send(student);
    }).catch(err => {
        //TODO: check correctness
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Student not found with Index No. " + studnetIndexNo
            });                
        }
        return res.status(500).send({
            message: "Error retrieving Student with Index No. " + studnetIndexNo
        });
    });
}


