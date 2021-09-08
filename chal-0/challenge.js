const https = require('https');

// start POST

var data = JSON.stringify({
    name: 'linux',
    contents: 'I\'d just like to interject for a moment. What you\'re referring to as Linux is in fact, GNU/Linux, or as I\'ve recently taken to calling it, GNU plus Linux...'
});

var options = {
    hostname: 'us-central1-acm-core.cloudfunctions.net',
    path: '/challenge/tags/linux/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
}

var req = https.request(options, res => {
    res.on('data', d => {
        console.log(`POST: ${d}`)
        get(JSON.parse(d).token);
    });
});

req.write(data);
req.end();

// end POST

// start GET 

function get (token) {
    https.get(`https://us-central1-acm-core.cloudfunctions.net/challenge/tags/linux/${token}`, res => {
        res.on('data', d => {
            console.log(`GET: ${d}`);
            patch(token);
        })
    }).on('error', error => {
        console.error(error);
    });
}

// end GET

// start PATCH

function patch (token) {
    data = JSON.stringify({
        contents: 'Something else'
    });
    
    options.path += token
    options.method = 'PATCH'
    options.headers = {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
    
    req = https.request(options, res => {
        res.on('data', d => {
            console.log(`PATCH: ${d}`);
            del(token);
        });
    });
    
    req.write(data);
    req.end();
}

// end PATCH

// start DELETE

function del (token) {
    options.method = 'DELETE'
    delete options.headers

    req = https.request(options, res => {
        console.log(`DELETE: ${res.statusMessage} ${res.statusCode}`);
    });

    req.end();
}

// end DELETE
    
req.on('error', error => {
    console.error(error);
});