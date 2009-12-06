// INPUT
//eval?name=XXX&file=XXX&js=XXX

// OUTPUT
// { success: true,  result: "" } 
// { success: false, exception: "" }

var sys = require("sys");
var fu = require("./fu");

Config = {
  port: "1234",
  domain: "127.0.0.1"
}

function require_absolute(path) {
  var folders = path.split("/")
  var module_path = folders.pop()
  require.paths.unshift(folders.join("/"))
  mod = require(module_path)
  require.paths.shift()
  return mod
}

var Contexts = {};

function loadContext(name, file) {
  if(file) {
    sys.puts("Loading context for name: " + name + ", and file: " + file + "")
    file = file.replace(".js", "")  
    Contexts[name] = require_absolute(file)
  } else {
    Contexts[name] = require("./blank_context");
  }
  return Contexts[name]
}

function getContext(name, file) {
  return Contexts[name] || loadContext(name, file)
}

fu.listen(Config.port, Config.domain)

fu.get("/eval", function (req, res) {
  var result = { success:false}

  try {
    var params = req.uri.params
    var context = getContext(params["name"] || "", params["file"])
    var js = params["js"]
    
    sys.puts("received JS: " + js) 
    
    with(context) {
      result["result"] = eval(js) 
      if(result["result"] == undefined)
        result["result"] = null
      result["success"] = true
    }
  } catch(ex) {
    result["exception"] = ex.toString()
  }
  
  sys.puts("Returning:" + JSON.stringify(result))
  res.simpleJSON(200, result);
});