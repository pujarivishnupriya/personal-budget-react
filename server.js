//Budget API
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3005;

app.use(cors());

app.get('/budget', (req, res) => {
    var data = getJsonFile();
    res.json(data);
});

function getJsonFile(){
    var data = require('./budget.json');
    return data;
}

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`)
});