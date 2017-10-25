const config = require('config');
const http = require('http');
const request = require('request-promise');

const hostname = '127.0.0.1';
const port = config.port;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  var nodes = config.nodes;
  let node_name = config.util.getEnv('NODE_ENV');
	  const promises = nodes.map(url => request(url));
	  let p = Promise.all(promises)
	  .then(function(data){
		return data;
	  }, function(data){
		return '?';
	  });

	  p.then(function(data){
  	  	var a = {};
  		a[node_name] = data;
		res.end(JSON.stringify(a));
	  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});