var path = require('path'),
    express = require('express'),

    ngrok = require('ngrok'),

    localServer = express(),
    port = 8080,
    srcPath = path.normalize(__dirname) + '/src',
    testStand = 'http://auth.wi-fi.ru/auth?segment=test_branding&url=';

localServer.use('/test_local', function(req, res){
    res.redirect(testStand + 'http://localhost:' + port + '/branding');
});


/**
 * localhost tunnelling
 */
localServer.use('/test_external', function(req, res){
    ngrok.connect({
        proto: 'http',
        addr: port,
        region: 'eu'
    }, function (err, url) {
        if (err || !url){
            var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
            res.send("<html><head></head><body>" +
                "<div>" + (err || 'Произошла ошибка') + "</div>" +
                "<a href="+fullUrl+">Обновить страницу</a>" +
                "</body></html>")
        }
        else res.redirect(testStand + (url.replace(/^https/g, 'http')) + '/branding');
    });


});

localServer.use(express.static(srcPath));

module.exports = localServer.listen(port, function (err) {
    if (err) {
        console.log(err);
        return
    }
    console.log('Listening at http://localhost:' + port + '\n')
});
