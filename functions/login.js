const {OAuth2Client} = require('google-auth-library');

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);

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

  const bodyResponse = {
    status: 'success',
    message: 'user registered'
  }

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify(bodyResponse)
  });
}