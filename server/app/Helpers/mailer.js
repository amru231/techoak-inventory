const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');

const mailer = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "9655aa95e42b19",
        pass: "b41828e708cded"
    }
})

var options = {
    viewEngine: {
        extname: '.hbs',
        layoutsDir: 'views/email/',
        defaultLayout: 'template',
        partialsDir: 'views/partials/'
    },
    viewPath: 'views/email/',
    extName: '.hbs'
};

mailer.use('compile', hbs(options));

module.exports = mailer