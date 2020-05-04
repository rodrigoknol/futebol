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
    let totalPlayers = 0;

    let playerToDelete = {
      where: "",
      playerCode: "",
    };

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

    Object.keys(allPlayersByType).forEach((theKey) => {
      allPlayersByType[theKey].forEach((playerCode) => {
        if (JSON.stringify(player.ref).includes(playerCode)) {
          playerToDelete.where = theKey;
          playerToDelete.playerCode = playerCode;
        }
      });
    });

    Object.keys(allPlayersByType).forEach((theKey) => {
      if (allPlayersByType[type].length <= 2) {
        playerToDelete.playerCode = 0;
        return callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            status: "failed",
            message: "Você tem que ter pelo menos dois jogadores de cada tipo",
          }),
        });
      }

      totalPlayers += allPlayersByType[theKey].length;
    });

    if (totalPlayers.length <= 15) {
      playerToDelete.playerCode = 0;
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          status: "failed",
          message: "Você tem que ter pelo menos 15 jogadores no seu elenco",
        }),
      });
    }

    client.query(q.Get(q.Ref(user.ref))).then((theUser) => {
      if (playerToDelete.playerCode !== 0) {
        let playersList = {};
        playersList[playerToDelete.where] = user.data.playerBase.playersList[
          playerToDelete.where
        ].filter((element) => {
          return element !== playerToDelete.playerCode;
        });

        const baseTeam = theUser.data.playerBase.startingTeam.players;
        const players = baseTeam.filter((element) => {
          const theKey = Object.keys(element)[0];
          return element[theKey] !== player.data.name;
        });

        const data = {
          playerBase: {
            bankAccount: user.data.playerBase.bankAccount.toFixed(1) + player.data.price.toFixed(1),
            playersList,
            startingTeam: {players}
          },
        };

        client.query(q.Update(q.Ref(user.ref), { data })).then((response) => {
          return callback(null, {
            statusCode: 200,
            body: JSON.stringify({ status: "success", message: response.data }),
          });
        });
      }
    });
  }
};
