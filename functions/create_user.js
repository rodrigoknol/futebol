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

    const goalkeeper = getRandomInt(2) === 1 ? ["260725846357049865", "261990920252031508"] : ["261457261895877139", "263093140671431170"];
    const wing_back = getRandomInt(2) === 1 ? ["264451700896563732", "260726226790908417", "264452021057225236", "263092828647719424"] : ["260726226790908417", "264450154596139539", "261457349449875987", "260726109934453258"] ;
    const defensor = getRandomInt(2) === 1 ? ["261458922600137235", "263093227895128576", "263093278937711106", "260726417883398666"] : ["260726635126325770", "261459015648676371", "260726546521653761", "261991424979894804"];
    const midfielder = getRandomInt(2) === 1 ? ["261457671599686163", "260727138035958273", "264450234775503379", "264451936324944404", "264452095996854804" ] : ["261991106907996692", "260727270980715018", "264451778814149140", "260727361459192329", "260727194875068937"];
    const attackers = getRandomInt(2) === 1 ? ["260727688536261130", "264449836925846035", "261991171840016916", "264450088729838099"] : ["261991254621946388", "264449964419056147", "264452183734354452", "260727510151463425"];

    const playerBase = {
      id: data.id,
      name: data.name,
      email: data.email,
      teamName: "",
      bankAccount: 8,
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
