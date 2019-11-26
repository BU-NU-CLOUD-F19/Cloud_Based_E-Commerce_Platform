const express = require('express');
const app = express();
const db = require('knex');
app.get('/', (req, res) => {
    console.log('Yo this is so cool world received a request.');

    const target = process.env.TARGET || 'World';
    res.send(`yo this is so cool ${target}!`);
});
// var pg = require('knex')({
//     client: 'pg',
//     connection: process.env.PG_CONNECTION_STRING,
//     searchPath: ['knex', 'public'],
// });
var knex = require('knex')({
    client: 'pg',
    version: '7.2',
    connection: {
        host: '35.196.186.41',
        user: 'postgres',
        database: 'postgres',
        port: 80
    },
    pool: {
        "min": 2,
        "max": 7
    }
});
app.get('/demo', (req, res) => {
    console.log('This is a demo application running on google cloud platform.');
    var data = knex.select().from('test_table').then(function (data) {
        res.send(data);
    })
    const target = process.env.TARGET || '/demo';
    // res.send(`This is a demo application running on google cloud platform ${target}! ${data}`);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('This is a demo application running on google cloud platform: listening on port', port);
});