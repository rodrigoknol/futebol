const faunadb = require("faunadb");

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);
  console.log("Data recieved: ", data);

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: "fnADnfe6LqACCb_PlAgsLJsY1rnDPykAMFTbLrFs",
  });

  function updateInvite(resp) {
    const challangersArray = resp.data.challenging;
    const theData = {
      challenging: [...challangersArray,data.challenging],
    };

    client.query(q.Update(q.Ref(resp.ref), { data: theData })).then(() => {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify("lalala"),
      });
    });
  }

  client
    .query(q.Get(q.Match(q.Index("invite_by_id"), parseFloat(data.invite))))
    .then((resp) => {
      updateInvite(resp);
    });
};
