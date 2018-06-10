
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var app = express();

//verwenden um eingabe auf richtigkeit zu ueberpruefen
var paperwork = require('paperwork');

//Verbindung mit der Redis Datenbank --- Local testing
var redis = require("redis");
var client = redis.createClient();



client.on("error", function (err) {
    console.log("Error" + err);
});

//groups --- User:Group:ID

//User wird authentifizeiert durch seine Nummer
app.post('/user', jsonParser, function (req, res) {

    var newUser = req.body; // Body beinhaltet geparstes JSON-Objekt
    
    var datasetKey = 'user:' + newUser.userNumber;

    client.exists(datasetKey, function (err, rep) {
        if (rep == 1) {
            console.log(newUser);
            res.status(400).json("Der User ist schon vergeben!");
        } else {
            client.set(datasetKey, JSON.stringify(newUser), function (err, rep) { //user in Datenbank speichern
                console.log(newUser);
                res.status(200).json(newUser);
            })
        }
    });
});


app.get('/user', jsonParser, function (req, res) {
    client.keys('user:*', function (err, rep) {

        if (rep.length == 0) {
            res.status(404).json([]);
            return;
        } else {
            var users = [];
            client.mget(rep, function (err, rep) {
                rep.forEach(function (val) {
                    if (val != null) {
                        var userD = JSON.parse(val);
                        users.push(userD);
                    }
                });
                var user = {
                    users
                };
                res.status(200).json(user);
            })
        }
    })
});


//TODO: BERECHTIGUNG für User muessen in User Ressource gesetzt werden.

//Gruppen von Kontakten anlegen
//User sind leute die die Gruppe sehen
//Member sind Kontaktdaten die geteilt werden
app.post('/group', jsonParser, function (req, res) {

    var newGrp = req.body; // Body beinhaltet geparstes JSON-Objekt
    
    var datasetKey = 'group:' + newGrp.grpName;

    client.exists(datasetKey, function (err, rep) {
        if (rep == 1) {
            console.log(newGrp);
            res.status(400).json("Dieser Gruppenname ist schon vergeben!");
        } else {
            client.set(datasetKey, JSON.stringify(newGrp), function (err, rep) { //user in Datenbank speichern
                console.log(newGrp);
                res.status(200).json(newGrp);
            })
        }
    });
});

//Bestimmte Gruppe ausgeben
app.get('/group/:grpName', jsonParser, function (req, res) {
    var datasetKey = 'group:' + req.params.grpName;

    client.get(datasetKey, function (err, rep) {

        if (rep) {
            res.status(200).type('json').send(rep); //liegt schon in Json vor
        } else {
            res.status(404).type('text').send('Die Gruppe: ' + req.params.grpName + ' existiert nicht!');
        }
    });
});






app.get('/', jsonParser, function (req, res) {
    console.log("Server Status OK!")
});

app.listen(7878);