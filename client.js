const request = require('request-promise');const urls = ["http://127.0.0.1:3000"];const promises = urls.map(url => request(url));Promise.all(promises).then((data) => {		//console.log(data);	//console.log(JSON.stringify(data).replace(/\\/gi,""));	console.log(JSON.parse(data));});