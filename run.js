var Main = {};
Main.q = require('q');
Main.url = require('url');
Main.get = require ('./get.js');
Main.dbConnectUrl = 'mongodb://localhost:27017/dexRepo';
Main.dbConnect = Main.q.denodeify(require('mongodb').MongoClient.connect);
Main.toArray = function toArray (thisArg) {
	return [].slice.call(thisArg);
};
Main.print = Main.q.fbind(function print () {
	console.log.apply(this, Main.toArray(arguments));
});
Main.respond = Main.q.fbind(function respond (response, url) {
	if (url.pathname === "/get") {
		return Main.get(Main, response, url);
	}
	throw new Error("Feature not implemented");
});
Main.start = function (db) {
	Main.db = db;
	Main.packages = Main.db.collection('packages');
	require('http').createServer(function (request, response) {
		var url_parts = Main.url.parse(request.url, true);
		if (url_parts.pathname.lastIndexOf("/") === url_parts.pathname.length - 1) {
			url_parts.pathname = url_parts.pathname.substr(0, url_parts.pathname.lastIndexOf("/"));
		}
		url_parts.pathname = url_parts.pathname.toLowerCase();
		Main.print(url_parts);
		Main.print("Request made for:", url_parts.path);
		Main.respond(response, url_parts).
	    	fail(function (err) {
	    		console.error("Some Error Occured:", err);
	    		response.writeHead(500, {"content-type": "application/json"});
	    		response.end(JSON.stringify("Server " + err));
	    	});
	}).listen(8080);
	Main.print("Server Running");
};

Main.dbConnect(Main.dbConnectUrl).
	then(Main.start);
