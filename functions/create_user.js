const faunadb = require("faunadb");

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);
  console.log("Data recieved: ", data);

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: "fnADnfe6LqACCb_PlAgsLJsY1rnDPykAMFTbLrFs"
  });

  client
    .query(q.Exists(q.Match(q.Index("user_by_id"), data.id)))
    .then(result => {
      const theResult = result;
      nextStep(theResult);
    });

  function nextStep(result) {
    if (result) {
      const theResponse = {
        status: "user registered"
      };

      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(theResponse)
      });
    } else {
      createPlayer();
    }
  }

  function createPlayer() {
    const theResponse = {
      status: "new user"
    };

    const playerBase = {
      id: data.id,
      name: data.name,
      email: data.email,
      teamName: "",
      bankAccount: 5.5,
      playersList: {
        "goalkeeper": [
          "260725846357049865",
          "261990920252031508"
        ],
        "wing_back": [
          "261457349449875987",
          "260726226790908417",
          "260726109934453258"
        ],
        "defensor": [
          "260726635126325770",
          "261458922600137235",
          "260726546521653761"
        ],
        "midfielder": [
         "261991106907996692",
         "261457671599686163",
         "261457451537138195",
         "260727270980715018",
         "260727138035958273",
         "260726823220937225"
        ],
        "attackers": [
         "261991362693431828",
         "261991307004609044",
         "261991254621946388",
         "260727688536261130",
         "260727567122694657"
        ]
      },
      startingTeam: {
        formation: "4-3-3",
        gameMode: "normal",
        attackStyle: "mixed",
        players: []
      }
    };

    client
      .query(q.Create(q.Collection("users"), { data: { playerBase } }))
      .then(() => {
        return callback(null, {
          statusCode: 200,
          body: JSON.stringify(theResponse)
        });
      });
  }
};
