const express = require('express');
const app = express();
const connectDB = require('./config/db')

const PORT = process.env.PORT || 3000;

connectDB();

//Routes-
app.use('/api/files', require('./routes/files'));

app.listen(PORT, () => {
    console.log(`Listening at ${PORT}`)
});
