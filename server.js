const express = require('express')
const app = express()
const PORT = 5500
const connectDB = require("./db")
const cookieParser = require("cookie-parser")
const {adminAuth, userAuth} = require("./middleware/auth")

connectDB()

app.use(express.json())
app.use(cookieParser())

app.set("view engine", "ejs");

app.use('/api/Auth', require('./Auth/Route'))

app.get('/', (req, res) => res.render('home'))
app.get('/register', (req, res) => res.render('register'))
app.get('/login', (req, res) => res.render('login'))
app.get('/admin', adminAuth, (req, res) => res.render("admin"))
app.get('/basic', userAuth, (req, res) => res.render("user"))

app.get("/logout", (req, res) => {
    res.cookie("jwt", "", { maxAge: "1" });
    res.redirect("/");
});

const server = app.listen(PORT, () => console.log(`Server connected to port ${PORT}`))

process.on('unhandledRejection', err => {
    console.log(`An error occurred: ${err.message}`)
    server.close(() => process.exit(1))
})