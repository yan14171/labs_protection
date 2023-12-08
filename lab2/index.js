const request = require('request-promise')
const url = 'https://dev-owqdbfl3v34skx34.us.auth0.com';
let token;

const options = {
  method: 'POST',
  url: `${url}/oauth/token`,
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  form: {
    client_id: 'knZNLqLRDsvsqEdPMoxCMD5xpeIJrDyj',
    client_secret: 'dMMUZw2KaZljad5p7Wne-Q02ibXXcAS0v6vjYExc1rZGG1v6mfm3SUsSQSiotfx8',
    audience: `${url}/api/v2/`,
    grant_type: 'client_credentials',
  },  
}

// request(options, function(err, _, body) {
//   if(err) throw new Error(err);
//   console.log(body);
// })

request(options, (err, res, body) => {
  if (err) throw new Error(err)
  token = JSON.parse(body).access_token
}).then(() => {

  const newOptions = {
    method: 'POST',
    url: `${url}/api/v2/users`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email: 'atme222@gmail.com',
      user_metadata: {},
      blocked: false,
      email_verified: false,
      app_metadata: {},
      given_name: 'At22',
      family_name: 'Me22',
      name: 'At1 Me222',
      nickname: 'atme222',
      picture:
        'https://s.gravatar.com/avatar/a6b2c1ae87921fab3cec91a9bcb3e2c8?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fat.png',
      user_id: 'auth0|653e222ff16696e16c8861f9',
      connection: 'Username-Password-Authentication',
      password: 'jcC#B!m2_&2-zS4',
      verify_email: false,
    }),
  }

  console.log(newOptions)
  request(newOptions, (err, res, body) => {
    if (err) throw new Error(err)
    console.log(body)
  })
})