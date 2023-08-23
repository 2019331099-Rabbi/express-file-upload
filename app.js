const express = require('express');
const exphbs = require('express-handlebars');
const fileUpload = require('express-fileupload');
const myDB = require('./model');

const app = express();
const port = 5001;

// default option
app.use(fileUpload());

// Static files
app.use(express.static('public'));
app.use(express.static('upload'));

// Template engine
const handlebars = exphbs.create({ extname: '.hbs', });
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');


app.get("/", (req, res) => {
    const userQuery = `SELECT * FROM user WHERE id = ?`;
    myDB.query(userQuery, [1], (err, results) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(results[0]);
            res.render('index', {
                user: results[0]
            });
        }
    });
});

app.post("/", (req, res) => {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No file were uploaded");
    }

    // name of the input is sampleFile
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/upload/' + sampleFile.name
    console.log(sampleFile);

    // use mv() to place the file on the server
    sampleFile.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send("err");
        }
        const updateQuery = `UPDATE user SET profile_image = ? WHERE id = ?;`;
        myDB.query(updateQuery, [sampleFile.name, 1], (err, results) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect('/');
            }
        });
    });
})

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})
