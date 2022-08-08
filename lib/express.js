const fs = require("fs");
const path = require("path");
let url = require('url')
let querystring = require('querystring')

class Express {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    get(route, callback) {
        let { query, pathname } = url.parse(this.req.url)
        query = querystring.parse(query)
        this.req.query = query
        if (pathname == route && this.req.method == "GET") {
            callback(this.req, this.res);
        }
    }

    post(route, callback) {
        if (this.req.url == route && this.req.method == "POST") {
            callback(this.req, this.res);
        }
    }

    put(route, callback) {
        if (this.req.url == route && this.req.method == "PUT") {
            callback(this.req, this.res)
        }
    }

    delete(route, callback) {
        if (this.req.url == route && this.req.method == "DELETE") {
            callback(this.req, this.req)
        }
    }

    htmlEngine(pathName) {
        this.res.htmlRender = (fileName) => {
            let buffer = fs.readFileSync(path.join(pathName, fileName + ".html"));
            this.res.end(buffer);
        };
    }

    cssEngine(pathName) {
        this.res.cssRender = (fileName) => {
            let buffer = fs.readFileSync(path.join(pathName, fileName + ".css"));
            this.res.end(buffer);
        };
    }



}

module.exports = Express