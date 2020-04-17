const faunadb = require("faunadb");

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);
  console.log("Data recieved: ", data);

  const matches = data;

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: "fnADnfe6LqACCb_PlAgsLJsY1rnDPykAMFTbLrFs"
  });

  let queriesRef = []
  matches.forEach(matchId => {
    queriesRef.push(q.Get(q.Match(q.Index("match_by_id"), matchId)))
  })

  client.query(queriesRef).then(resp =>{ 
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(resp)
    });
   })
}