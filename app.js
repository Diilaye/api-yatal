//test
const app = require('express')();

require('dotenv').config({
    path: './.env'
});


app.use(require('cors')());

app.use(require('body-parser').json({
    limit: '10000mb'
}));

app.use(require('body-parser').urlencoded({
    extended: true,
    limit: '10000mb'
}));

app.use('/yaatal-file', require('express').static('uploads'));


app.use('/api/v1/users', require('./routes/user-routes'));
app.use('/api/v1/files', require('./routes/file'));



require('./configs/db')().then(_ => {
    const port = process.env.PORT
    app.listen(port, () => {
        console.log(process.env.MONGO_RUI);
        console.log(`Server started on ${port}`);
    });
});