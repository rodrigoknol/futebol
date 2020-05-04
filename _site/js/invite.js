class invite {
  constructor() {
    (this.host = ""), (this.hostData = {}), (this.challenging = []);
  }

  organize(data) {
    this.formatData(data);
    this.checkIfChallenged();
    this.checkIfSelf();
    this.getHostData();
    this.activateButton();
  }

  formatData(data) {
    this.host = data.host;
    this.challenging = data.challenging;
  }

  checkIfChallenged() {
    if (
      this.challenging.includes(JSON.parse(localStorage.getItem("user")).id)
    ) {
      const theHTML =
        "<h2>Quanta fome de gol, ein?</h2>" +
        "<p>Parece que você já jogou esse desafio... Cada desafio só pode ser jogado uma vez.</p>" +
        "<p>Mas não se preocupe, você sempre pode criar novos desafios e chamar seus amigos!</p>" +
        '<a class="btn" href="/dashboard">Ok, entendi.</a>';

      document.getElementById("content").innerHTML = theHTML;
    }
  }

  checkIfSelf() {
    if (this.host === JSON.parse(localStorage.getItem("user")).id) {
      const theHTML =
        "<h2>Você não pode jogar o seu próprio desafio...</h2>" +
        "<p>Mas envie esse link para os seus amigos, assim eles podem jogar com você:</p>" +
        "<pre>" +
        document.location.href +
        "</pre>" +
        '<a class="btn" href="/dashboard">Ok, entendi.</a>';

      document.getElementById("content").innerHTML = theHTML;
    }
  }

  getHostData() {
    post(
      "/.netlify/functions/get_team_data",
      JSON.stringify({ id: this.host })
    ).then((res) => {
      this.hostData = res.data.playerBase;
      this.printData();
    });
  }

  printData() {
    document.getElementById("homeTeamUser").innerText = this.hostData.name;
    document.getElementById("homeTeamName").innerText = this.hostData.teamName;
    document.getElementById("hostTeamName").innerText = this.hostData.teamName;

    const gamesList = new lastGames();
    gamesList.getMatchesData(this.hostData);
  }

  activateButton() {
    const btn = document.getElementById("playNow");
    btn.addEventListener("click", () => {
      this.playGame();
    });
  }

  playGame() {
    const userData = JSON.parse(localStorage.getItem("user"));
    const alwayTeam = userData.startingTeam;
    const homeTeam = this.hostData.startingTeam;
    const data = { alwayTeam, homeTeam };

    if (alwayTeam.players.length === 11) {
      document.body.classList.add("loading");

      return post(
        "/.netlify/functions/updates_invite",
        JSON.stringify({
          challenging: userData.id,
          invite: document.location.search.split("?")[1],
        })
      ).then(() => {
        post(
          "/.netlify/functions/save_pre_match_data",
          JSON.stringify(data)
        ).then((theResponse) => {
          const theMatchId = theResponse["@ref"].id;
          window.location.replace(`/match?id=${theMatchId}`);
        });
      });
    }

    if (
      confirm("Para jogar, você precisa ter um time titular completo escalado.")
    ) {
      window.location.replace(`/manage-team`);
    }
  }
}

class lastGames {
  constructor() {
    this.gamesListDom = document.getElementById("lastGames");
    this.matchesArray = [];
    this.cards = [];
  }

  getMatchesData(userData) {
    const matches = userData.matchesHistory;
    const theLastMatches = matches.slice(-3);
    const lastMatches = theLastMatches.reverse();

    if (lastMatches.length === 0) {
      const noMatches =
        '<div class="card grid"><img style="flex: initial;" alt="imagem representando um jogador de futebol" src="/img/icons/friendly.svg" /><div>' +
        "<h4>Seu adversário ainda não jogou nenhuma partida...</h4><hr />" +
        "</div></div>";

      return (this.gamesListDom.innerHTML = noMatches);
    }

    post("/.netlify/functions/get_matches", JSON.stringify(lastMatches)).then(
      (data) => {
        this.formatMatchesData(data);
      }
    );
  }

  formatMatchesData(data) {
    this.matchesArray = data.map((element) => {
      return element.data;
    });
    this.makeCards();
  }

  makeCards() {
    this.matchesArray.forEach((match) => {
      this.createCard(match);
    });

    this.printCards();
  }

  createCard(theMatch) {
    const theScore = {
      homeTeam: this.calculateScore("homeTeam", theMatch),
      alwayTeam: this.calculateScore("alwayTeam", theMatch),
    };

    const theCard =
      '<div class="card text--centered">' +
      "<h4>" +
      '<span class="text--ellipsis">' +
      theMatch.gameStats.basicData.homeTeam.teamName +
      "</span><br />" +
      '<span class="text--gold-color">' +
      theScore.homeTeam +
      " x " +
      theScore.alwayTeam +
      "</span><br/>" +
      '<span class="text--ellipsis">' +
      theMatch.gameStats.basicData.alwayTeam.teamName +
      "</span>" +
      "</h4>" +
      '<a href="/match?match=' +
      theMatch.id +
      '" >Veja como foi</a>' +
      "</div>";

    this.cards.push(theCard);
  }

  calculateScore(team, matchData) {
    const theTeam = matchData.theGame.filter(
      (element) => element.attackingTeam === team
    );
    const teamScore = theTeam.reduce(
      (acc, play) => acc + (play.result === "success"),
      0
    );

    return teamScore;
  }

  printCards() {
    this.cards.forEach((element) => {
      this.gamesListDom.innerHTML = this.gamesListDom.innerHTML + element;
    });
  }
}

const theInvite = new invite();

function prepare() {
  const wholeId = document.location.search;
  const idToBeSent = wholeId.split("?")[1];

  post("/.netlify/functions/get_invite", JSON.stringify(idToBeSent)).then(
    (response) => {
      theInvite.organize(response.data);
    }
  );
}
