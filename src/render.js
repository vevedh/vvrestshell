// Get Global Variables
let remote = require('electron').remote;
const powershell = require('node-powershell');

let ps = new powershell({ executionPolicy: 'Bypass', debugMsg: true, noProfile: true });


ps.addCommand('Import-Module "./pwrshell/MyHttpListener/HttpListener.psd1" -Force')
    .then(function() {
        return ps.invoke();
    })
    .then(function(output) {
        console.log(output);
        // ps.dispose();
        ps.addCommand('./pwrshell/starthttp_8888.ps1')
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