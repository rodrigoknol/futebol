const faunadb = require("faunadb");

exports.handler = (event, context, callback) => {
  let data = JSON.parse(event.body);
  console.log('Data recieved: ', data)
  data.id = Math.floor(Math.random() * Date.now());

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: "fnADnfe6LqACCb_PlAgsLJsY1rnDPykAMFTbLrFs"
  });

  client
    .query(q.Create(q.Collection("preMatchData"), { data }))
    .then(response => {
      const preMatch = response;
      console.log("success", preMatch);

      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(preMatch.ref)
      });
    });
};
