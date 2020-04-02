const faunadb = require("faunadb");

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);
  console.log("Data recieved: ", data);

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: "fnADnfe6LqACCb_PlAgsLJsY1rnDPykAMFTbLrFs"
  });

  let players = [];

  const theKeys = Object.keys(data)
  theKeys.forEach(key => {
    data[key].forEach(player => {
      players.push(player)
    })
  })

  let queriesRef = []
  players.forEach(playerRef => {
    queriesRef.push(q.Get(q.Ref(q.Collection('players'), playerRef)))
  })

  client.query(queriesRef).then(resp =>{ console.log(resp) })

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({response: 'success'})
  });
};
