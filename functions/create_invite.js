const faunadb = require("faunadb");

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);
  console.log("Data recieved: ", data);

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: "fnADnfe6LqACCb_PlAgsLJsY1rnDPykAMFTbLrFs",
  });

  const theInvite = {
    id: Math.floor(Math.random() * Date.now()),
    host: data.theUser,
    challenging: [],
  };

  client
    .query(q.Create(q.Collection("invites"), { data: theInvite }))
    .then(() => {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(theInvite.id),
      });
    });
};
