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
    if (req.query.to || req.query.from) {
        const recordsFrom = req.query.from ? new Date(req.query.from) : null;
        const recordsTo = req.query.to ? new Date(req.query.to) : null;
        console.log(`Attendance records from: ${recordsFrom}, to: ${recordsTo}`);
        
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
        if (recordsFrom) query.date = { $gte: recordsFrom };
        if (recordsTo) query.date = { ...query.date, $lte: recordsTo };

        Attendance.find(query)
            .then(records => {
                res.send(records);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving Attendance records."
                });
            });
    } else {
        Attendance.find()
            .then(records => {
                res.send(records);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving Attendance records."
                });
            });
    }
}

export const createMultiple = async(req, res) => {
    const req_JSON = req.body;

    // Validate request
    if (!req_JSON || !req_JSON.records || req_JSON.records.length === 0) {
        return res.status(400).send({
            message: "Required request data can not be empty"
        });
    }

    const req_records = req_JSON.records;
    let attendance_res = [];
    let ideamartReqBodyArray = [];

    // Validate attendance record objects
    for (let [index, req_JSON_record] of req_records.entries()) {
        if (
            !req_JSON_record.indexNo ||
            !req_JSON_record.isEntered ||
            !req_JSON_record.timestamp
        ) {
            return res.status(400).send({
                message: `Required Attendance details can not be empty on no. ${index} record`,
                recordWithError: req_JSON_record,
                indexWithError: index,
                savedRecords: attendance_res
            });
        }

        // Find student record
        const student = await Student.findOne({ indexNo: req_JSON_record.indexNo });
        if (!student) {
            return res.status(400).send({
                message: `Student not found for index no. - ${req_JSON_record.indexNo}`,
                recordWithError: req_JSON_record,
                indexWithError: index,
                savedRecords: attendance_res
            });
        }

        try {
            // Create an Attendance record
            let record = new Attendance({
                student: student._id,
                indexNo: req_JSON_record.indexNo,
                date: req_JSON_record.date,
                time: req_JSON_record.time,
                timestamp: req_JSON_record.timestamp,
                isEntered: req_JSON_record.isEntered
            });

            // Save Attendance record in the database
            const savedRecord = await record.save();
            attendance_res.push(savedRecord);
            const updatedStudent = await Student.findByIdAndUpdate(student._id, { $push: { attendance: savedRecord._id } }, { new: true });

            if (updatedStudent) {
                // Handle the student update if needed
            }

            // Add data for Ideamart request
            ideamartReqBodyArray.push({ indexNo: updatedStudent.indexNo, value: req_JSON_record.isEntered, date: req_JSON_record.date, time: req_JSON_record.time });
        } catch (err) {
            return res.status(500).send({
                message: err.message || "Some error occurred while creating the Attendance record.",
                recordWithError: req_JSON_record,
                indexWithError: index,
                savedRecords: attendance_res,
                error: err.code
            });
        }
    }

    // Perform actions related to Ideamart request here
    // ideamartReqBodyArray contains the data for the request

    return res.send({
        message: "SUCCESS",
        noOfSavedRecords: attendance_res.length,
        savedRecords: attendance_res,
        // Add Ideamart response data here
    });
}

export const getReport = async(req, res)=>{
    if (req.query.to || req.query.from) {
        const reportFrom = req.query.from ? new Date(req.query.from) : null;
        const reportTo = req.query.to ? new Date(req.query.to) : null;

        if (reportFrom && isNaN(reportFrom.getTime())) {
            return res.status(400).send({
                message: "Query parameter 'from' should be a valid date string."
            });
        }

        if (reportTo && isNaN(reportTo.getTime())) {
            return res.status(400).send({
                message: "Query parameter 'to' should be a valid date string."
            });
        }

        let query = {};

        if (reportFrom && reportTo) query.date = { $gte: reportFrom, $lte: reportTo };
        else if (reportFrom) query.date = { $gte: reportFrom };
        else query.date = { $lte: reportTo };

        try {
            const recordsByDate = await Attendance.aggregate([
                { $match: query },
                {
                    $lookup: {
                        from: 'students',
                        localField: 'student',
                        foreignField: '_id',
                        as: 'student'
                    }
                },
                {
                    $group: {
                        _id: "$date",
                        date: { $first: '$date' },
                        recordSet: { $addToSet: { indexNo: '$indexNo', student: '$student' } },
                    }
                },
                { $sort: { date: 1 } },
                {
                    $project: {
                        _id: 0,
                        date: 1,
                        recordSet: 1,
                    }
                }
            ]);

            let report = {};
            for (let item of recordsByDate) {
                const date = item.date.toISOString().split('T')[0];
                report[date] = {};
                const attendanceByGrade = _.countBy(item.recordSet, (record) => {
                    return record.student[0]["grade"];
                });
                const attendanceByClass = _.countBy(item.recordSet, (record) => {
                    return record.student[0].section;
                });
                report[date].total = item.recordSet.length;
                report[date].attendanceByGrade = attendanceByGrade;
                report[date].attendanceByClass = attendanceByClass;
            }

            res.send({
                reportFrom: reportFrom.toISOString().split('T')[0],
                reportTo: reportTo.toISOString().split('T')[0],
                noOfDays: recordsByDate.length,
                report
            });

        } catch (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Attendance records."
            });
        }
    } else {
        try {
            const records = await Attendance.aggregate([
                {
                    $group: {
                        _id: { indexNo: "$indexNo", date: "$date" },
                        indexNo: { $first: '$indexNo' },
                        date: { $first: '$date' }
                    }
                },
                { $sort: { date: 1 } },
                {
                    $project: {
                        _id: 0,
                        indexNo: 1,
                        date: 1,
                    }
                }
            ]);

            const report = _.countBy(records, (record) => {
                return record.date.toISOString().split('T')[0];
            });

            res.send({
                report
            });

        } catch (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Attendance records."
            });
        }
    }
}
// Find Attendance of a single User using ID...
