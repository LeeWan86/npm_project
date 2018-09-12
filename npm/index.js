
const express   = require('express'),
    mongoClient = require('mongodb').MongoClient,
    assert      = require('assert'),
    bodyParser  = require('body-parser'),
    mongodburl  = 'mongodb://localhost:27017';

/**
 *  Define the sample application.
 */
var NodeApp = function() {
    const self = this;

    self.initialize = function() {
      self.setupVariables();
      self.app = express();
      self.app.use(bodyParser.urlencoded({
        extended: true
      }));
      self.app.use(bodyParser.json());
      self.runRestService();
    };

    /**
   *  Set up server IP address and port # using env variables/defaults.
   */
    self.setupVariables = function() {
      self.ipaddress = '0.0.0.0';
      self.port      = 8000;
    };

    self.start = function() {
    //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

    self.runRestService = function() {

        self.app.get('/namelistnew', (req, res) => {

            if(req.headers['content-type'] && req.headers['content-type'].includes("application/json"))
            {
                mongoClient.connect(mongodburl, function(err, client) {
                    assert.equal(null, err);
                    console.log("Connected successfully to server");

                    const db = client.db('test');
                    /**
                    * get parameter how?, get console of?
                    **/
                    db.collection("potatotable").find({"console":"window"}).toArray(function(err, result) {
                        if (err) throw err;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(result));
                        client.close();
                    });
                });
            } else {
                res.status(400);
                res.end(JSON.stringify({"error": "Invalid content type"}));
            }

        });

        self.app.patch('/updatenamelist', (req, res) => {
            if(req.headers['content-type'] && req.headers['content-type'].includes("application/json"))
            {
                mongoClient.connect(mongodburl, function(err, client) {
                    assert.equal(null, err);
                    console.log("Connected successfully to server update");
                    const db = client.db('test');
                    /**
                    * get parameter how?, e.g. user update console windows to potato
                    **/
                    console.log(req.body);
                    db.collection("potatotable").update({ name: "Han" },{name: "Han",age: 31},{ upsert: true });
                    res.setHeader('Content-Type', 'application/json');
                    res.status(204);
                    res.end("End");
                    client.close();
                });
            } else {
                res.status(400);
                res.end(JSON.stringify({"error": "Patch -- Invalid content type"}));
            }
        });

        self.app.get('/test/:1', (req, res) => {
          console.log(req.body);
          res.end("End");
        });

        self.app.delete('/deleteAname', (req, res) => {
            if(req.headers['content-type'] && req.headers['content-type'].includes("application/json"))
            {
                mongoClient.connect(mongodburl, function(err, client) {
                    assert.equal(null, err);
                    const db = client.db('test');
                    console.log("Connected successfully to server delete");
                    /**
                    * get parameter how?, e.g. user send in {console:'windows'}
                    **/
                    db.collection("potatotable").deleteOne({ name: "Han" });
                    res.setHeader('Content-Type', 'application/json');
                    res.status(204)
                    res.end("End");
                    client.close();
                });
            } else {
                res.status(400);
                res.end(JSON.stringify({"error": "delete -- Invalid content type"}));
            }
        });
    };

};

/**
 *  main():  Main code.
 */
var zapp = new NodeApp();
zapp.initialize();
zapp.start();
