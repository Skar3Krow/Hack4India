import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import authRoutes from "./routes/auth.js"
import attendanceRoutes from './routes/attendance.js'
import studentRoutes from "./routes/student.js"
import userRoutes from "./routes/user.js"


// CONFIGURATIONS 
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, "public/assets")))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// ROUTES
app.use("/auth", authRoutes)
app.use('/attendence', attendanceRoutes);
app.use('/student', studentRoutes);
app.use('/user', userRoutes)


// MONGOOSE SETUP
const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`))
}).catch((e) => console.log(`${e} did not connect`))


