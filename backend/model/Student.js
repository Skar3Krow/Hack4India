import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    attendance: [{ type: mongoose.Schema.ObjectId, ref: 'Attendance' }],
    indexNo: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
    },
    DOB: Date,
    gender: {
        type: String,
        enum : ['male', 'female', 'other'],
    },
    address: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    contactNo1: {
        type: String,
        required: true
    },
    contactNo2: String,
    guardianName: {
        type: String,
        required: true
    },
    guardianAddress: String,
    guardianRelationship: String,
    guardianContact: {
        type: String,
        required: true
    },
    specialCare: Boolean, // whether the student need special care or not
    specialCareInfo: String,
}, { timestamps: true })

const Student = mongoose.model("Student", StudentSchema)
export default Student