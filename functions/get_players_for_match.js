const faunadb = require("faunadb");

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: "fnADnfe6LqACCb_PlAgsLJsY1rnDPykAMFTbLrFs"
  });

  const thePlayers = {};

  async function queryTeam(theData, team) {
    const result = await client.query([
      q.Get(
        q.Match(
          q.Index("players_by_name_and_position"),
          theData[0][Object.keys(theData[0])[0]],
          Object.keys(theData[0])[0]
        )
      ),
      q.Get(
        q.Match(
          q.Index("players_by_name_and_position"),
          theData[1][Object.keys(theData[1])[0]],
          Object.keys(theData[1])[0]
        )
      ),
      q.Get(
        q.Match(
          q.Index("players_by_name_and_position"),
          theData[2][Object.keys(theData[2])[0]],
          Object.keys(theData[2])[0]
        )
      ),
      q.Get(
        q.Match(
          q.Index("players_by_name_and_position"),
          theData[3][Object.keys(theData[3])[0]],
          Object.keys(theData[3])[0]
        )
      ),
      q.Get(
        q.Match(
          q.Index("players_by_name_and_position"),
          theData[4][Object.keys(theData[4])[0]],
          Object.keys(theData[4])[0]
        )
      ),
      q.Get(
        q.Match(
          q.Index("players_by_name_and_position"),
          theData[5][Object.keys(theData[5])[0]],
          Object.keys(theData[5])[0]
        )
      ),
      q.Get(
        q.Match(
          q.Index("players_by_name_and_position"),
          theData[6][Object.keys(theData[6])[0]],
          Object.keys(theData[6])[0]
        )
      ),
      q.Get(
        q.Match(
          q.Index("players_by_name_and_position"),
          theData[7][Object.keys(theData[7])[0]],
          Object.keys(theData[7])[0]
        )
      ),
      q.Get(
        q.Match(
          q.Index("players_by_name_and_position"),
          theData[8][Object.keys(theData[8])[0]],
          Object.keys(theData[8])[0]
        )
      ),
      q.Get(
        q.Match(
          q.Index("players_by_name_and_position"),
          theData[9][Object.keys(theData[9])[0]],
          Object.keys(theData[9])[0]
        )
      ),
      q.Get(
        q.Match(
          q.Index("players_by_name_and_position"),
          theData[10][Object.keys(theData[10])[0]],
          Object.keys(theData[10])[0]
        )
      )
    ]);

    return (thePlayers[team] = result.map(element => element.data));
  }

  function createResponse() {
    return JSON.stringify({
      teamData: data,
      thePlayers
    });
  }

  Promise.all([
    queryTeam(data.homeTeam.players, "homeTeam"),
    queryTeam(data.alwayTeam.players, "alwayTeam")
  ]).then(() => {
    callback(null, {
      statusCode: 200,
      body: createResponse()
    });
  });
};
