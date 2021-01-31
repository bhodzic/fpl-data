
const express = require('express')
const app = express()

app.use("/public", express.static(__dirname + "/public"));

const port = process.env.PORT || 3000;

const https = require('https');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


function createHttpsPromise(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received.
            resp.on('end', () => {
                try {
                    data = JSON.parse(data)
                    resolve(data)
                }
                catch (e) {
                    reject('Error loading data from: ' + url)
                }
            });

        }).on('error', (e) => {
            reject('Error loading data from: ' + url)
        });

    })
}

app.get('/data', (req, res) => {

    let p1 = createHttpsPromise('https://fantasy.premierleague.com/api/bootstrap-static/');
    let p2 = createHttpsPromise('https://fantasy.premierleague.com/api/fixtures/');
    Promise.all([p1, p2]).then(values => {
        let data = { generalData: values[0], fixturesData: values[1] }
        res.send(data)
    }).catch(function (err) {
        res.send(err)
    });


})

app.listen(port)

