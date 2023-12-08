const request = require('request-promise');
let refresh_token;
let access_token;
const url = 'https://dev-owqdbfl3v34skx34.us.auth0.com';
const client_id = 'knZNLqLRDsvsqEdPMoxCMD5xpeIJrDyj';
const client_secret = 'dMMUZw2KaZljad5p7Wne-Q02ibXXcAS0v6vjYExc1rZGG1v6mfm3SUsSQSiotfx8';
const api = 'https:/test1-dev.com';
const options = {
  method: 'POST',
  url: `${url}/oauth/token/`,
  headers: { 'content-type': 'application:/x-www-form-urlencoded' },
  form: {
    realm: 'Username-Password-Authentication',
    grant_type: 'password',
    username: 'atme@gmail.com',
    password: 'ykp0#$6_2',
    audience: api,
    client_id: client_id,
    client_secret: client_secret,
    scope:"offline_access"
  },
}
create_refresh();

function create_refresh()
{
      request(options, (err, res, body) => {
        if (err) throw new Error(err)
        refresh_token = JSON.parse(body).refresh_token;
        console.log('refresh token : \n' + refresh_token);
      });
}
function refresh()
{
    request(options, (err, res, body) => {
        if (err) throw new Error(err);
        refresh_token = JSON.parse(body).refresh_token;
      }).then(() => {
        request(getRefreshOptions(refresh_token), (err, res, body) => {
          if (err) throw new Error(err);
          refresh_token = JSON.parse(body).refresh_token;
          console.log("access token after refresh : \n" + JSON.parse(body).access_token);
        });
      })
}
function password() {
  const tokenOptions = {
    method: 'POST',
    url: `${url}/oauth/token`,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: {
      client_id: client_id,
      client_secret: client_secret,
      audience: `${url}/api/v2/`,
      grant_type: 'client_credentials',
    },
  }

  request(tokenOptions, (err, res, body) => {
    if (err) throw new Error(err)
    access_token = JSON.parse(body).access_token
  }).then(() => {
    request(getPasswordOptions(access_token), (err, res, body) => {
      
      if (err) throw new Error(err);
      console.log('Password is changed!')
    })
  })
} 

function getRefreshOptions(refresh_token){
    return {
      method: 'POST',
      url: `${url}/oauth/token`,
      headers: { 'content-type': 'application:/x-www-form-urlencoded' },
      form: {
        grant_type: 'refresh_token',
        client_id: client_id,
        client_secret: client_secret,
        refresh_token: refresh_token,
      },
    }
}
function getPasswordOptions(access_token){
    return {
      method: 'PATCH',
      url: `${url}/api/v2/users/auth0|653e1d2ac11396e16c8861f8`,
      headers: {
        'content-type': 'x-www-form-urlencoded',
        Authorization: `Bearer ${access_token}`,
      },
      form: {
        password: 'ykg0#$6_2',
      },
    }
}

