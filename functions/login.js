const {OAuth2Client} = require('google-auth-library');
const fetch = require("node-fetch");

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);
  console.log('Data recieved: ', data)

  const client_id = '138187903716-udsrq9f59oo6a6g5ehc6hhnfrioaqsfh.apps.googleusercontent.com'
  const client = new OAuth2Client(client_id);

  async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: data.id_token,
        audience: client_id,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
  }

  verify().catch(error => {
    const bodyResponse = {
      status: 'error',
      message: error
    }
    return callback(null, {
      statusCode: 401,
      body: JSON.stringify(bodyResponse)
    });
  });

  async function post(url = "", data = {}) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data
    });
    return await response.json();
  }

  post(
    "http://localhost:34567/.netlify/functions/create_user",
    event.body
  ).then(responseData => {
    theResponse(responseData)
  });

  function theResponse(responseData){
    const bodyResponse = {
      status: 'success',
      message: responseData.status
    }
  
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(bodyResponse)
    });
  }

}