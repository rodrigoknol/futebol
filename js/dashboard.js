class playersList {
  constructor(domListID, players) {
    this.domList = document.getElementById(domListID);
    this.players = players;
    this.trade = new Commerce();
  }

  createsList(data) {
    if (data) {
      this.players = data;
    }
    const formatedplayers = this.formatData();

    formatedplayers.forEach((player) => {
      this.createplayerRow(player);
    });

    if (Array.from(this.domList.children).length > data.length) {
      this.domList.innerHTML = "";
      formatedplayers.forEach((player) => {
        this.createplayerRow(player);
      });
    }
  }

  formatData() {
    return this.players.map((player) => {
      return {
        position: this.definePosition(player),
        name: `<strong>${player.name}</strong>`,
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
    const theRow = this.domList.insertRow();

    Object.keys(playerData).forEach((element) => {
      const cell = theRow.insertCell();
      cell.innerHTML = playerData[element];
    });

    const commerceCell = theRow.insertCell();
    if (this.players.length > 15) {
      commerceCell.innerHTML = `<a class="btn btn--no-margins">Vender</a>`;
      commerceCell.addEventListener("click", () => {
        this.trade.checkSell(playerData.name);
      });
    } else {
      commerceCell.innerHTML = `<a disabled class="btn btn--no-margins">Elenco enchuto</a>`;
    }
  }
}

class createsDashboard {
  constructor(data) {
    this.data = data;
    this.domElements = {
      players: document.getElementById("totalPlayers"),
      teamValue: document.getElementById("teamValue"),
      bankAccount: document.getElementById("bankAccount"),
    };
    this.results = {
      totalPlayers: 0,
      teamValue: 0,
      bankAccount: data.bankAccount.toFixed(1),
    };
    this.allPlayers = [];
  }

  getData() {
    if (localStorage.getItem("user_players")) {
      this.organize(JSON.parse(localStorage.getItem("user_players")));
    } else {
      getPlayers(this.data.playersList).then((res) => {
        this.organize(res);
      });
    }
  }

  organize(res) {
    localStorage.setItem("user_players", JSON.stringify(res));

    this.allPlayers = [
      ...res.attackers,
      ...res.defensor,
      ...res.goalkeeper,
      ...res.midfielder,
      ...res.wing_back,
    ];

    this.results.totalPlayers = this.allPlayers.length || 0;
    this.results.teamValue =
      this.allPlayers
        .reduce((acc, player) => acc + player.price, 0)
        .toFixed(1) || 0;
    this.printResults();

    const theList = new playersList("playersList", this.allPlayers);
    theList.createsList(this.allPlayers);
  }

  printResults() {
    this.domElements.players.innerText = this.results.totalPlayers;
    this.domElements.teamValue.innerText = this.results.teamValue;
    this.domElements.bankAccount.innerText = this.results.bankAccount;
  }
}

class Commerce {
  constructor() {
    this.playerName = "";
    this.userId = JSON.parse(localStorage.getItem("user")).id;
    this.totalPlayers = document.getElementById("totalPlayers").innerHTML;
  }

  sellPlayer(unformatedPlayerName) {
    this.formatName(unformatedPlayerName);

    if (confirm(`Você tem certeza que quer vender o ${this.playerName}`)) {
      document.body.classList.add("loading");
      this.postSell();
    }
  }

  checkSell(unformatedPlayerName) {
    if (this.totalPlayers <= 15) {
      return alert("Você tem que ter pelo menos 15 jogadores no seu elenco");
    }
    this.sellPlayer(unformatedPlayerName);
  }

  formatName(unformatedPlayerName) {
    const deleteInitial = unformatedPlayerName.replace("<strong>", "");
    this.playerName = deleteInitial.replace("</strong>", "");
  }

  postSell() {
    post(
      "/.netlify/functions/sell_player",
      JSON.stringify({ thePlayer: this.playerName, theUser: this.userId })
    ).then((data) => {
      this.responseWorker(data);
    });
  }

  responseWorker(response) {
    if (response.status === "failed") {
      document.body.classList.remove("loading");
      return alert(response.message);
    }

    localStorage.clear();

    if (response.message.playerBase) {
      localStorage.setItem("user", JSON.stringify(response.message.playerBase));
    }

    success();
    prepare();
  }
}

class lastGames {
  constructor() {
    this.gamesListDom = document.getElementById("lastGames");
    this.matchesArray = [];
    this.cards = [];
  }

  getMatchesData() {
    const userData = JSON.parse(localStorage.getItem("user"));
    const matches = userData.matchesHistory;
    const theLastMatches = matches.slice(-3);
    const lastMatches = theLastMatches.reverse();

    if(lastMatches.length === 0){
      const noMatches = '<div class="card grid"><img style="flex: initial;" alt="imagem representando um jogador de futebol" src="/img/icons/friendly.svg" /><div>' +
      '<h4>Você ainda não jogou nenhuma partida...</h4><hr />'+
      '<p>Primeiro, ajuste agora o <a href="/manage-team">seu time titular</a>.</p>'+
      '<p>Então comece a jogar algumas partidas!</p>' +
      '</div></div>';

      return this.gamesListDom.innerHTML = noMatches;
    }

    post(
      "/.netlify/functions/get_matches",
      JSON.stringify(lastMatches)
    ).then((data) => {
      this.formatMatchesData(data);
    });
  }

  formatMatchesData(data) {
    this.matchesArray = data.map(element => {return element.data});
    this.makeCards()
  }

  makeCards(){
    this.matchesArray.forEach(match => {
      this.createCard(match)
    })

    this.printCards()
  }

  createCard(theMatch){
    const theScore = {
      homeTeam: this.calculateScore('homeTeam', theMatch),
      alwayTeam: this.calculateScore('alwayTeam', theMatch)
    }

    const theCard = '<div class="card text--centered">'+
    '<h4>'+
      '<span class="text--ellipsis">' + theMatch.gameStats.basicData.homeTeam.teamName + '</span><br />'+
      '<span class="text--gold-color">'+ theScore.homeTeam +' x '+ theScore.alwayTeam +'</span><br/>'+
      '<span class="text--ellipsis">' + theMatch.gameStats.basicData.alwayTeam.teamName + '</span>'+
    '</h4>'+
    '<a href="/match?match=' + theMatch.id + '" >Veja como foi</a>'+
    '</div>';

    this.cards.push(theCard)
  }

  calculateScore(team, matchData){
    const theTeam = matchData.theGame.filter( element => element.attackingTeam === team)
    const teamScore = theTeam.reduce((acc,play) => acc + (play.result === "success"), 0)

    return teamScore
  }

  printCards(){
    this.cards.forEach(element => {
      this.gamesListDom.innerHTML = this.gamesListDom.innerHTML + element;
    });
  }
}

document.body.classList.add("loading");

function prepare() {
  const data = JSON.parse(localStorage.getItem("user"));
  document.getElementById("teamName").innerText = data.teamName || "Seu time";
  document.body.classList.remove("loading");

  const theDashboard = new createsDashboard(data);
  theDashboard.getData();

  const lastMatches = new lastGames();
  lastMatches.getMatchesData();
}
