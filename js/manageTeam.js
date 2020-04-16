let playerTeam = {};

function prepare() {
  formatData(JSON.parse(localStorage.getItem("user")));
  document.getElementById("teamName").innerText = playerTeam.team || "seu time";
}

function formatData(data) {
  playerTeam = {
    ...data.startingTeam,
    player: data.id,
    team: data.teamName,
  };

  document.getElementById("formation").value = playerTeam.formation;

  if (localStorage.getItem("user_players")) {
    createPage(JSON.parse(localStorage.getItem("user_players")));
  } else {
    post(
      "/.netlify/functions/get_players_data",
      JSON.stringify(data.playersList)
    ).then((theResponse) => {
      createPage(theResponse);
    });
  }
}

function createPage(teamPlayersList) {
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

  createFormation.resetEventListener();

  document.body.classList.remove("loading");
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

  resetEventListener() {
    document.getElementById("resetBtn").addEventListener("click", () => {
      this.resetPrompt();
    });
  }

  resetPrompt() {
    if (confirm("Você quer mesmo resetar a sua escalação?")) {
      this.changesFormation();
    }
  }

  createField() {
    const rows = {
      a: this.createRow(),
      b: this.createRow(),
      c: this.createRow(),
      d: this.createRow(),
      e: this.createRow(),
      f: this.createRow(),
      keeper: this.createRow(),
    };

    const formations = {
      "4-3-3": {
        a: [false, false, true, false, false],
        b: [true, false, false, false, true],
        c: [false, false, true, false, false],
        d: [false, true, false, true, false],
        e: [true, false, false, false, true],
        f: [false, true, false, true, false],
        keeper: [false, false, true, false, false],
      },
      "4-1-4-1": {
        a: [false, false, true, false, false],
        b: [false, false, false, false, false],
        c: [true, true, false, true, true],
        d: [false, false, true, false, false],
        e: [true, false, false, false, true],
        f: [false, true, false, true, false],
        keeper: [false, false, true, false, false],
      },
      "4-4-2": {
        a: [false, true, false, true, false],
        b: [false, false, false, false, false],
        c: [false, true, false, true, false],
        d: [false, true, false, true, false],
        e: [true, false, false, false, true],
        f: [false, true, false, true, false],
        keeper: [false, false, true, false, false],
      },
      "3-5-2": {
        a: [false, true, false, true, false],
        b: [false, false, false, false, false],
        c: [false, true, true, true, false],
        d: [true, false, false, false, true],
        e: [false, false, true, false, false],
        f: [false, true, false, true, false],
        keeper: [false, false, true, false, false],
      },
    };
    const rowList = ["a", "b", "c", "d", "e", "f", "keeper"];

    rowList.forEach((rowLetter) => {
      formations[this.formation][rowLetter].forEach((element) => {
        this.createCell(rows[rowLetter], element);
      });
    });

    if (playerTeam.players.length > 1) {
      playerTeam.players.forEach((player) => {
        const position = Object.keys(player)[0];

        this.selectsPlayer(player.position, position);
      });
    }
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
    playerTeam.players = [];
    this.formation = this.formationElement.value;
    playerTeam.formation = this.formation;
    this.tableDOM.innerHTML = "";
    Array.from(this.playersListDOM.children).forEach((element) => {
      element.classList.remove("card--clicked");
      element.classList.add("card--clickable");
    });
    this.createField();
  }

  createPlayerList() {
    this.allPlayers[this.position].forEach((player) => {
      this.playersListDOM.innerHTML =
        this.playersListDOM.innerHTML + this.createCard(player);
    });

    this.theEventListener();
  }

  theEventListener() {
    Array.from(this.playersListDOM.children).forEach((element) => {
      element.addEventListener("click", () => {
        this.selectsPlayer(element.dataset.name, element.dataset.position);
      });
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
      winger: "Ponta",
    };
    const playerAlreadyOnTeam = playerTeam.players.filter((element) => {
      return Object.values(element).includes(playerStats.name);
    });

    if (playerAlreadyOnTeam.length > 0)
      return `<div data-name="${playerStats.name}" data-position="${
        playerStats.position
      }" class="card card--clicked"><div class="card__flex"><img class="img__icon" src="/img/icons/positions/${
        playerStats.position
      }.svg" /><div><h3>${playerStats.name}</h3><p>Posição: <strong>${
        positions[playerStats.position]
      }</strong></p><span class="text--gold-color">${star.repeat(
        playerStats.score
      )}</span>
      </div></div><hr /><span>Time: <strong>${
        playerStats.team
      }</strong></span></div>`;

    return `<div data-name="${playerStats.name}" data-position="${
      playerStats.position
    }" 
    class="card card--clickable"><div class="card__flex"><img class="img__icon" src="/img/icons/positions/${
      playerStats.position
    }.svg" /><div><h3>${playerStats.name}</h3><p>Posição: <strong>${
      positions[playerStats.position]
    }</strong></p><span class="text--gold-color">${star.repeat(
      playerStats.score
    )}</span>
    </div></div><hr /><span>Time: <strong>${
      playerStats.team
    }</strong></span></div>`;
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

    const possibleSpots = this.checkPossibleSpots(position);
    if (possibleSpots.length === 0)
      return alert("Você já passou o limite de jogadores para essa posição");

    const playerAlreadyOnTeam = playerTeam.players.filter((element) => {
      return Object.keys(element)[0] === name;
    });
    if (playerAlreadyOnTeam.length > 0)
      return alert("Esse jogador já está no seu time");

    possibleSpots[0].classList.remove("field__item");
    possibleSpots[0].classList.add(`field__item-${position}`);

    this.signsCardAsMarked(name);

    if (name === undefined) return null;
    return playerTeam.players.push(finalData);
  }

  checkPossibleSpots(position) {
    function filter(number) {
      return Array.from(tableRowsList.item(number).children).filter(
        (element) => {
          return element.classList.contains("field__item");
        }
      );
    }

    const tableRowsList = document.querySelectorAll("tr");
    const tableRows = {
      a: filter(0),
      b: filter(1),
      c: filter(2),
      d: filter(3),
      e: filter(4),
      f: filter(5),
      keeper: filter(6),
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
          return [...tableRows.e, ...tableRows.f];
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
      (element) =>
        element.children[0].children[1].children[0].innerHTML === name
    );
    if (elementCard.length >= 1) {
      elementCard[0].classList.remove("card--clickable");
      elementCard[0].classList.add("card--clicked");
    }
  }
}

function saveTeamData() {
  if (playerTeam.players.length !== 11)
    return alert(
      "O seu time ainda não está completo. Veja no campo se ainda existem posições para preencher."
    );

  document.body.classList.add("loading");

  post(
    "/.netlify/functions/save_starting_team",
    JSON.stringify(playerTeam)
  ).then((data) => {
    dataSaved();
  });
}

function dataSaved() {
  localStorage.clear();
  success();
  document.getElementById("playersTable").innerHTML = "";
  document.getElementById("playersListDOM").innerHTML = "";
  document.body.classList.remove("loading");
  validateLocal()
}

document.body.classList.add("loading");