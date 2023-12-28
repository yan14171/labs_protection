const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const APP_DOMAIN = "localhost";
const APP_PORT = 3000;

const CLIENT_SECRET = 'dMMUZw2KaZljad5p7Wne-Q02ibXXcAS0v6vjYExc1rZGG1v6mfm3SUsSQSiotfx8'; //y@%KNh.6N_G@9fP
const CLIENT_ID = 'knZNLqLRDsvsqEdPMoxCMD5xpeIJrDyj';
const DOMAIN = 'https://dev-owqdbfl3v34skx34.us.auth0.com';
const AUDIENCE = 'https:/test1-dev.com';// `https://${DOMAIN}/api/v2/`;

const LOGIN_REDIRECT_URL = `http://${APP_DOMAIN}:${APP_PORT}`;
const LOGIN_URL = `${DOMAIN}/authorize?client_id=${CLIENT_ID}&redirect_uri=${LOGIN_REDIRECT_URL}&audience=${AUDIENCE}&response_type=code&response_mode=query`;

app.use(async (req, res, next) => {
    console.log("[REQUEST URL] - " + req.url)
    if (req && req.url === '/logout') {
        next();
    }
    const token = req.get('Authorization');
    console.log("[REQUEST TOKEN] - " + token)
    if (token) {
        try {
            jwt.verify(token, await getTokenPEM(`${DOMAIN}/pem`), (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: "Invalid token." });
                }
                req.user = decoded;
                next();
            });
        } catch (e) {
            console.error('[REQUEST ERROR TOKEN]', e);
            next();
        }
    } else {
        next();
    }
});

async function getTokenPEM(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch public key: ${response.statusText}`);
    }

    return await response.text();
}

app.get('/', (req, res) => {
    if (req.user && req.user.sub) {
        return res.json({
            username: req.user.sub,
            logout: 'http://localhost:3000/logout'
        })
    }

    if (req.query.code) {
        return res.sendFile(path.join(__dirname+'/index.html'));
    }

    res.redirect(LOGIN_URL);
})

app.get('/logout', (req, res) => {
    res.json({ message: 'Logged out. Remove token from client.' });
});

app.post('/api/login', async (req, res) => {
    const { code } = req.body;
    console.log("[LOGIN CODE] - " + code);

    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('client_id', CLIENT_ID);
        params.append('client_secret', CLIENT_SECRET);
        params.append('audience', AUDIENCE);
        params.append('redirect_uri', LOGIN_REDIRECT_URL);

        const response = await fetch(`${DOMAIN}/oauth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} Body: ${JSON.stringify(await response.json())}`);
        }

        const data = await response.json();
        const token = data['access_token'];
        return res.json({ token });
    } catch (error) {
        console.error('[LOGIN Error]: ', error);
        res.status(401).send();
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})