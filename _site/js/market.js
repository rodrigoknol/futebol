let user = JSON.parse(localStorage.getItem("user"));
let userPlayers = JSON.parse(localStorage.getItem("user_players"));

function playerBalance() {
  const balance = document.getElementById("bankAccount");
  const bankAccount = user.bankAccount.toFixed(1);

  balance.innerHTML = `${bankAccount} milhões`;
}

class playersTable {
  constructor(domElement) {
    this.tableDOM = document.getElementById(domElement);
    this.allPlayers = JSON.parse(localStorage.getItem("all_players"));
    this.selectedPosition = document.getElementById("position").value;
    this.selectedScore = document.getElementById("score").value;
    this.filterUsed = 0;
  }

  createList() {
    this.tableDOM.innerHTML = "";

    const formatedplayers = this.formatData();
    const sortedPlayers = formatedplayers.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    const playersByPosition = this.selectPlayersByPosition(sortedPlayers);
    const playersByScore = this.selectPlayersByScore(playersByPosition);

    if (!localStorage.getItem("user")) {
      post(
        "/.netlify/functions/get_team_data",
        JSON.stringify({ id: getLoginData("id") })
      ).then((theResponse) => {
        localStorage.setItem(
          "user",
          JSON.stringify(theResponse.data.playerBase)
        );
        prepare();
      });
    }

    playersByScore.forEach((player) => {
      this.createplayerRow(player);
    });

    if (this.filterUsed === 0) {
      this.filtersEventListener();
    }

    document.body.classList.remove("loading");
  }

  selectPlayersByScore(players) {
    let filteredPlayers = [];
    players.forEach((player) => {
      if (this.selectedScore === "all") {
        filteredPlayers.push(player);
      }
      if (player.score.match(/★/g).length === parseInt(this.selectedScore)) {
        filteredPlayers.push(player);
      }
    });

    return filteredPlayers;
  }

  selectPlayersByPosition(players) {
    let positions = [];
    switch (this.selectedPosition) {
      case "goalkeeper":
        positions = ["Goleiro"];
        break;
      case "wing_back":
        positions = ["Lateral Esquerdo", "Lateral Direito"];
        break;
      case "defensor":
        positions = ["Zagueiro"];
        break;
      case "midfielder":
        positions = ["Meio Campista"];
        break;
      case "attackers":
        positions = ["Ponta", "Centro-avante"];
        break;
      default:
        positions = ["Goleiro"];
        break;
    }

    return players.filter((player) => positions.includes(player.position));
  }

  filtersEventListener() {
    const position = document.getElementById("position");
    const score = document.getElementById("score");

    position.addEventListener(
      "change",
      (e) => {
        this.changeData(e, "selectedPosition");
      },
      true
    );
    score.addEventListener(
      "change",
      (e) => {
        this.changeData(e, "selectedScore");
      },
      true
    );

    this.filterUsed++;
  }

  changeData(e, type) {
    this[type] = e.target.value;
    this.createList();
  }

  formatData() {
    return this.allPlayers.map((player) => {
      return {
        position: this.definePosition(player),
        name: `<strong>${player.name}</strong>`,
        team: player.team,
        score: this.createStar(player.score),
        price: `${player.price.toFixed(1)} milhões`,
      };
    });
  }

  createStar(score) {
    const star = "★";
    return `<span class="text--gold-color">${star.repeat(score)}</span>`;
  }

  definePosition(player) {
    switch (player.position) {
      case "stricker":
        return "Centro-avante";
      case "winger":
        return "Ponta";
      case "center_back":
        return "Zagueiro";
      case "goalkeeper":
        return "Goleiro";
      case "midfielder":
        return "Meio Campista";
      case "left_wing_back":
        return "Lateral Esquerdo";
      case "right_wing_back":
        return "Lateral Direito";
      default:
        return "???";
    }
  }

  createplayerRow(playerData) {
    const theRow = this.tableDOM.insertRow();

    Object.keys(playerData).forEach((element) => {
      const cell = theRow.insertCell();
      cell.innerHTML = playerData[element];
    });

    const commerceCell = theRow.insertCell();

    let theButton = `<a class="btn btn--no-margins" onclick="buyPlayer('${this.formatName(
      playerData.name
    )}')" >Comprar</a>`;

    if (
      parseFloat(user.bankAccount.toFixed(1)) < parseFloat(playerData.price)
    ) {
      theButton = '<a disabled class="btn btn--no-margins">Sem $$$</a>';
    }

    Object.keys(userPlayers).forEach((playerType) => {
      userPlayers[playerType].forEach((player) => {
        if (playerData.name.includes(player.name)) {
          theButton = '<a disabled class="btn btn--no-margins">No time</a>';
        }
      });
    });

    commerceCell.innerHTML = theButton;
  }

  formatName(unformatedPlayerName) {
    const deleteInitial = unformatedPlayerName.replace("<strong>", "");
    const playerName = deleteInitial.replace("</strong>", "");
    return playerName;
  }
}

function buyPlayer(player) {
  document.body.classList.add("loading");
  post(
    "/.netlify/functions/buy_player",
    JSON.stringify({ thePlayer: player, theUser: user.id })
  ).then((response) => updateData(response));
}

function updateData(user) {
  localStorage.clear();

  localStorage.setItem("user", JSON.stringify(user.message.playerBase));

  post(
    "/.netlify/functions/get_players_data",
    JSON.stringify(user.message.playerBase.playersList)
  ).then((result) => {
    updateTeamData(result);
  });
}

function updateTeamData(players) {
  localStorage.setItem("user_players", JSON.stringify(players));
  document.body.classList.remove("loading");
  user = JSON.parse(localStorage.getItem("user"));
  userPlayers = JSON.parse(localStorage.getItem("user_players"));
  prepare();
}

function prepare() {
  document.body.classList.add("loading");
  if (!localStorage.getItem("all_players")) {
    post(
      "/.netlify/functions/get_all_players",
      JSON.stringify({ data: "allPlayers" })
    ).then((response) => {
      const formatedData = response.data.map((element) => element.data);
      localStorage.setItem("all_players", JSON.stringify(formatedData));
      const table = new playersTable("playersList");
      table.createList();
    });
  } else {
    const table = new playersTable("playersList");
    table.createList();
  }

  playerBalance();
}
