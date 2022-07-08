const Mongoose = require("mongoose")
const RemoteDB = `mongodb+srv://username:password@cluster0.pw8ka.mongodb.net/?retryWrites=true&w=majority`
const connectDB = async () => {
    Mongoose.connect(RemoteDB)
    .then(client => {
    console.log("MongoDB connection successful")
    })
}
module.exports = connectDB