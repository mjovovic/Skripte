const express = require('express');
const app = express();

const path = require('path');
const { join } = require('path/posix');

app.use(express.static(path.join(__dirname, 'static')));


app.get('/', (req, res) => {
    res.send('ZDRAVOO!!');
});

app.get('/test', (req, res) => {
    res.send('test');
});


app.get('/blog/:kategorija/:ime', (req, res) => {
    res.send(`blog  ${$req.params.kategorija} ${req.params.ime}`);
});

app.get('/test/response', (req, res) => {
    res.send(`query ${req.query}`);
});

app.use('/test', express.json());

app.post('/test', (req, res) =>{
    res.send(req.body);
});


const bp = require('body-parser');
app.use(bp.urlencoded({extended: false}));


const Joi = require('joi');

const sema = Joi.object().keys({
    mail: Joi.string().trim().email().required(),
    pass: Joi.string().min(4).max(12).required()

});

app.post('/login', (req, res) => {
    Joi.validate(req.body, sema, (err, result) => {
        if(err){
            res.status(400).send(err.details);
        } else {
            res.send(result);
        }
    });
});


app.listen(8000); 