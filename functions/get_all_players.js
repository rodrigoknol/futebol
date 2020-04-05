const faunadb = require("faunadb");

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);
  console.log('Data recieved: ', data)

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: "fnADnfe6LqACCb_PlAgsLJsY1rnDPykAMFTbLrFs"
  });

  return client
    .query(q.Map(q.Paginate(q.Match(q.Index("all_players"))), q.Lambda("x", q.Get(q.Var("x")))))
    .then(response => {
      console.log("success", response);

      
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(response)
      });
    });
};
