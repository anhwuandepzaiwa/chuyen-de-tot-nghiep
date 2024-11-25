const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')
const passport = require("passport");
const bodyParser = require('body-parser');
const permissionRouters = require('./routes/permissionRoutes');

const app = express()
app.use(bodyParser.json());
app.use(cors({
    origin : "http://127.0.0.1:5500",
    credentials : true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cookieParser())
/*app.use(
	cookieSession({
		name: "session",
		keys: ["somesessionkey"],
		maxAge: 24 * 60 * 60 * 100,
	})
);*/
app.use(passport.initialize());
//app.use(passport.session());

app.use("/api",router)
app.use('/api/permission', permissionRouters);


const PORT = 8080 || process.env.PORT


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("connnect to DB")
        console.log("Server is running "+PORT)
    })
})
