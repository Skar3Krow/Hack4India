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

export const removeStudent = async(req, res) => {
    Student.findByIdAndRemove(req.params.id)
    .then(student => {
        if(!student) {
            return res.status(404).send({
                message: "Student not found with id " + req.params.id
            });
        }
        res.send({message: "Student deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Student not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete Student with id " + req.params.id
        });
    });
}

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

export const updateByStudentId = async(req, res) => {
    
    const {
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
    const studnetIndexNo = req.params.studentId;
    // Validate Request
    if(!req.body) {
        return res.status(400).send({
            message: "Request body can not be empty"
        });
    }

    // vaidate DOB
    function isValidDateFormat(dateString) {
        // Define an array of date format regex patterns to check
        const dateFormats = [
            /^\d{4}-\d{2}-\d{2}$/,    // YYYY-MM-DD
            /^\d{1,2}\/\d{1,2}\/\d{4}$/, // D/M/YYYY or DD/MM/YYYY
        ];
    
        // Iterate through the regex patterns and return true if any match the date string
        return dateFormats.some(format => format.test(dateString));
    }
    if (DOB && isValidDateFormat(DOB)) {
        DOB = DOB.format('YYYY-MM-DD');
    } else {
        return res.status(400).send({ message: "Invalid date format for DOB" });
    }

    let updatedStudent = {};

    if (initials) updatedStudent.firstName = firstName;    
    if (lastName) updatedStudent.lastName = lastName;
    if (DOB) updatedStudent.DOB = DOB;
    if (gender) updatedStudent.gender = gender;
    if (profilePicture) updatedStudent.profilePicture = profilePicture;
    if (address) updatedStudent.address = address;
    if (grade) updatedStudent.grade = grade;
    if (branch) updatedStudent.class = branch;
    if (section) updatedStudent.section = section;
    if (medium) updatedStudent.medium = medium;
    // if (homeTel) updatedStudent.homeTel = req_JSON_student.homeTel;
    if (contactNo1) updatedStudent.contactNo1 = contactNo1;
    if (contactNo2) updatedStudent.contactNo2 = contactNo2;
    if (guardianName) updatedStudent.guardianName = guardianName;
    if (guardianAddress) updatedStudent.guardianAddress = guardianAddress;
    if (guardianRelationship) updatedStudent.guardianRelationship = guardianRelationship;
    if (guardianContact) updatedStudent.guardianContact = guardianContact;
    if (specialCare) updatedStudent.specialCare = specialCare;
    if (specialCareInfo) updatedStudent.specialCareInfo = specialCareInfo;
    if (active) updatedStudent.active = active;
    if (verified) updatedStudent.verified = verified;

    // Find student and update it with the request body
    Student.findOneAndUpdate({ indexNo: studnetIndexNo }, updatedStudent, { new: true, projection: '-attendance' })
    .then(student => {
        if(!student) {
            return res.status(404).send({
                message: "Student not found with Index No. " + studnetIndexNo
            });
        }
        res.send(student);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Student not found with Index No. " + studnetIndexNo
            });                
        }
        return res.status(500).send({
            message: "Error updating Student with Index No. " + studnetIndexNo
        });
    });
}

export const createMultiple = async (req, res) => {
    const req_JSON = req.body;

    // Validate request
    if( !req_JSON || 
        !req_JSON.students ||
        req_JSON.students.length === 0 ) {
        
        return res.status(400).send({
            message: "Required request data can not be empty"
        });
    }

    const req_students = req_JSON.students;
    let students_res = [];
    // Validate student objects
    for (let [index, req_JSON_student] of req_students.entries()) {
        if( !req_JSON_student.initials ||
            !req_JSON_student.lastName ||
            !req_JSON_student.fullName ||
            !req_JSON_student.DOB ||
            !req_JSON_student.gender ||
            !req_JSON_student.grade ||
            !req_JSON_student.address ||
            !req_JSON_student.grade ||
            !req_JSON_student.section ||
            !req_JSON_student.medium ||
            !req_JSON_student.contactNo1 ) {
            
            return res.status(400).send({
                message: `Required Student details can not be empty on no. ${index} student`,
                studentWithError: req_JSON_student,
                indexWithError: index,
                savedStudents: students_res
            });
        }

        // vaidate DOB
        function isValidDateFormat(dateString) {
            
            const dateFormats = [
                /^\d{4}-\d{2}-\d{2}$/,  
                /^\d{1,2}\/\d{1,2}\/\d{4}$/,
            ];
        
            // Iterate through the regex patterns and return true if any match the date string
            return dateFormats.some(format => format.test(dateString));
        }
        if (DOB && isValidDateFormat(DOB)) {
            DOB = DOB.format('YYYY-MM-DD');
        } else {
            return res.status(400).send({ message: "Invalid date format for DOB" });
        }
        
        try {
            // Create a Student
            let student = new Student({   
                ideamartPin: NumberUtil.generatePin(5),
                firstName: req_JSON_student.firstName,  
                lastName: req_JSON_student.lastName,  
                DOB: DOB,
                gender: req_JSON_student.gender,
                profilePicture: req_JSON_student.profilePicture, 
                address: req_JSON_student.address,
                grade: req_JSON_student.batch,
                // class: req_JSON_student.class,
                section: req_JSON_student.section,
                medium: req_JSON_student.medium,
            
                // homeTel: req_JSON_student.homeTel,
                contactNo1: req_JSON_student.contactNo1,
                contactNo2: req_JSON_student.contactNo2,
                guardianName: req_JSON_student.guardianName,
                guardianAddress: req_JSON_student.guardianAddress,
                guardianRelationship: req_JSON_student.guardianRelationship,
                // guardianContact: req_JSON_student.guardianContact, 
            
                specialCare: req_JSON_student.specialCare, // whether the student need special care or not
                specialCareInfo: req_JSON_student.specialCareInfo,
            
                active: req_JSON_student.active,
                verified: req_JSON_student.verified,
            });

            // Save Student in the database
            let savedStudent = await student.save();
            students_res.push(savedStudent);
        } catch (err) {
            return res.status(500).send({
                message: err.message || "Some error occurred while creating the Student.",
                studentWithError: req_JSON_student,
                indexWithError: index,
                savedStudents: students_res
            });
        }
    }
    return res.send({
        message: "SUCCESS",
        noOfSavedStudents: students_res.length,
        savedStudents: students_res
    });
}

export const getAllWithAttendance = async(req, res) => {
    if (req.query.to || req.query.from) {
        const recordsFrom = req.query.from ? new Date(req.query.from) : null;
        const recordsTo = req.query.to ? new Date(req.query.to) : null;

        if (recordsFrom && isNaN(recordsFrom.getTime())) {
            return res.status(400).send({
                message: "Query parameter 'from' should be a valid date string."
            });
        }

        if (recordsTo && isNaN(recordsTo.getTime())) {
            return res.status(400).send({
                message: "Query parameter 'to' should be a valid date string."
            });
        }

        let query = {};
        if (recordsFrom && recordsTo) {
            query = { date: { $gte: recordsFrom, $lte: recordsTo } };
        } else if (recordsFrom) {
            query = { date: { $gte: recordsFrom } };
        } else {
            query = { date: { $lte: recordsTo } };
        }

        Student.find().populate({
            path: 'attendance',
            match: query,
            select: '-_id -student -__v -createdAt -updatedAt',
        }).exec()
            .then(students => {
                res.send(students);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving students."
                });
            });
    } else {
        Student.find().populate({
            path: 'attendance',
            select: '-_id -student -__v -createdAt -updatedAt',
        }).exec()
            .then(students => {
                res.send(students);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving students."
                });
            });
    }
}

