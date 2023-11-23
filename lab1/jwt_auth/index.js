const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')
const port = 3000
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const app = express()



app.use(bodyParser.json())
app.use(cookieParser())

const SESSION_KEY = 'Authorization'
const jwtKey = generateKey();
const tokenExpirationTime = 60

const users = [
    {
        login: 'Login',
        password: 'Password',
        username: 'Username',
    },
    {
        login: 'Login1',
        password: 'Password1',
        username: 'Username1',
    },
]

app.get('/', (req, res) => {
    let token = req.get(SESSION_KEY)
    let reqBody
    if (!token) {
        return res.sendFile(path.join(__dirname + '/index.html'))
    }
    
    try {
        reqBody = jwt.verify(token, jwtKey)
    } catch (e) {
        return res.sendFile(path.join(__dirname + '/index.html'))
    } 

    res.json({ username: reqBody.username, logout: `http://localhost:3000/logout` })
})

app.get('/logout', (req, res) => {
    res.redirect('/')
})

app.post('/api/login', (req, res) => {
    const { login, password } = req.body
    const user = users.find((user) => {
        return user.login == login && user.password == password
    })

    if (user) {
        const token = generateToken(login, user)
        return res.json({ token: token })
    }

    res.status(401).send()
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

function generateToken(login, user) {
    return jwt.sign({ login: login, username: user.username }, jwtKey, {
        algorithm: 'HS256',
        expiresIn: tokenExpirationTime,
    })
}

function generateKey() {
    const keyLengthInBytes = 64;

    const randomBytes = crypto.randomBytes(keyLengthInBytes);

    const base64Key = randomBytes.toString('base64');

    return base64Key;
}