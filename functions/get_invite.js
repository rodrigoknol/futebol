const faunadb = require("faunadb");

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);
  console.log("Data recieved: ", data);

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: "fnADnfe6LqACCb_PlAgsLJsY1rnDPykAMFTbLrFs",
  });

  client.query(q.Get(q.Match(q.Index("invite_by_id"), parseFloat(data)))).then((resp) => {
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(resp),
    });
  });
};
