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
    console.log(result)
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
      playersList: {
        goalkeeper: ["(Collection('players'), 260725846357049865)", "(Collection('players'), 261457261895877139)"],
        wing_back: [
          "(Collection('players'), 260726109934453258)",
          "(Collection('players'), 260726226790908417)",
          "(Collection('players'), 261457349449875987)",
          "(Collection('players'), 260726309938790921)"
        ],
        defensor: [
          "(Collection('players'), 260726417883398666)",
          "(Collection('players'), 261458922600137235)",
          "(Collection('players'), 260726546521653761)",
          "(Collection('players'), 261459015648676371)",
          "(Collection('players'), 260726635126325770)"
        ],
        midfielder: [
          "(Collection('players'), 260726823220937225)",
          "(Collection('players'), 261457451537138195)",
          "(Collection('players'), 261457671599686163)",
          "(Collection('players'), 261457577717531155)",
          "(Collection('players'), 260726940416082433)",
          "(Collection('players'), 260727138035958273)",
          "(Collection('players'), 260727194875068937)",
          "(Collection('players'), 260727270980715018)",
          "(Collection('players'), 260727361459192329)"
        ],
        attackers: [
          "(Collection('players'), 260727510151463425)",
          "(Collection('players'), 261457755959722515)",
          "(Collection('players'), 260727567122694657)",
          "(Collection('players'), 260727688536261130)",
          "(Collection('players'), 261459128035050003)",
          "(Collection('players'), 260727781041635850)"
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
