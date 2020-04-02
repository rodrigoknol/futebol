const faunadb = require("faunadb");

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);
  console.log('Data recieved: ', data)

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: "fnADnfe6LqACCb_PlAgsLJsY1rnDPykAMFTbLrFs"
  });

  client
    .query(q.Exists(q.Match(q.Index("user_by_id"), data.id)))
    .then(result => {
      nextStep(result);
    });

  function nextStep(result) {
    if (result === true) {
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
      playersList: {
        goalkeeper: [260725846357049865, 261457261895877139],
        wing_back: [
          260726109934453258,
          260726226790908417,
          261457349449875987,
          260726309938790921
        ],
        defensor: [
          260726417883398666,
          261458922600137235,
          260726546521653761,
          261459015648676371,
          260726635126325770
        ],
        midfielder: [
          260726823220937225,
          261457451537138195,
          261457671599686163,
          261457577717531155,
          260726940416082433,
          260727138035958273,
          260727194875068937,
          260727270980715018,
          260727361459192329
        ],
        attackers: [
          260727510151463425,
          261457755959722515,
          260727567122694657,
          260727688536261130,
          261459128035050003,
          260727781041635850
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
