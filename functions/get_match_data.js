const faunadb = require("faunadb");

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: "fnADnfe6LqACCb_PlAgsLJsY1rnDPykAMFTbLrFs"
  });

  return client
    .query(q.Get(q.Ref(q.Collection("preMatchData"), data)))
    .then(response => {
      console.log("success", response);

      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(response)
      });
    });
};
