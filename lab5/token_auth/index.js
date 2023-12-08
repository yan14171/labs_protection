const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const CLIENT_SECRET = 'dMMUZw2KaZljad5p7Wne-Q02ibXXcAS0v6vjYExc1rZGG1v6mfm3SUsSQSiotfx8'; //y@%KNh.6N_G@9fP
const CLIENT_ID = 'knZNLqLRDsvsqEdPMoxCMD5xpeIJrDyj';
const DOMAIN = 'https://dev-owqdbfl3v34skx34.us.auth0.com';
const AUDIENCE = 'https:/test1-dev.com';// `https://${DOMAIN}/api/v2/`;

app.use(async (req, res, next) => {
    console.log(req.url)
    const token = req.get('Authorization');
    
    if (req && req.url === '/logout') {
        next();
    }
    
    if (token != undefined) {
        
        const publicKeyResponse = await fetch(`${DOMAIN}/pem`);

        if (!publicKeyResponse.ok) {
            throw new Error(`Failed to fetch public key: ${publicKeyResponse.statusText}`);
        }
        let key = await publicKeyResponse.text();

        jwt.verify(token, key, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token." });
            }
            req.user = decoded;
        });
    } 
    
    next();
});

app.get('/', (req, res) => {
    if (req.user && req.user.sub) {
        return res.json({
            username: req.user.sub,
            logout: 'http://localhost:3000/logout'
        })
    }
    res.sendFile(path.join(__dirname+'/index.html'));
})

app.get('/logout', (req, res) => {
    res.json();
});

app.post('/api/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        let params = getLoginOptions(login, password)

        const response = await fetch(`${DOMAIN}/oauth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        if (!response.ok) {
            var errorResponse = await response.json();
            throw new Error(`HTTP error ${response.status}! ${errorResponse.error_description}`);
        }

        const data = await response.json();
        const token = data['access_token'];
        return res.json({ token });
    } catch (error) {
        console.error('Error:', error);
        res.status(401).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


function getLoginOptions(login, password)
{
    let params =  new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('username', login);
        params.append('password', password);
        params.append('audience', AUDIENCE);
        params.append('client_id', CLIENT_ID);
        params.append('client_secret', CLIENT_SECRET);

        return params;
}
