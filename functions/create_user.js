const faunadb = require("faunadb");

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

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

    const goalkeeper = getRandomInt(2) === 1 ? ["260725846357049865", "261990920252031508"] : ["263093140671431170", "261457261895877139"];
    const wing_back = getRandomInt(2) === 1 ? ["261457349449875987", "260726226790908417", "260726109934453258"] : ["261457349449875987", "263093058555347467", "263092828647719424"] ;
    const defensor = getRandomInt(2) === 1 ? ["260726635126325770", "261458922600137235", "260726546521653761"] : ["260726635126325770", "261459015648676371", "260726546521653761", "263093227895128576"];
    const midfielder = getRandomInt(2) === 1 ? ["261991106907996692", "261457671599686163", "261457451537138195", "260727270980715018", "260727138035958273", "260726823220937225"] : ["261991106907996692", "263092921422578176", "261457451537138195", "260727194875068937", "260727138035958273"];
    const attackers = getRandomInt(2) === 1 ? ["261991362693431828", "261991307004609044", "261991254621946388", "260727688536261130", "260727567122694657"] : ["261991171840016916", "261991307004609044", "260727688536261130", "260727567122694657"];

    const playerBase = {
      id: data.id,
      name: data.name,
      email: data.email,
      teamName: "",
      bankAccount: 7.5,
      playersList: {
        "goalkeeper": goalkeeper,
        "wing_back": wing_back,
        "defensor": defensor,
        "midfielder": midfielder,
        "attackers": attackers
      },
      startingTeam: {
        formation: "4-3-3",
        gameMode: "normal",
        attackStyle: "mixed",
        players: []
      },
      matchesHistory: []
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
