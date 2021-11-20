require('dotenv').config();
const mongoose = require('mongoose');
function connectDB() {
    // Database connection
    mongoose.connect(process.env.CONNECT_URL, { useNewUrlParser: true,  useUnifiedTopology: true});
    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log('Database connected 🥳🥳🥳🥳');
    }).on('error', (err) => {
        console.log('some error',err);
    });
}
 


module.exports = connectDB;

