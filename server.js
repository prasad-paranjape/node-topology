const config = require('config');
const http = require('http');
const request = require('request-promise');
const hostname = '127.0.0.1';
const port = config.port;
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    let nodes = config.nodes;
    let node_name = config.util.getEnv('NODE_ENV');
    const promises = nodes.map(url => request(url));
    let p = Promise.all(promises).then(function(data) {
        let t = [];
        let z = [];
        let x = [];
        try {
            data.forEach(function(item, index) {
                let f = JSON.parse(item);
                delete(f.node_name);
                f.data.forEach(function(item, index) {
                    if (item !== '!') {
                        t.push(item);
                    }
                });
                delete(f.data);
                t.push(f);
                z.push(JSON.parse(item).node_name);
            });
        } catch (e) {
            t.push(data);
            z.push(data);
            x.push(data);
        }
        let a = {};
        a[node_name] = z;
        a['node_name'] = node_name;
        a['data'] = t;
        return a;
    }, function(data) {
        let a = {};
        a[node_name] = '?';
        a['node_name'] = node_name;
        a['data'] = ['!'];
        return a;
    });
    p.then(function(data) {
        res.end(JSON.stringify(data));
    });
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});