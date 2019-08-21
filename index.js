const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

let dbName = 'nodesql';
let tableName = 'Users';

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    multipleStatements: true
});

mysqlConnection.connect(function(err) {  
    if (err) throw err;  
    console.log("Connected!");  
    mysqlConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, function (err, result) {  
        if (err) throw err;  
        console.log("Database created");  
    });  
});

mysqlConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, function (err) {
    if (err) throw err;
    mysqlConnection.query(`USE ${dbName}`, function (err) {
        if (err) throw err;
        mysqlConnection.query(`CREATE TABLE IF NOT EXISTS ${tableName}(`
            + 'UserID INT NOT NULL'
            +  ')', function (err) {
                if (err) throw err;
            }); 
    });
});

app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));

app.get('/users', (req, res) => {
    mysqlConnection.query(`SELECT * FROM ${tableName}`, (err, rows, fields) => {
        if (!err && rows.length > 0){
            res.send(rows);
        }
        else
            res.send(err);
    })
});

app.get('/users/:id', (req, res) => {
    mysqlConnection.query(`SELECT * FROM ${tableName} WHERE UserID = ?`, [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            res.send(err);
    })
});
app.delete('/users/:id', (req, res) => {
    mysqlConnection.query(`DELETE FROM ${tableName} WHERE UserID = ?`, [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            res.send(err);
    })
});

app.post('/users', (req, res) => {
    mysqlConnection.query(`INSERT INTO ${tableName}(UserID) VALUES(`+ req.body.UserID +')', (err, rows, fields) => {
        if (!err)
                res.send('Inserted user id');
        else
            res.send(err);
    })
});

app.put('/users', (req, res) => {
    mysqlConnection.query(`UPDATE ${tableName} SET UserID = ? WHERE UserID = ?`, [req.body.NewID, req.body.OldID],(err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            res.send(err);
    })
});