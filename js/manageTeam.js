const teamPlayersList = {
  goalkeeper: [
    { position: "goalkeeper", name: "Cássio", score: 4 },
    { position: "goalkeeper", name: "Weverton", score: 4 },
  ],
  wing_back: [
    { position: "left_wing_back", name: "Carlos Augusto", score: 3 },
    { position: "left_wing_back", name: "Lucas Piton", score: 3 },
    { position: "right_wing_back", name: "Fagner", score: 5 },
    { position: "right_wing_back", name: "Marcos Rocha", score: 2 }
  ],
  defensor: [
    { position: "center_back", name: "Gil", score: 4 },
    { position: "center_back", name: "Bruno Méndez", score: 2 },
    { position: "center_back", name: "Felipe Melo", score: 2 },
    { position: "center_back", name: "Emerson Santos", score: 2 },
    { position: "center_back", name: "Pedro Henrique", score: 2 }
  ],
  midfielder: [
    { position: "midfielder", name: "Camacho", score: 3 },
    { position: "midfielder", name: "Lucas Lima", score: 5 },
    { position: "midfielder", name: "Ramires", score: 1 },
    { position: "midfielder", name: "Cantillo", score: 5 },
    { position: "midfielder", name: "Gabriel", score: 2 },
    { position: "midfielder", name: "Ramiro", score: 4 },
    { position: "midfielder", name: "Mateus Vital", score: 3 },
    { position: "midfielder", name: "Luan", score: 5 },
    { position: "midfielder", name: "Patrick de Paula", score: 3 },
  ],
  attackers: [
    { position: "stricker", name: "Mauro Boselli", score: 5 },
    { position: "stricker", name: "Vagner Love", score: 3 },
    { position: "winger", name: "Janderson", score: 2 },
    { position: "winger", name: "Dudu", score: 5 },
    { position: "winger", name: "Wilian Bigode", score: 5 },
    { position: "winger", name: "Pedrinho", score: 5 }
  ]
};

const matchData = {
  homeTeam: {
    player: "",
    team: "",
    gameMode: "normal",
    attackStyle: "mixed",
    players: []
  },
  alwayTeam: {
    player: "",
    team: "",
    gameMode: "normal",
    attackStyle: "mixed",
    players: [
      { goalkeeper: "Cássio" },
      { left_wing_back: "Lucas Piton" },
      { right_wing_back: "Fagner" },
      { center_back: "Pedro Henrique" },
      { center_back: "Gil" },
      { midfielder: "Ramiro" },
      { midfielder: "Cantillo" },
      { midfielder: "Luan" },
      { midfielder: "Camacho" },
      { midfielder: "Mateus Vital" },
      { winger: "Pedrinho" },
    ]
  }
};

function success() {
  const successToast = document.createElement("div");
  successToast.classList.add("toast");
  successToast.classList.add("toast--success");
  successToast.innerHTML =
    "<p><strong>Muito bom!</strong><br>Os dados foram salvos!</p>";
  document.body.append(successToast);

  setTimeout(() => {
    successToast.classList.add("util__hidden");
  }, 2000);
}

class manageTeam {
  constructor(
    tableDOM,
    formationSelect,
    playersListDOM,
    positionSelect,
    teamPlayersList
  ) {
    this.tableDOM = document.getElementById(tableDOM);
    this.playersListDOM = document.getElementById(playersListDOM);
    this.formationElement = document.getElementById(formationSelect);
    this.formation = document.getElementById(formationSelect).value;
    this.positionElement = document.getElementById(positionSelect);
    this.position = document.getElementById(positionSelect).value;
    this.allPlayers = teamPlayersList;
    this.selectedPlayers = [];
  }

  createField() {
    const rows = {
      a: this.createRow(),
      b: this.createRow(),
      c: this.createRow(),
      d: this.createRow(),
      e: this.createRow(),
      f: this.createRow(),
      keeper: this.createRow()
    };

    const formations = {
      "4-3-3": {
        a: [false, false, true, false, false],
        b: [true, false, false, false, true],
        c: [false, false, true, false, false],
        d: [false, true, false, true, false],
        e: [true, false, false, false, true],
        f: [false, true, false, true, false],
        keeper: [false, false, true, false, false]
      },
      "4-1-4-1": {
        a: [false, false, true, false, false],
        b: [false, false, false, false, false],
        c: [true, true, false, true, true],
        d: [false, false, true, false, false],
        e: [true, false, false, false, true],
        f: [false, true, false, true, false],
        keeper: [false, false, true, false, false]
      },
      "4-4-2": {
        a: [false, true, false, true, false],
        b: [false, false, false, false, false],
        c: [false, true, false, true, false],
        d: [false, true, false, true, false],
        e: [true, false, false, false, true],
        f: [false, true, false, true, false],
        keeper: [false, false, true, false, false]
      },
      "3-5-2": {
        a: [false, true, false, true, false],
        b: [false, false, false, false, false],
        c: [false, true, true, true, false],
        d: [true, false, false, false, true],
        e: [false, false, true, false, false],
        f: [false, true, false, true, false],
        keeper: [false, false, true, false, false]
      }
    };
    const rowList = ["a", "b", "c", "d", "e", "f", "keeper"];

    rowList.forEach(rowLetter => {
      formations[this.formation][rowLetter].forEach(element => {
        this.createCell(rows[rowLetter], element);
      });
    });
  }

  createRow() {
    return this.tableDOM.insertRow();
  }

  createCell(row, actionable = false) {
    const cell = row.insertCell();
    if (actionable) {
      cell.classList.add("field__item");
    }
  }

  updatesFormation() {
    this.formationElement.addEventListener("change", () => {
      this.changesFormation();
    });
  }

  changesFormation() {
    matchData.homeTeam.players = [];
    this.formation = this.formationElement.value;
    this.tableDOM.innerHTML = "";
    Array.from(this.playersListDOM.children).forEach(element => {
      element.classList.remove("card--clicked");
      element.classList.add("card--clickable");
    });
    this.createField();
  }

  createPlayerList() {
    this.allPlayers[this.position].forEach(player => {
      this.playersListDOM.innerHTML =
        this.playersListDOM.innerHTML + this.createCard(player);
    });
  }

  createCard(playerStats) {
    const star = "★";
    const positions = {
      goalkeeper: "Goleiro",
      left_wing_back: "Lateral Esquerdo",
      right_wing_back: "Lateral Direito",
      center_back: "Zagueiro",
      midfielder: "Meio Campista",
      stricker: "Centro-Avante",
      winger: "Ponta"
    };
    const playerAlreadyOnTeam = matchData.homeTeam.players.filter(element => {
      return Object.keys(element)[0] === playerStats.name;
    });
    if (playerAlreadyOnTeam.length > 0)
      return `<div class="card card--clicked"><div class="card__flex"><img class="img__icon" src="/img/icons/positions/${
        playerStats.position
      }.svg" /><div><h3>${playerStats.name}</h3><p>Posição: <strong>${
        positions[playerStats.position]
      }</strong></p></div></div><hr /><p class="text--gold-color">${star.repeat(
        playerStats.score
      )}</p></div>`;

    return `<div onClick="createFormation.selectsPlayer('${
      playerStats.name
    }', '${
      playerStats.position
    }')" class="card card--clickable"><div class="card__flex"><img class="img__icon" src="/img/icons/positions/${
      playerStats.position
    }.svg" /><div><h3>${playerStats.name}</h3><p>Posição: <strong>${
      positions[playerStats.position]
    }</strong></p></div></div><hr /><p class="text--gold-color">${star.repeat(
      playerStats.score
    )}</p></div>`;
  }

  updatesPosition() {
    this.positionElement.addEventListener("change", () => {
      this.changesPosition();
    });
  }

  changesPosition() {
    this.position = this.positionElement.value;
    this.playersListDOM.innerHTML = "";
    this.createPlayerList();
  }

  selectsPlayer(name, position) {
    let finalData = new Object();
    finalData[position] = name;

    const maxedPlayersNumbers = matchData.homeTeam.players.length === 11;
    if (maxedPlayersNumbers) return alert("O seu time já está completo");

    const possibleSpots = this.checkPossibleSpots(position);
    if (possibleSpots.length === 0)
      return alert("Você já passou o limite de jogadores para essa posição");

    const playerAlreadyOnTeam = matchData.homeTeam.players.filter(element => {
      return Object.keys(element)[0] === name;
    });
    if (playerAlreadyOnTeam.length > 0)
      return alert("Esse jogador já está no seu time");

    possibleSpots[0].classList.remove("field__item");
    possibleSpots[0].classList.add(`field__item-${position}`);

    this.signsCardAsMarked(name);

    return matchData.homeTeam.players.push(finalData);
  }

  checkPossibleSpots(position) {
    function filter(number) {
      return Array.from(tableRowsList.item(number).children).filter(element => {
        return element.classList.contains("field__item");
      });
    }

    const tableRowsList = document.querySelectorAll("tr");
    const tableRows = {
      a: filter(0),
      b: filter(1),
      c: filter(2),
      d: filter(3),
      e: filter(4),
      f: filter(5),
      keeper: filter(6)
    };

    switch (position) {
      case "goalkeeper":
        return tableRows.keeper;
      case "left_wing_back":
        if (this.formation === "3-5-2") {
          return tableRows.d;
        }
        return tableRows.e;
      case "right_wing_back":
        if (this.formation === "3-5-2") {
          return tableRows.d;
        }
        return tableRows.e;
      case "center_back":
        if (this.formation === "3-5-2") {
          return tableRows.e;
        }
        return tableRows.f;
      case "midfielder":
        if (this.formation === "3-5-2") {
          return tableRows.c;
        }
        return [...tableRows.d, ...tableRows.c];
      case "winger":
        return [...tableRows.a, ...tableRows.b];
      case "stricker":
        return tableRows.a;
      default:
        return [];
    }
  }

  signsCardAsMarked(name) {
    const elementCard = Array.from(this.playersListDOM.children).filter(
      element => element.children[0].children[1].children[0].innerHTML === name
    );
    elementCard[0].classList.remove("card--clickable");
    elementCard[0].classList.add("card--clicked");
  }
}

const createFormation = new manageTeam(
  "playersTable",
  "formation",
  "playersListDOM",
  "position",
  teamPlayersList
);
createFormation.createField();
createFormation.createPlayerList();

createFormation.updatesFormation();
createFormation.updatesPosition();

function saveTeamData() {
  if (matchData.homeTeam.players.length !== 11)
    return alert("O seu time ainda não está completo");

  async function post(url = "", data = {}) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data
    });
    return await response.json();
  }

  document.body.classList.add("loading");

  post(
    "/.netlify/functions/save_pre_match_data",
    JSON.stringify(matchData)
  ).then(data => {
    getsReadyToPlay(data["@ref"].id);
  });

  function getsReadyToPlay(theId) {
    const runButton = document.getElementById("runMatch");
    runButton.removeAttribute("disabled");
    runButton.href = `/match?id=${theId}`;

    document.body.classList.remove("loading");
    success();
  }
}
