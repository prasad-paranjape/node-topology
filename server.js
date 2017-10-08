var config = require('config');
const http = require('http');

const hostname = '127.0.0.1';
const port = config.port;

function isEmptyObject(obj){
    return JSON.stringify(obj) === '{}';
}

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  var nodes = config.nodes;
  let node_name = config.util.getEnv('NODE_ENV');
  req.setEncoding('utf8');
  var response = [];
  let rawData = ''; 
  req.on('data', function (chunk) {
     console.log("body: ", chunk);
	 rawData += chunk;
  });
  
  req.on('end', () => {
	  let node_body = JSON.parse(rawData);

	  nodes.forEach(function(item, index){
		  if (!node_body.hasOwnProperty(node_name)) {

		  let body = {};
		  body[node_name] = nodes;

		  if (!isEmptyObject(node_body)){
			  for(var prop in node_body) {
				  body[prop] = node_body[prop];
			  }
		  } 
		  makeCall(item, body, function(results){
			  response.push(results);
			  res.end(JSON.stringify(response));
		  });
	  }
	  });
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});



function makeCall(port, body, callback) {
	var data = JSON.stringify(body);
	var options = {
	  host: "127.0.0.1",
	  port: port,
	  path: '/',
	  method: 'POST',
	  headers: {
		  'Content-Type': 'application/json',
	  }
	};

	let req = http.request(options, function(res){
  	  let rawData = '';
  	  res.on('data', function (chunk) {
  		rawData += chunk;
  	  });
	  res.setEncoding('utf8');
	  
	  callback(rawData);
	});
	req.on('error', (e) => {
		callback({});
	});
	req.write(data);
	req.end();
}