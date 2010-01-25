var createServer = require("http").createServer;
var sys = require("sys");
var url = require("url")

DEBUG = false;

var fu = exports;

var NOT_FOUND = "Not Found\n";

function notFound(req, res) {
  res.sendHeader(404, [ ["Content-Type", "text/plain"]
                      , ["Content-Length", NOT_FOUND.length]
                      ]);
  res.sendBody(NOT_FOUND);
  res.finish();
}

var getMap = {};

fu.get = function (path, handler) {
  getMap[path] = handler;
};

var server = createServer(function (req, res) {
  if (req.method === "GET" || req.method === "HEAD") {
    
		
		var u = url.parse(req.url, true)
		
		req.query = u.query || {}
			
    var handler = getMap[u.pathname] || notFound;
    
		
    res.simpleText = function (code, body) {
      res.sendHeader(code, [ ["Content-Type", "text/plain"]
                           , ["Content-Length", body.length]
                           ]);
      res.sendBody(body);
      res.finish();
    };

    res.simpleJSON = function (code, obj) {
      var body = JSON.stringify(obj);
      res.sendHeader(code, [ ["Content-Type", "text/plain"]
                           , ["Content-Length", body.length]
                           ]);
      res.sendBody(body);
      res.finish();
    };

    handler(req, res);
  }
});

fu.listen = function (port, host) {
  server.listen(port, host);
  sys.puts("Server at http://" + (host || "127.0.0.1") + ":" + port.toString() + "/");
};

fu.close = function () { server.close(); };

// stolen from jack- thanks
fu.mime = {
  // returns MIME type for extension, or fallback, or octet-steam
  lookupExtension : function(ext, fallback) {
    return "txt" // fu.mime.TYPES[ext.toLowerCase()] || fallback || 'application/octet-stream';
  }
};
