const compression = require('compression');
const express = require('express');
const expbhs = require('express-handlebars');
const helmet = require('helmet');
const morgan = require('morgan');
const nodemailer = require('nodemailer');
const path = require('path');

const paperTopics = [
    'Machine Learning',
    'AI & Robotics',
    'Data Mining',
    'Big Data Analytics',
    'Cloud Computing',
    'Networking',
    'Internet of Things',
    'Image Processing',
    'Parallel Computing',
    'Web Services',
    'Wireless Sensor Networks',
    'Information & Data Security',
    'Grid Computing',
    'Speech Processing',
    'Multimedia Communication',
    'Natural Language Processing',
    'Pattern Recognition',
    'Bioinformatics',
    'Ad-Hoc Networks',
    'Neural Networks',
    'Computer Graphics',
    'Visualisation',
];

const app = express();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sidsbrmnn@gmail.com',
        pass: '',
    },
});

app.engine('handlebars', expbhs());
app.set('view engine', 'handlebars');

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
    app.use(compression());
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/guidelines', (req, res) => {
    res.render('guidelines', { topics: paperTopics });
});

app.post('/submit', async (req, res) => {
    try {
        await transporter.sendMail({
            from: '"Contact Form" <sidsbrmnn@gmail.com>',
            to: 'jssncait2019@gmail.com',
            subject: 'Message from contact form',
            text: `${req.body.message}

From
${req.body.name}
${req.body.email}`,
        });

        res.send('Mail sent.');
    } catch (err) {
        console.error(err);
        res.send('Mail cannot be sent at the moment.');
    }
});

app.get('*', (req, res) => {
    res.render('404', { layout: 'error' });
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.listen(PORT, () => {
    console.log('Listening on port :' + PORT);
});
