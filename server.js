const http = require('http');
const https = require('https');
const express = require('express'),
    restful = require('node-restful'),
    bodyParser = require('body-parser'),
    //morgan = require('morgan'),
    multer = require('multer'),
    methodOverride = require('method-override'),
    // jwt = require('jsonwebtoken'),
    request = require('request');
const nedb = require('nedb');
const expressNedbRest = require('express-nedb-rest');
const path = require('path');
// mongoose = restful.mongoose;
//const auth = require('basic-auth');
const fs = require('fs');



const {
    BrowserWindow,
    Menu,
    Tray,
    nativeImage,
    globalShortcut,
    dialog,
    ipcMain,
    ipcRenderer
} = require('electron');
const iconPath = path.join(__dirname, 'www/assets/icon/icon512.png');

// Module to create native browser window.
//const BrowserWindow = electron.BrowserWindow

// Declare some global variables
global.sharedObj = {
    cred: null
};




//console.log('Nombre de paramettres :' + myApp.app.version);


const email = require('mailer');


const exec = require('child_process').exec;

/*
const powershell = require('node-powershell');

let ps = new powershell({ executionPolicy: 'Bypass', debugMsg: true, noProfile: true });


ps.addCommand('Import-Module ".\\pwrshell\\MyHttpListener\\HttpListener.psd1" -Force')
    .then(function() {
        return ps.invoke();
    })
    .then(function(output) {
        console.log(output);
        // ps.dispose();
        ps.addCommand('.\\pwrshell\\starthttp_8888.ps1')
            .then(function() {
                return ps.invoke();
            })
            .then(function(output) {
                console.log(output);
                ps.dispose();
            })
            .catch(function(err) {
                console.log(err);
                ps.dispose();
            });


    })
    .catch(function(err) {
        console.log(err);
        ps.dispose();
    });
*/

console.log("Nombre d'arguments :" + process.argv.length.toString());
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.


//  partie electron gui


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow = null;
let willQuitApp = false;
let trayIcon = null;
let traymenu = null;
let glpiWindow = null;






/*let mainWindow

function createMenu() {
    const template = [{
            label: 'View',
            submenu: [{
                    role: 'reload'
                },
                {
                    role: 'forcereload'
                },
                {
                    role: 'toggledevtools'
                }
            ]
        },
        {
            label: 'Tools',
            submenu: [{
                label: 'Check Cred',
                click() {
                    let user = (global.sharedObj.cred) ? global.sharedObj.cred.user : "thsdche"
                    dialog.showMessageBox({
                        type: "info",
                        title: "Current Cred",
                        message: `The current user is: ${user}.`
                    })
                }
            }]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}
*/






function change_user() {
    let ps = new powershell({
        executionPolicy: 'Bypass',
        noProfile: true
    })

    ps.addCommand('./pwrshell/Convert-CredToJson.ps1', [])
    ps.invoke()
        .then(output => {
            console.log(output)
                // Set the global Variable
            remote.getGlobal('sharedObj').cred = JSON.parse(output)
                // Read the global variable
            console.log(remote.getGlobal('sharedObj').cred)
        })
        .catch(err => {
            console.dir(err);
            ps.dispose();
        })
}







function sendMail() {
    email.send({
            host: "smtp.rvdechavigny.fr",
            port: "587",
            ssl: false,
            domain: "rvdechavigny.fr",
            to: "herve.de-chavigny@hdistribution.fr",
            from: "herve@rvdechavigny.fr",
            subject: "Mailer library Mail node.js",
            text: "Mail by Mailer library",
            html: "<span> Hello World Mail sent from  mailer library",
            authentication: "login", // auth login is supported; anything else $
            username: 'herve@rvdechavigny.fr',
            password: 'd@nZel77'
        },
        function(err, result) {
            if (err) {
                console.log(err);
                //result.send("error occured"); 
            } else {
                console.log('hurray! Email Sent');
                //res.send("Email Sent")
            }
        });
}
/*

*/




const app = express();



app.set('superSecret', 'eclipses');

//app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ 'type': 'application/vnd.api+json' }));
app.use(bodyParser.json({ 'limit': '50mb' }));
app.use(bodyParser.text({ 'limit': '50mb' }));
app.use(bodyParser.raw({ 'limit': '50mb' }));
app.use(bodyParser.urlencoded({ 'limit': '50mb', 'extended': 'true' }));
app.use(bodyParser.text({
    'type': 'application/text-enriched',
    'limit': '50mb'
}));
app.use(methodOverride());





app.all('/*', function(req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept');
    // If someone calls with method OPTIONS, let's display the allowed methods on our API
    if (req.method == 'OPTIONS') {
        res.status(200);
        res.write("Allow: GET,PUT,POST,DELETE,OPTIONS");
        res.end();
    } else {
        next();
    }
});





var router = express.Router();

app.use('/api/v1', router);


// create  NEDB datastore
var datastore = new nedb({ filename: "test.db", autoload: true });

// create rest api router and connect it to datastore  
var restApi = expressNedbRest();
restApi.addDatastore('test', datastore);

app.use('/api/v1/db', restApi);

app.post("/gaiashop/upload", multer({ dest: "./gaiashop/uploads/" }).single('file'), function(req, res) {
    res.send(req.files);
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({
        success: true,
        message: 'Herve de CHAVIGNY! welcome to your api!'
    });
});


router.get('/gaiashop/paniers_test', function(req, res) {


    res.json([{
            "name": "Gourmandise",
            "picname": "gourmandise",
            "desc": "",
            "prix": "3.99"
        },
        {
            "name": "Gourmandise 2",
            "picname": "gourmandise2",
            "desc": "",
            "prix": "3.99"
        },
        {
            "name": "Gourmandise 3",
            "picname": "gourmandise3",
            "desc": "",
            "prix": "3.99"
        },
        {
            "name": "Gourmandise 4",
            "picname": "gourmandise4",
            "desc": "",
            "prix": "3.99"
        },
        {
            "name": "Gourmandise 5",
            "picname": "gourmandise5",
            "desc": "",
            "prix": "3.99"
        }
    ]);

});


router.post('/mail', function(req, res, next) {
    var mailto = req.body.mailto;
    var mailfrom = req.body.mailfrom;
    var subject = req.body.subject;
    var text = req.body.text;
    var html = req.body.html;
    email.send({
            host: "smtp.rvdechavigny.fr",
            port: "587",
            ssl: false,
            domain: "rvdechavigny.fr",
            to: mailto,
            from: mailfrom,
            subject: subject,
            text: text,
            html: html,
            authentication: "login", // auth login is supported; anything else $
            username: 'herve@rvdechavigny.fr',
            password: 'd@nZel77'
        },
        function(err, result) {
            if (err) {
                console.log(err);
                res.json({
                    error: err,
                    format: "?mailto=mailto&mailfrom=from&subject=untest&text=test&html=text"
                });
                //result.send("error occured"); 
            } else {
                console.log('Super! Email Envoyé');
                res.send("Email envoyé")
            }
        });
});



router.post('/adauth', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'adldapTest',
            'parameters': [username, password]
        })

    }, function(error, response, body) {

        res.json(body);
    });

});

router.post('/printers', function(req, res, next) {
    var imp = req.body.imprimante;
    var impquery = '';
    if (String(imp).length >= 10) {
        impquery = String(imp).substr(0, 9) + '*';
    } else {
        impquery = String(imp).replace('*', '') + '*';
    }
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'lstOutqArr',
            'parameters': [impquery]
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});


router.post('/glpimail', function(req, res, next) {
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'getMailSupport',
            'parameters': []
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});


router.post('/cajour', function(req, res, next) {
    var ensnom = req.body.enseigne;
    var annee = req.body.annee;
    var mois = req.body.mois;
    var jour = req.body.jour;
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'ork_ca',
            'parameters': [ensnom, annee, mois, jour]
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});



router.post('/caevomois', function(req, res, next) {
    var ensnom = req.body.enseigne;
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'ork_ca_evo_mois',
            'parameters': [ensnom]
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});


router.post('/rstedtmsgw', function(req, res, next) {
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'autoEdtMsgw',
            'parameters': []
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});


router.post('/ipimp', function(req, res, next) {
    var imp = req.body.imprimante;
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'getIpImp',
            'parameters': [imp]
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});


router.post('/dblquser', function(req, res, next) {
    var user = req.body.user;
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'debloqUser',
            'parameters': [user]
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});


router.post('/dblqecomax', function(req, res, next) {
    //var user = req.body.user;
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'debloqEcomax',
            'parameters': []
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});



router.post('/dblqdev', function(req, res, next) {
    var dev = req.body.device;
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'debloqDevice',
            'parameters': [dev]
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});


router.post('/chkIp', function(req, res, next) {
    var ipval = req.body.ipval;
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'chkIp',
            'parameters': [ipval]
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});



router.post('/startedt', function(req, res, next) {
    var imp = req.body.imprimante;
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'startEditeur',
            'parameters': [imp]
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});



router.post('/stopedt', function(req, res, next) {
    var imp = req.body.imprimante;
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'stopEditeur',
            'parameters': [imp]
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});


router.post('/infmag', function(req, res, next) {
    var num = req.body.num;
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'query_AS400JSON',
            'parameters': ["select * from vvbase/vvinfmag where NUMMAG='" + num + "' "]
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});


router.post('/initmag', function(req, res, next) {
    var nummag = req.body.num;
    var ipcaisse = req.body.ipcaisse;
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'query_update',
            'parameters': ["insert into vvbase/vvinfmag (nummag,ipork) values ('" + nummag + "','" + ipcaisse + "')"]
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});


router.post('/infmag', function(req, res, next) {
    var nummag = req.body.num;
    var chp = req.body.champ;
    var valdata = req.body.valdata;
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'query_update',
            'parameters': ["update  vvbase/vvinfmag  set " + chp + "='" + valdata + "' where nummag='" + nummag + "'"]
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});


router.post('/orknbcai', function(req, res, next) {
    var ipm = req.body.ipmagasin;
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'testnbcaisses',
            'parameters': [ipm]
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});


router.post('/orkcaisse', function(req, res, next) {
    var ipm = req.body.ipmagasin;
    var cnum = req.body.numcaisse;
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'testorkaisse',
            'parameters': [ipm, '1', cnum]
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});


router.post('/orksrv', function(req, res, next) {
    var ipm = req.body.ipmagasin;
    var cnum = req.body.numcaisse;
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'testorkaisse',
            'parameters': [ipm, '2', cnum]
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});


router.post('/orkatos', function(req, res, next) {
    var ipm = req.body.ipmagasin;
    var cnum = req.body.numcaisse;
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'testorkaisse',
            'parameters': [ipm, '3', cnum]
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});


router.post('/orktpe', function(req, res, next) {
    var ipm = req.body.ipmagasin;
    var cnum = req.body.numcaisse;
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'testorkaisse',
            'parameters': [ipm, '4', cnum]
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});


router.post('/orktpedblq', function(req, res, next) {
    var ipm = req.body.ipmagasin;
    var cnum = req.body.numcaisse;
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'testorkaisse',
            'parameters': [ipm, '5', cnum]
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});


router.post('/magbyens', function(req, res, next) {
    var ens = req.body.enseigne;
    request({
        url: "http://3hservices.hhhgd.com/Amfphp/?contentType=application/json",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'serviceName': 'vvproxy_tests',
            'methodName': 'query_AS400JSON',
            'parameters': ["select * from vvbase/vvmobmagip where ENSNOM like '" + ens + "%' "]
        })

    }, function(error, response, body) {

        res.json(JSON.parse(body));
    });
});



router.post('/adusr/infos', function(req, res, next) {
    var username = req.body.username;
    var user = "3HSERVICES\\thsdche";
    var pass = "d@nZel77";
    var auth = "Basic " + new Buffer(user + ":" + pass).toString("base64");
    //var auth = 'Basic ' + new Buffer("3HSERVICES\thsdche:d@nZel77").toString('base64');
    console.log("Autorization", auth);
    var hd = { "Authorization": auth };
    // authorization: 'Basic M0hTRVJWSUNFU1x0aHNkY2hlOmRAblplbDc3'
    // Basic M0hTRVJWSUNFUwloc2RjaGU6ZEBuWmVsNzc=
    // 'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64')
    var options = {
        method: 'POST',
        url: 'http://localhost:8888/',
        qs: { command: 'GET-ADUSER  ' + username + ' -properties * ' },
        headers: hd
    };

    request(options, function(error, response, body) {
        //if (error) throw new Error(error);
        res.json(JSON.parse(body));
    });
});




router.post('/adusr/grpmember', function(req, res, next) {
    var username = req.body.username;
    var user = "3HSERVICES\\thsdche";
    var pass = "d@nZel77";
    var auth = "Basic " + new Buffer(user + ":" + pass).toString("base64");
    //var auth = 'Basic ' + new Buffer("3HSERVICES\thsdche:d@nZel77").toString('base64');
    console.log("Autorization", auth);
    var hd = { "Authorization": auth };
    // authorization: 'Basic M0hTRVJWSUNFU1x0aHNkY2hlOmRAblplbDc3'
    // Basic M0hTRVJWSUNFUwloc2RjaGU6ZEBuWmVsNzc=
    // 'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64')
    var options = {
        method: 'POST',
        url: 'http://localhost:8888/',
        qs: { command: 'GET-ADUSER  ' + username + ' -properties MemberOf| Select-Object MemberOf' },
        headers: hd
    };

    request(options, function(error, response, body) {
        //if (error) throw new Error(error);
        res.json(JSON.parse(body));
    });
});

router.post('/adshare', function(req, res, next) {
    var computername = req.body.computername;
    var user = "3HSERVICES\\thsdche";
    var pass = "d@nZel77";
    var auth = "Basic " + new Buffer(user + ":" + pass).toString("base64");
    //var auth = 'Basic ' + new Buffer("3HSERVICES\thsdche:d@nZel77").toString('base64');
    console.log("Autorization", auth);
    var hd = { "Authorization": auth };
    // authorization: 'Basic M0hTRVJWSUNFU1x0aHNkY2hlOmRAblplbDc3'
    // Basic M0hTRVJWSUNFUwloc2RjaGU6ZEBuWmVsNzc=
    // 'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64')
    var options = {
        method: 'POST',
        url: 'http://localhost:8888/',
        qs: { command: 'Get-WmiObject -Class Win32_Share -ComputerName ' + computername + "|Select-Object Name, Path" },
        headers: hd
    };

    request(options, function(error, response, body) {
        //if (error) throw new Error(error);
        res.json(JSON.parse(body));
    });
});



router.post('/adusroff', function(req, res, next) {
    var nbweek = req.body.nbweek;
    var user = "3HSERVICES\\thsdche";
    var pass = "d@nZel77";
    var auth = "Basic " + new Buffer(user + ":" + pass).toString("base64");
    //var auth = 'Basic ' + new Buffer("3HSERVICES\thsdche:d@nZel77").toString('base64');
    console.log("Autorization", auth);
    var hd = { "Authorization": auth };
    // authorization: 'Basic M0hTRVJWSUNFU1x0aHNkY2hlOmRAblplbDc3'
    // Basic M0hTRVJWSUNFUwloc2RjaGU6ZEBuWmVsNzc=
    // 'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64')
    var options = {
        method: 'POST',
        url: 'http://localhost:8888/',
        qs: { command: 'DSQuery user -inactive ' + nbweek },
        headers: hd
    };

    request(options, function(error, response, body) {
        //if (error) throw new Error(error);
        res.json(JSON.parse(body));
    });
});


router.post('/adcpoff', function(req, res, next) {
    var nbweek = req.body.nbweek;
    var user = "3HSERVICES\\thsdche";
    var pass = "d@nZel77";
    var auth = "Basic " + new Buffer(user + ":" + pass).toString("base64");
    //var auth = 'Basic ' + new Buffer("3HSERVICES\thsdche:d@nZel77").toString('base64');
    console.log("Autorization", auth);
    var hd = { "Authorization": auth };
    // authorization: 'Basic M0hTRVJWSUNFU1x0aHNkY2hlOmRAblplbDc3'
    // Basic M0hTRVJWSUNFUwloc2RjaGU6ZEBuWmVsNzc=
    // 'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64')
    var options = {
        method: 'POST',
        url: 'http://localhost:8888/',
        qs: { command: 'DSQuery Computer -inactive ' + nbweek },
        headers: hd
    };

    request(options, function(error, response, body) {
        //if (error) throw new Error(error);
        res.json(JSON.parse(body));
    });
});


router.post('/adusrdisabled', function(req, res, next) {
    var user = "3HSERVICES\\thsdche";
    var pass = "d@nZel77";
    var auth = "Basic " + new Buffer(user + ":" + pass).toString("base64");
    //var auth = 'Basic ' + new Buffer("3HSERVICES\thsdche:d@nZel77").toString('base64');
    console.log("Autorization", auth);
    var hd = { "Authorization": auth };
    // authorization: 'Basic M0hTRVJWSUNFU1x0aHNkY2hlOmRAblplbDc3'
    // Basic M0hTRVJWSUNFUwloc2RjaGU6ZEBuWmVsNzc=
    // 'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64')
    var options = {
        method: 'POST',
        url: 'http://localhost:8888/',
        qs: { command: 'Search-ADAccount -AccountDisabled -UsersOnly | Select-Object SamAccountName' },
        headers: hd
    };

    request(options, function(error, response, body) {
        //if (error) throw new Error(error);
        res.json(JSON.parse(body));
    });
});


router.post('/adusrenable', function(req, res, next) {
    var username = req.body.username;
    var user = "3HSERVICES\\thsdche";
    var pass = "d@nZel77";
    var auth = "Basic " + new Buffer(user + ":" + pass).toString("base64");
    //var auth = 'Basic ' + new Buffer("3HSERVICES\thsdche:d@nZel77").toString('base64');
    console.log("Autorization", auth);
    var hd = { "Authorization": auth };
    // authorization: 'Basic M0hTRVJWSUNFU1x0aHNkY2hlOmRAblplbDc3'
    // Basic M0hTRVJWSUNFUwloc2RjaGU6ZEBuWmVsNzc=
    // 'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64')
    var options = {
        method: 'POST',
        url: 'http://localhost:8888/',
        qs: { command: 'Enable-ADAccount -Identity ' + username },
        headers: hd
    };

    request(options, function(error, response, body) {
        //if (error) throw new Error(error);
        res.json(JSON.parse(body));
    });
});



router.post('/adusrunlock', function(req, res, next) {
    var username = req.body.username;
    var user = "3HSERVICES\\thsdche";
    var pass = "d@nZel77";
    var auth = "Basic " + new Buffer(user + ":" + pass).toString("base64");
    //var auth = 'Basic ' + new Buffer("3HSERVICES\thsdche:d@nZel77").toString('base64');
    console.log("Autorization", auth);
    var hd = { "Authorization": auth };
    // authorization: 'Basic M0hTRVJWSUNFU1x0aHNkY2hlOmRAblplbDc3'
    // Basic M0hTRVJWSUNFUwloc2RjaGU6ZEBuWmVsNzc=
    // 'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64')
    var options = {
        method: 'POST',
        url: 'http://localhost:8888/',
        qs: { command: 'Unlock-ADAccount -Identity ' + username },
        headers: hd
    };

    request(options, function(error, response, body) {
        //if (error) throw new Error(error);
        res.json(JSON.parse(body));
    });
});



router.post('/adusrdisable', function(req, res, next) {
    var username = req.body.username;
    var user = "3HSERVICES\\thsdche";
    var pass = "d@nZel77";
    var auth = "Basic " + new Buffer(user + ":" + pass).toString("base64");
    //var auth = 'Basic ' + new Buffer("3HSERVICES\thsdche:d@nZel77").toString('base64');
    console.log("Autorization", auth);
    var hd = { "Authorization": auth };
    // authorization: 'Basic M0hTRVJWSUNFU1x0aHNkY2hlOmRAblplbDc3'
    // Basic M0hTRVJWSUNFUwloc2RjaGU6ZEBuWmVsNzc=
    // 'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64')
    var options = {
        method: 'POST',
        url: 'http://localhost:8888/',
        qs: { command: 'Disable-ADAccount -Identity ' + username },
        headers: hd
    };

    request(options, function(error, response, body) {
        //if (error) throw new Error(error);
        res.json(JSON.parse(body));
    });
});


router.get('/phonegap', function(req, res) {
    var options = {
        method: 'GET',
        url: 'https://build.phonegap.com/api/v1/me?auth_token=kKeKAxVug4C2ggQ9PzKB'
    };

    request(options, function(error, response, body) {
        //if (error) throw new Error(error);
        res.json(JSON.parse(body));
    });
});


router.get('/phonegap/app', function(req, res) {
    var options = {
        method: 'GET',
        url: 'https://build.phonegap.com/api/v1/apps?auth_token=kKeKAxVug4C2ggQ9PzKB'
    };

    request(options, function(error, response, body) {
        //if (error) throw new Error(error);
        res.json(JSON.parse(body));
    });
});


router.post('/signup', function(req, res, next) {
    console.log("enregistrement sans authentification");

    console.log("Table User:", req.method);
    var newuser = new Users({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    });

    newuser.save(function(err, data) {
        if (err) {
            res.json({
                success: false,
                message: err
            })

        } else {
            res.json({
                success: true,
                message: data
            });

        }

    })
});




http.createServer(app).listen(3000);
console.log("Serveur API Restful Herve de CHAVIGNY en ecoute sur le port 3000!");


// Enable https 
/*
var privateKey = fs.readFileSync('./vvkey.pem');
var certificate = fs.readFileSync('./vvcert.pem');

var credentials = {
    key: privateKey,
    cert: certificate
};
https.createServer(credentials, app).listen(8443);
console.log("Serveur API Restful Herve de CHAVIGNY en ecoute sur le port 8443!");
*/


myApp = require('electron').app;

// Quit when all windows are closed.
myApp.on('window-all-closed', function() {



    if (process.platform != 'darwin')
        myApp.quit();

});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
myApp.on('ready', () => {




    var app_context_menu = [{
            label: 'Quitter',
            accelerator: 'CmdOrCtrl+Q',
            click: () => {
                willQuitApp = true;
                if (process.platform != 'darwin')
                    myApp.quit();

            }
        }

    ];

    var application_menu = [{
        label: 'menu1',
        submenu: [{
                label: 'Undo',
                accelerator: 'CmdOrCtrl+Z',
                role: 'undo'
            },
            {
                label: 'Open',
                accelerator: 'CmdOrCtrl+O',
                click: () => {
                    electron.dialog.showOpenDialog({
                        properties: ['openFile', 'openDirectory', 'multiSelections']
                    });
                }
            },
            {
                label: 'submenu1',
                submenu: [{
                        label: 'item1',
                        accelerator: 'CmdOrCtrl+A',
                        click: () => {
                            mainWindow.openDevTools();
                        }
                    },
                    {
                        label: 'item2',
                        accelerator: 'CmdOrCtrl+B',
                        click: () => {
                            mainWindow.closeDevTools();
                        }
                    }
                ]
            }
        ]
    }];
    if (process.platform == 'darwin') {
        const name = app.getName();

        application_menu.unshift({
            label: name,
            submenu: [{
                    label: 'About ' + name,
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Services',
                    role: 'services',
                    submenu: []
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Hide ' + name,
                    accelerator: 'Command+H',
                    role: 'hide'
                },
                {
                    label: 'Hide Others',
                    accelerator: 'Command+Shift+H',
                    role: 'hideothers'
                },
                {
                    label: 'Show All',
                    role: 'unhide'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click: () => {
                        myApp.quit();
                    }
                },
            ]
        });
    }


    // defini une icon en barre de tache
    trayIcon = new Tray(nativeImage.createFromPath(iconPath));
    trayIcon.setToolTip('VVRESTSHELL:  Moteur Rest PowerShell');
    traymenu = Menu.buildFromTemplate(app_context_menu);
    trayIcon.setContextMenu(traymenu);

    // Create the browser window.
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            devTools: true
        },
        resizable: true,
        width: 400,
        height: 740
    });

    mainWindow.setMenu(null);
    mainWindow.webContents.openDevTools();

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/www/index.html');




    // defini un menu pour l'application
    //menu = Menu.buildFromTemplate(application_menu);
    //Menu.setApplicationMenu(menu);

    // Emitted when the window is closed.

    trayIcon.on('click', (e) => {
        mainWindow.show();
    });

    mainWindow.on('close', (e) => {
        //willQuitApp = true;
        if (willQuitApp) {
            /* the user tried to quit the app */
            mainWindow = null;
            //server.close();
        } else {
            /* the user only tried to close the window */
            e.preventDefault();
            mainWindow.hide();
        }
    });

});


/*
function createWindow() {
    // Use custom menu
    createMenu()

    // Create the browser window.
    mainWindow = new BrowserWindow({autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
        devTools: true
      },
      resizable: true,
      width: 400,
      height: 740})


    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

*/