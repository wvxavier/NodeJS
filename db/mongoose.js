const mongoose = require('mongoose')
const password = 'mVcOzchZAN12ndaW'


mongoose.connect('mongodb+srv://rest-api:' + password + '@nodejs-express-rest-api-gmoic.mongodb.net/task-manager', {
    useNewUrlParser: true,
    useCreateIndex: true,
    //Address deprication warning
    useFindAndModify: false

}).then((result) => {

}).catch((error) => {
    console.log('Could not connect to DB', error)

})


