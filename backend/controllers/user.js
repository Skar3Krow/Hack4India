import Attendance from "../model/Attendance.js";
import Student from "../model/Student.js";

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