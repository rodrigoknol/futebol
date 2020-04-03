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

  client.query(queriesRef).then(resp =>{ organizeResponse(resp) })

  function organizeResponse(resp){
    const thePlayers = resp.map(e => e.data)

    const finalData = {
      goalkeeper: thePlayers.filter(player => {return player.position === 'goalkeeper'}),
      wing_back: thePlayers.filter(player => {return player.position === 'left_wing_back' || player.position === 'right_wing_back' }),
      defensor: thePlayers.filter(player => {return player.position === 'center_back'}),
      midfielder: thePlayers.filter(player => {return player.position === 'midfielder'}),
      attackers: thePlayers.filter(player => {return player.position === 'stricker' || player.position === 'winger'}),
    }

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(finalData)
    });

  }
};
