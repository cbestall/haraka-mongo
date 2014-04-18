//var databaseUrl = "localhost";
//var collections = ["email"];
//var db          = require("mongojs").connect(databaseUrl, collections);

var MongoClient = require('mongodb').MongoClient;

exports.hook_data = function (next, connection) {
    // enable mail body parsing
    connection.transaction.parse_body = 1;
    next();
}


exports.hook_queue = function (next, connection) {
    // basic logging so we can see if we have an email hitting the stack
    this.loginfo("New inbound email detected, inserting into mongodb");
    var that = this;

    MongoClient.connect('mongodb://127.0.0.1:27017/emails', function(err, db) {
        if(err) throw err;
	
	var transaction	  = connection.transaction;
        var receivedDate  = transaction.header.headers.date;
        var subjectLine   = transaction.header.headers.subject;
        var email         = transaction.mail_from;
        var message       = transaction.body;

	message = message.children[0].bodytext;	

        var collection = db.collection('test_insert');
        collection.insert({
            email : email, 
            receivedDate : receivedDate, 
            subjectLine: subjectLine, 
            message : message
        }, function(err, docs) {

	    if(err) throw err;

            collection.count(function(err, count) {
		that.logdebug("count = " + count);
            });
        });

        // passes control over to the next plugin within Haraka.
        next(OK);

    });


}

