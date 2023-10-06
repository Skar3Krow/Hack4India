import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../model/User.js"

// REGISTER LOGIC
export const register = async(req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            userType
        } = req.body
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            userType
        })
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// LOGIN LOGIC
// export const login = async(res, req) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email: email })
//         if(!user) {
//             return res.status(400).json({ message: "User does not exist" })
//         }
        
//         const isMatch = await bcrypt.compare(password, user.password)
//         if(!isMatch) {
//             return res.status(400).json({ message: "Invalid credentials" })
//         }

//         const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET)
//         delete user.password
//         res.status(200).json({ token, user })
//     } catch (error) {
//         res.status(500).json({ error: error.message })
//     }
// }

export const login = async(res, req) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email })
        if(!user) {
            return res.status(400).json({ message: "User does not exist" })
        }
        if(user.userType == user) {
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" })
            }
            const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_USER)
            delete user.password
            res.status(200).json({ token, user })
        }
        if(user.userType == admin) {
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" })
            }
            const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_ADMIN)
            delete user.password
            res.status(200).json({ token, user })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}