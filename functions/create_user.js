const faunadb = require("faunadb");

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: "fnADnfe6LqACCb_PlAgsLJsY1rnDPykAMFTbLrFs"
  });

  console.log('Create user recieved data: ',data)

  const theResponse = {
    status: "user registered"
  }

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify(theResponse)
  });
}