var fs = require("fs");

exports.hook_data = function (next, connection) {
    // enable mail body parsing
    connection.transaction.parse_body = 1;
	next();   
}

exports.hook_queue = function (next, connection) {
   var body = connection.transaction.body;
   this.loginfo(body);
   var that = this;
   fs.writeFile("/tmp/body_content.json", JSON.stringify(body), function(err) {
    if(err) {
        throw err;
        next();
    } else {
        that.loginfo("The file was saved!");
        next();
    }
    });
}

