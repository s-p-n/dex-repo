module.exports = function (Main, response, url) {
	if (url.search === "" || url.search === "?") {
		throw new Error("No Search Specified.");
	}
	var stream = Main.packages.find(url.query).stream();
	response.writeHead('200', {"content-type": "application/json"});
	response.write("[");
	var not_first = false;
	stream.on("data", function (item) {
		if (not_first) {
			response.write(",");
		} else {
			not_first = true;
		}
		response.write(JSON.stringify(item));
	});
	stream.on("end", function () {
		response.end("]");
		Main.print("Response Given.")
	});
};
