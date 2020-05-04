const faunadb = require("faunadb");

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);
  console.log("Data recieved: ", data);

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: "fnADnfe6LqACCb_PlAgsLJsY1rnDPykAMFTbLrFs",
  });

  client
    .query(q.Get(q.Match(q.Index("players_by_name"), data.thePlayer)))
    .then((response) => {
      getUserData(response);
    });

  function getUserData(player) {
    client
      .query(q.Get(q.Match(q.Index("user_by_id"), data.theUser)))
      .then((response) => {
        checkUserPlayers(player, response);
      });
  }

  function checkUserPlayers(player, user) {
    const allPlayersByType = user.data.playerBase.playersList;

    let type = "midfielder";

    switch (player.data.position) {
      case "center_back":
        type = "defensor";
        break;
      case "right_wing_back":
        type = "wing_back";
        break;
      case "left_wing_back":
        type = "wing_back";
        break;
      case "goalkeeper":
        type = "goalkeeper";
        break;
      case "winger":
        type = "attackers";
        break;
      case "stricker":
        type = "attackers";
      default:
        type = "midfielder";
        break;
    }

    let playerToAdd = {
      where: type,
      playerCode: player.ref,
    };

    Object.keys(allPlayersByType).forEach((theKey) => {
      allPlayersByType[theKey].forEach((playerCode) => {
        if (JSON.stringify(player.ref).includes(playerCode)) {
          return callback(null, {
            statusCode: 200,
            body: JSON.stringify({
              status: "failed",
              message: "Você já tem esse jogador em seu time",
            }),
          });
        }
      });
    });

    if (user.data.playerBase.bankAccount - player.data.price < 0) {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          status: "failed",
          message: "Você não tem dinheiro para continuar",
        }),
      });
    }

    let playersList = {};
    const originalArray = user.data.playerBase.playersList[playerToAdd.where];
    const newPlayer = JSON.stringify(playerToAdd.playerCode).match(/\d+/)[0];
    const newArray = [...originalArray, newPlayer];
    playersList[playerToAdd.where] = newArray;

    const data = {
      playerBase: {
        bankAccount: user.data.playerBase.bankAccount.toFixed(1) - player.data.price.toFixed(1),
        playersList,
      },
    };

    client.query(q.Update(q.Ref(user.ref), { data })).then((response) => {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({ status: "success", message: response.data }),
      });
    });
  }
};
