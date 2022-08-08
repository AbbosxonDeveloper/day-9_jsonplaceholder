const http = require('http')
const fs = require('fs')
const path = require('path')
const Express = require('./lib/express.js')


function httpServer(req, res) {
    const app = new Express(req, res)

    app.get('/news', (req, res) => {
        let date = new Date().toDateString()
        console.log(date)
        let { title, newsId, body, created } = req.query
        let users = fs.readFileSync(path.join(process.cwd(), 'database', 'users.json'), 'utf-8')
        users = JSON.parse(users)
        console.log(req.query)
        let user = users.filter(user => user.newsId == newsId || user.title == title || user.body == body || user.created == created)
        if (user) {
            return res.end(JSON.stringify(user))
        }
        return res.end('')
    })


    app.post('/register', (req, res) => {
        let str = ''
        req.on('data', chunk => str += chunk)
        req.on('end', () => {
            let users = fs.readFileSync(path.join('database', 'users.json'), 'utf-8')
            let newUser = JSON.parse(str)
            if (newUser.title && newUser.body) {
                users = JSON.parse(users)
                let date = new Date().toDateString()
                newUser.created = date
                newUser.newsId = users.at(-1).newsId + 1
                users.push(newUser)
                fs.writeFileSync(path.join("database", "users.json"), JSON.stringify(users, null, 4));
                res.end('you are registered')
            }
        })
    })

    app.post('/login', (req, res) => {
        let str = "";
        req.on("data", (chunk) => (str += chunk))
        req.on('end', () => {
            let users = fs.readFileSync(path.join('database', 'users.json'), 'utf-8')
            let { username, password } = JSON.parse(str)
            users = JSON.parse(users)
            let user = users.find(user => user.username == username && user.password == password)
            if (user) {
                res.end(JSON.stringify({ status: 200, message: "ok" }))
            } else {
                res.end(JSON.stringify({ status: 401, message: "wrong username or password" }));
            }
        })
    })

    app.put('/users', (req, res) => {
        console.log("ok");
        let str = ''
        req.on('data', chunk => str += chunk)
        req.on('end', () => {
            let users = fs.readFileSync(path.join('database', 'users.json'), 'utf-8')
            let { userid, username } = JSON.parse(str)
            users = JSON.parse(users)
            let changeUser = users.find(user => user.userId == userid)
            if (changeUser) {
                changeUser.username = username
                fs.writeFileSync(path.join("database", "users.json"), JSON.stringify(users, null, 4));
                res.end('user updated')
            }
        })
    })

    app.delete('/delete', (req, res) => {
        let str = ''
        req.on('data', (chunk) => str += chunk)
        req.on('end', () => {
            let users = fs.readFileSync(path.join('database', 'users.json'), 'utf-8')
            let { newsId } = JSON.parse(str)
            users = JSON.parse(users)
            users = users.filter(user => user.newsId !== newsId)
            if (users) {
                fs.writeFileSync(path.join("database", "users.json"), JSON.stringify(users, null, 4))
                res.end('deleted')
            }
        })
    })




}

let i = [1, 2, 3, 4, 5]
i = i.filter(e => e > 2)
console.log(i)



const server = http.createServer(httpServer)
server.listen(4000, () => console.log("server ready http://localhost:4000"))



























// const createPath = (page) => path.join('views', page + '.html') 
// let fileName = ''

// switch (req.url) {
//   case "/":
//     fileName = createPath("index");
//     break;
//   case "/about":
//     fileName = createPath("about");
//   break;
//   default :
//     fileName = createPath('error')
//   break
// }

// res.end(fs.readFileSync(fileName))