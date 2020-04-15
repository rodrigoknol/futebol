const fetch = require("node-fetch");
const faunadb = require("faunadb");

exports.handler = (event, context, callback) => {
  const dataReceived = JSON.parse(event.body);
  console.log('Data recieved: ', dataReceived)

  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: "fnADnfe6LqACCb_PlAgsLJsY1rnDPykAMFTbLrFs"
  });

  class theMatch {
    constructor() {
      this.turn = 0;
    }
    matchLogic(data) {
      const basicTeamsStats = {
        homeTeam: {
          player: "",
          team: "",
          pricePoints: this.calculateTeamTotalPrice("homeTeam", data),
          atkPoints: this.calculateAttackPoints("homeTeam", data),
          defPoints: this.calculateDefensePoints("homeTeam", data)
        },
        alwayTeam: {
          player: "",
          team: "",
          pricePoints: this.calculateTeamTotalPrice("alwayTeam", data),
          atkPoints: this.calculateAttackPoints("alwayTeam", data),
          defPoints: this.calculateDefensePoints("alwayTeam", data)
        }
      };

      const gameStats = {
        ballPossession: this.calculatePossession(basicTeamsStats),
        intensity: {
          homeTeam: data.teamData.homeTeam.gameMode,
          alwayTeam: data.teamData.alwayTeam.gameMode
        },
        atkStyle: {
          homeTeam: data.teamData.homeTeam.attackStyle,
          alwayTeam: data.teamData.alwayTeam.attackStyle
        }
      };

      let theGame = [];

      while (this.turn <= 7) {
        switch (this.turn) {
          case 0:
            if (
              gameStats.ballPossession.homeTeam >
              gameStats.ballPossession.alwayTeam
            ) {
              theGame = [
                ...theGame,
                this.getTurn(
                  "homeTeam",
                  "alwayTeam",
                  data,
                  basicTeamsStats,
                  gameStats
                )
              ];
            } else {
              theGame = [
                ...theGame,
                this.getTurn(
                  "alwayTeam",
                  "homeTeam",
                  data,
                  basicTeamsStats,
                  gameStats
                )
              ];
            }
            break;
          case 1:
            if (gameStats.intensity.homeTeam !== "all-atk") {
              theGame = [
                ...theGame,
                this.getTurn(
                  "alwayTeam",
                  "homeTeam",
                  data,
                  basicTeamsStats,
                  gameStats
                )
              ];
            } else {
              theGame = [
                ...theGame,
                this.getTurn(
                  "homeTeam",
                  "alwayTeam",
                  data,
                  basicTeamsStats,
                  gameStats
                )
              ];
            }
            break;
          case 2:
            if (gameStats.intensity.alwayTeam !== "all-atk") {
              theGame = [
                ...theGame,
                this.getTurn(
                  "homeTeam",
                  "alwayTeam",
                  data,
                  basicTeamsStats,
                  gameStats
                )
              ];
            } else {
              theGame = [
                ...theGame,
                this.getTurn(
                  "alwayTeam",
                  "homeTeam",
                  data,
                  basicTeamsStats,
                  gameStats
                )
              ];
            }
            break;
          case 3:
            theGame = [
              ...theGame,
              this.getTurn(
                "homeTeam",
                "alwayTeam",
                data,
                basicTeamsStats,
                gameStats
              )
            ];
            break;
          case 4:
            theGame = [
              ...theGame,
              this.getTurn(
                "alwayTeam",
                "homeTeam",
                data,
                basicTeamsStats,
                gameStats
              )
            ];
            break;
          case 5:
            if (
              basicTeamsStats.homeTeam.pricePoints >
              basicTeamsStats.alwayTeam.pricePoints
            ) {
              theGame = [
                ...theGame,
                this.getTurn(
                  "homeTeam",
                  "alwayTeam",
                  data,
                  basicTeamsStats,
                  gameStats
                )
              ];
            } else {
              theGame = [
                ...theGame,
                this.getTurn(
                  "alwayTeam",
                  "homeTeam",
                  data,
                  basicTeamsStats,
                  gameStats
                )
              ];
            }
            break;
          case 6:
            if (
              basicTeamsStats.homeTeam.pricePoints >
              basicTeamsStats.alwayTeam.pricePoints
            ) {
              theGame = [
                ...theGame,
                this.getTurn(
                  "homeTeam",
                  "alwayTeam",
                  data,
                  basicTeamsStats,
                  gameStats
                )
              ];
            } else {
              theGame = [
                ...theGame,
                this.getTurn(
                  "alwayTeam",
                  "homeTeam",
                  data,
                  basicTeamsStats,
                  gameStats
                )
              ];
            }
            break;
          case 7:
            if (
              gameStats.ballPossession.homeTeam >
              gameStats.ballPossession.alwayTeam
            ) {
              theGame = [
                ...theGame,
                this.getTurn(
                  "homeTeam",
                  "alwayTeam",
                  data,
                  basicTeamsStats,
                  gameStats
                )
              ];
            } else {
              theGame = [
                ...theGame,
                this.getTurn(
                  "alwayTeam",
                  "homeTeam",
                  data,
                  basicTeamsStats,
                  gameStats
                )
              ];
            }
            break;
          default:
            theGame = [
              ...theGame,
              this.getTurn(
                "homeTeam",
                "alwayTeam",
                data,
                basicTeamsStats,
                gameStats
              )
            ];
            break;
        }

        this.turn++;
      }

      const theMatchId = dataReceived.id;

      const finalData = {
        gameStats,
        theGame,
        id: theMatchId
      };

      client.query(q.Create(q.Collection("matchData"), {data: finalData} )).then(
        ()=>{
          return callback(null, {
            statusCode: 200,
            body: JSON.stringify(finalData)
          });
        }
      )
    }

    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    getTurn(attackTeam, defenseTeam, data, basicTeamsStats, gameStats) {
      const atk = data.thePlayers[attackTeam];
      const def = data.thePlayers[defenseTeam];

      if (
        basicTeamsStats[attackTeam].atkPoints >
        basicTeamsStats[defenseTeam].defPoints
      ) {
        return this.attackStyle(atk, def, gameStats, attackTeam);
      }

      if (this.getRandomInt(2) === 1) {
        return this.attackStyle(atk, def, gameStats, attackTeam);
      }

      return {
        attackingTeam: attackTeam,
        result: "failed"
      };
    }

    attackStyle(atk, def, gameStats, attackTeam) {
      const possibilities = {
        mixed: ["wing", "attack", "middle", "corner", "wing", "middle"],
        lateral: [
          "wing",
          "wing",
          "attack",
          "corner",
          "wing",
          "middle",
          "wing",
          "wing"
        ],
        middle: [
          "wing",
          "attack",
          "middle",
          "corner",
          "middle",
          "middle",
          "middle",
          "middle"
        ]
      };

      switch (gameStats.atkStyle[attackTeam]) {
        case "mixed":
          return this.attackCreation(
            atk,
            def,
            possibilities.mixed[this.getRandomInt(possibilities.mixed.length)],
            attackTeam
          );
        case "lateral":
          return this.attackCreation(
            atk,
            def,
            possibilities.lateral[
              this.getRandomInt(possibilities.lateral.length)
            ],
            attackTeam
          );
        case "middle":
          return this.attackCreation(
            atk,
            def,
            possibilities.middle[
              this.getRandomInt(possibilities.middle.length)
            ],
            attackTeam
          );
        default:
          return {
            attackingTeam: attackTeam,
            result: "failed",
            info: {
              lastStep: "attack_didnt_happen"
            }
          };
      }
    }

    attackCreation(team, defTeam, area, attackTeam) {
      const player = this.playerSelection(team, area);
      const stealer = this.playerSelection(defTeam, "most");
      let attackSuccessRatio = 0;

      switch (player.stats.mental.vision) {
        case 3:
          attackSuccessRatio = 0.6;
          break;
        case 2:
          attackSuccessRatio = 0.5;
          break;
        default:
          attackSuccessRatio = 0.4;
          break;
      }

      switch (player.stats.attack.dribbling) {
        case 3:
          attackSuccessRatio = attackSuccessRatio + 0.2;
          break;
        case 2:
          attackSuccessRatio = attackSuccessRatio + 0.1;
          break;
        default:
          null;
          break;
      }

      if (area === "wing" || area === "corner") {
        switch (player.stats.base.crossing) {
          case 3:
            attackSuccessRatio = attackSuccessRatio + 0.25;
            break;
          case 1:
            attackSuccessRatio = attackSuccessRatio - 0.1;
            break;
          default:
            attackSuccessRatio = attackSuccessRatio + 0.15;
            break;
        }
      } else {
        switch (player.stats.base.pass) {
          case 3:
            attackSuccessRatio = attackSuccessRatio + 0.25;
            break;
          case 1:
            attackSuccessRatio = attackSuccessRatio - 0.1;
            break;
          default:
            attackSuccessRatio = attackSuccessRatio + 0.15;
            break;
        }
      }

      switch (stealer.stats.defense.marking) {
        case 3:
          attackSuccessRatio = attackSuccessRatio - 0.25;
          break;
        case 2:
          attackSuccessRatio = attackSuccessRatio - 0.15;
          break;
        default:
          attackSuccessRatio = attackSuccessRatio - 0.05;
          break;
      }

      if (attackSuccessRatio * 100 >= this.getRandomInt(100)) {
        const keeper = this.playerSelection(defTeam, "keeper");
        const defensor = this.playerSelection(defTeam, "defense");
        let defenseSuccessRatio = 0;

        switch (defensor.stats.defense.interceptions) {
          case 3:
            defenseSuccessRatio = defenseSuccessRatio + 0.3;
            break;
          case 2:
            defenseSuccessRatio = defenseSuccessRatio + 0.2;
            break;
          default:
            defenseSuccessRatio = defenseSuccessRatio + 0.1;
            break;
        }

        if (defenseSuccessRatio * 100 >= this.getRandomInt(100)) {
          return {
            attackingTeam: attackTeam,
            result: "failed",
            info: {
              lastStep: "defensor",
              player: player.name,
              defensor: defensor.name,
              area
            }
          };
        }

        return this.finishesTurn(
          player,
          defensor,
          attackTeam,
          team,
          keeper,
          area
        );
      }

      return {
        attackingTeam: attackTeam,
        result: "failed",
        info: {
          lastStep: "startedAtk",
          player: player.name,
          stealer: stealer.name,
          area
        }
      };
    }

    finishesTurn(player, defensor, attackTeam, team, keeper, area) {
      const options = [
        "midfielder",
        "wing",
        "self",
        "attack",
        "attack",
        "midfielder",
        "attack"
      ];
      const selected = options[this.getRandomInt(options.length)];
      let finisher = player;
      let goalSuccessRate = 0;

      if (area === "corner") {
        finisher = this.playerSelection(team, "most");
      }

      if (selected !== "self") {
        finisher = this.playerSelection(team, selected);
      }

      switch (finisher.stats.attack.finishing) {
        case 3:
          goalSuccessRate = goalSuccessRate + 1;
          break;
        case 2:
          goalSuccessRate = goalSuccessRate + 0.66;
          break;
        default:
          goalSuccessRate = goalSuccessRate + 0.33;
          break;
      }

      switch (keeper.stats.goalkeeping.positioning) {
        case 3:
          goalSuccessRate = goalSuccessRate - 0.3;
          break;
        case 2:
          goalSuccessRate = goalSuccessRate - 0.15;
          break;
        default:
          break;
      }

      switch (keeper.stats.goalkeeping.reflexes) {
        case 3:
          goalSuccessRate = goalSuccessRate - 0.3;
          break;
        case 2:
          goalSuccessRate = goalSuccessRate - 0.15;
          break;
        default:
          break;
      }

      if (goalSuccessRate * 100 >= this.getRandomInt(100)) {
        return {
          attackingTeam: attackTeam,
          result: "success",
          info: {
            lastStep: "goal",
            kicker: finisher.name,
            player: player.name,
            defensor: defensor.name,
            keeper: keeper.name,
            area
          }
        };
      }

      return {
        attackingTeam: attackTeam,
        result: "failed",
        info: {
          lastStep: "kick",
          kicker: finisher.name,
          keeper: keeper.name,
          area
        }
      };
    }

    playerSelection(team, area) {
      let thePlayers = [];

      switch (area) {
        case "wing":
          thePlayers = [
            ...thePlayers,
            ...team.filter(players => players.position === "left_wing_back")
          ];
          thePlayers = [
            ...thePlayers,
            ...team.filter(players => players.position === "right_wing_back")
          ];
          thePlayers = [
            ...thePlayers,
            ...team.filter(players => players.position === "winger")
          ];
          return thePlayers[this.getRandomInt(thePlayers.length)];
        case "attack":
          thePlayers = [
            ...thePlayers,
            ...team.filter(players => players.position === "stricker")
          ];
          thePlayers = [
            ...thePlayers,
            ...team.filter(players => players.position === "winger")
          ];
          return thePlayers[this.getRandomInt(thePlayers.length)];
        case "defense":
          thePlayers = [
            ...thePlayers,
            ...team.filter(players => players.position === "left_wing_back")
          ];
          thePlayers = [
            ...thePlayers,
            ...team.filter(players => players.position === "right_wing_back")
          ];
          thePlayers = [
            ...thePlayers,
            ...team.filter(players => players.position === "center_back")
          ];
          thePlayers = [
            ...thePlayers,
            ...team.filter(players => players.position === "center_back")
          ];
          return thePlayers[this.getRandomInt(thePlayers.length)];
        case "most":
          thePlayers = [
            ...thePlayers,
            ...team.filter(players => players.position === "left_wing_back")
          ];
          thePlayers = [
            ...thePlayers,
            ...team.filter(players => players.position === "right_wing_back")
          ];
          thePlayers = [
            ...thePlayers,
            ...team.filter(players => players.position === "center_back")
          ];
          thePlayers = [
            ...thePlayers,
            ...team.filter(players => players.position === "winger")
          ];
          thePlayers = [
            ...thePlayers,
            ...team.filter(players => players.position === "midfielder")
          ];
          return thePlayers[this.getRandomInt(thePlayers.length)];
        case "keeper":
          thePlayers = [
            ...team.filter(players => players.position === "goalkeeper")
          ];
          return thePlayers[0];
        default:
          thePlayers = [
            ...thePlayers,
            ...team.filter(players => players.position === "midfielder")
          ];
          return thePlayers[this.getRandomInt(thePlayers.length)];
      }
    }

    calculatePossession(basicTeamsStats) {
      const homeTeamPoints = basicTeamsStats.homeTeam;
      const alwayTeamPoints = basicTeamsStats.alwayTeam;
      const random = Math.random() * (40 - 20) - 10;
      let homeTeam = 0;
      let alwayTeam = 0;

      homeTeamPoints.pricePoints >= alwayTeamPoints.pricePoints ? homeTeam++ : alwayTeam++;

      if(homeTeamPoints.defPoints >= alwayTeamPoints.atkPoints) homeTeam++;

      if(alwayTeamPoints.defPoints >= homeTeamPoints.atkPoints) alwayTeam++;

      homeTeamPoints.defPoints >= alwayTeamPoints.defPoints ? homeTeam++ : alwayTeam++;

      homeTeamPoints.atkPoints >= alwayTeamPoints.atkPoints ? homeTeam++ : alwayTeam++;

      homeTeamPoints.pricePoints +
        homeTeamPoints.defPoints +
        homeTeamPoints.atkPoints >=
      alwayTeamPoints.pricePoints +
        alwayTeamPoints.defPoints +
        alwayTeamPoints.atkPoints
        ? homeTeam++
        : alwayTeam++;

      return {
        homeTeam: ((homeTeam + 7) * 100) / 18 + random,
        alwayTeam: ((alwayTeam  + 7) * 100) / 18 - random
      };
    }

    calculateTeamTotalPrice(theTeam, data) {
      return data.thePlayers[theTeam].reduce(
        (acc, player) => acc + player.price,
        0
      );
    }

    calculateDefensePoints(theTeam, data) {
      const defenseTeamGroups = {
        left_wing_back: data.thePlayers[theTeam].filter(
          players => players.position === "left_wing_back"
        ),
        right_wing_back: data.thePlayers[theTeam].filter(
          players => players.position === "right_wing_back"
        ),
        center_back: data.thePlayers[theTeam].filter(
          players => players.position === "center_back"
        ),
        midfielder: data.thePlayers[theTeam].filter(
          players => players.position === "midfielder"
        )
      };

      const defenseTeam = [
        ...defenseTeamGroups.left_wing_back,
        ...defenseTeamGroups.right_wing_back,
        ...defenseTeamGroups.center_back,
        ...defenseTeamGroups.midfielder
      ];

      const points = {
        stamina: defenseTeam.reduce(
          (acc, player) => acc + player.stats.base.stamina,
          0
        ),
        marking: defenseTeam.reduce(
          (acc, player) => acc + player.stats.defense.marking,
          0
        ),
        interceptions: defenseTeam.reduce(
          (acc, player) => acc + player.stats.defense.interceptions,
          0
        ),
        pass: defenseTeam.reduce(
          (acc, player) => acc + player.stats.base.pass,
          0
        )
      };
      switch (data.teamData[theTeam].gameMode) {
        case "normal":
          return (
            points.stamina +
            (points.marking + points.interceptions) * 2.5 +
            points.pass
          );
        case "counter-atk":
          return (
            points.stamina * 0.75 +
            (points.marking + points.interceptions) * 2.25 +
            points.pass * 1.5
          );
        case "all-atk":
          return (
            points.stamina * 0.75 +
            (points.marking + points.interceptions) * 1.75 +
            points.pass
          );
        case "all-def":
          return (
            points.stamina * 1.25 +
            (points.marking + points.interceptions) * 3 +
            points.pass * 1.25
          );
        default:
          return (
            points.stamina +
            (points.marking + points.interceptions) * 2.5 +
            points.pass
          );
      }
    }

    calculateAttackPoints(theTeam, data) {
      const attackTeamGroups = {
        left_wing_back: data.thePlayers[theTeam].filter(
          players => players.position === "left_wing_back"
        ),
        right_wing_back: data.thePlayers[theTeam].filter(
          players => players.position === "right_wing_back"
        ),
        midfielder: data.thePlayers[theTeam].filter(
          players => players.position === "midfielder"
        ),
        winger: data.thePlayers[theTeam].filter(
          players => players.position === "winger"
        ),
        stricker: data.thePlayers[theTeam].filter(
          players => players.position === "stricker"
        )
      };

      const attackTeam = [
        ...attackTeamGroups.left_wing_back,
        ...attackTeamGroups.right_wing_back,
        ...attackTeamGroups.midfielder,
        ...attackTeamGroups.winger,
        ...attackTeamGroups.stricker
      ];

      const points = {
        agility: attackTeam.reduce(
          (acc, player) => acc + player.stats.base.stamina,
          0
        ),
        pass: attackTeam.reduce(
          (acc, player) => acc + player.stats.base.pass,
          0
        ),
        crossing: attackTeam.reduce(
          (acc, player) => acc + player.stats.base.crossing,
          0
        ),
        finishing: attackTeam.reduce(
          (acc, player) => acc + player.stats.attack.finishing,
          0
        ),
        dribbling: attackTeam.reduce(
          (acc, player) => acc + player.stats.attack.dribbling,
          0
        ),
        vision: attackTeam.reduce(
          (acc, player) => acc + player.stats.mental.vision,
          0
        )
      };

      switch (data.teamData[theTeam].gameMode) {
        case "normal":
          return (
            points.agility +
            (points.pass + points.crossing) * 0.5 +
            (points.finishing + points.dribbling + points.vision) * 2
          );
        case "counter-atk":
          return (
            points.agility * 1.25 +
            (points.pass + points.crossing) * 0.75 +
            (points.finishing + points.dribbling + points.vision) * 1.75
          );
        case "all-atk":
          return (
            points.agility +
            (points.pass + points.crossing) +
            (points.finishing + points.dribbling + points.vision) * 2.5
          );
        case "all-def":
          return (
            points.agility +
            (points.pass + points.crossing) * 0.25 +
            (points.finishing + points.dribbling + points.vision) * 1.5
          );
        default:
          return (
            points.agility +
            (points.pass + points.crossing) * 0.5 +
            (points.finishing + points.dribbling + points.vision) * 2
          );
      }
    }
  }

  const theGame = new theMatch();

  async function post(url = "", data = {}) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data
    });
    return await response.json();
  }

  client
    .query(q.Exists(q.Match(q.Index("match_by_id"), dataReceived.id)))
    .then((response) => {
      if(response === true){
        client.query(q.Get(q.Match(q.Index("match_by_id"), dataReceived.id)))
          .then(
            theResult => {
              return callback(null, {
                statusCode: 200,
                body: JSON.stringify(theResult.data)
              });
            }
          )
      } else {
        post(
          "https://123gol.com.br/.netlify/functions/get_players_for_match",
          event.body
        ).then(data => {
          theGame.matchLogic(data);
        });
      }
    });
};
