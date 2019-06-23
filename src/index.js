//NPM for Express webserver
const express = require('express')
//Connects with DB as mongoose.js was not module.export
require('../db/mongoose')
//HTTTP ENDPOINTS
const userRouter = require('../routers/user')
const taskRouter = require('../routers/task')

//Instance object express
const app = express()
//Define port
const port = process.env.PORT || 9000

//####CUSTOMIZE SERVER###

//Parses incoming json in HTTP requests
app.use(express.json())
//Instances routers - endpoint files
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is listen on PORT: ', port)
})