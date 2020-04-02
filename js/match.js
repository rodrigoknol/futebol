async function post(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await response.json();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

class callBackEnd {
  fetch(matchBaseData) {
    post("/.netlify/functions/run_match", matchBaseData).then(data => {
      this.control(data);
    });
  }

  control(data) {
    document.body.classList.remove("loading");

    const summary = new createSummary(data);
    summary.createContent();

    const timeline = new createTimeline(data);
    timeline.organizeTimeline();
    timeline.printsScore();
  }
}

class createSummary {
  constructor(data) {
    this.domHomeTeam = document.getElementById("dashboardHome");
    this.domAlwayTeam = document.getElementById("dashboardAlway");
    this.gameStats = data.gameStats;
  }

  createDashTable(team) {
    let intensity = "Normal";
    switch (this.gameStats.intensity[team]) {
      case "counter-atk":
        intensity = "Contra-ataque";
        break;
      case "all-atk":
        intensity = "Ataque Total";
        break;
      case "all-def":
        intensity = "Retranca";
        break;
      default:
        break;
    }

    let atkStyle = "Misto";
    switch (this.gameStats.atkStyle[team]) {
      case "lateral":
        atkStyle = "Pelas laterais";
        break;
      case "middle":
        atkStyle = "Pelo meio";
        break;
    }

    return (
      '<ul class="list--no-style">' +
      "<li>Modo de jogo: <strong>" +
      intensity +
      "</strong></li>" +
      "<li>Estilo de ataques: <strong>" +
      atkStyle +
      "</strong></li>" +
      "<li>Posse de bola: <strong>" +
      this.gameStats.ballPossession[team].toFixed(1) +
      "%</strong></li>" +
      "</ul>"
    );
  }

  createContent() {
    this.domHomeTeam.innerHTML = this.createDashTable("homeTeam");
    this.domAlwayTeam.innerHTML = this.createDashTable("alwayTeam");
  }
}

class createTimeline {
  constructor(data) {
    this.domTimeline = document.getElementById("content");
    this.domScoreHomeTeam = document.getElementById("scoreHomeTeam");
    this.domScoreAlwayTeam = document.getElementById("scoreAlwayTeam");
    this.matchMoments = data.theGame;
    this.matchStats = data.gameStats;
    this.cardsList = [];
    this.printedItens = 0;
  }

  organizeTimeline() {
    this.gameData('startData');
    this.createArray();
    this.gameData('endData');
    this.printArray();
  }

  gameData(type){
    const startPossibilities = [
      'A bola já está na marca, o arbitro apita e <strong>começa o jogo</strong>!',
      'Bem amigos do <strong>1, 2, 3 Gol</strong>, mais um lindo jogo começando hoje, muito boa sorte para os dois times!',
      'Os dois times em posição, o árbitro olha para o relógio e apita. <strong>Inicia mais um grande jogo!</strong>',
      'Vamos ter mais um grande jogo a frente, e <strong>a bola começa a rolar!</strong>'
    ];
    const endPossibilities = [
      'Um grande duelo chega ao fim agora, os dois times vão agora para o vestiário descansar.',
      'apiiiita o árbitro, um grande jogo que acaba agora.',
      'E fim de jogo! Foi um grande duelo, os dois times deram tudo de sí.',
      'Acaba esse duelo fantástico. Os jogadores dos dois times estão exaustos depois de um jogo desses.'
    ]
    const content = {
      startData: startPossibilities[getRandomInt(startPossibilities.length)],
      endData: endPossibilities[getRandomInt(endPossibilities.length)]
    }

    this.cardsList.push(this.createCard('', '', 'statistic', content[type]))
  }

  createArray() {
    this.matchMoments.forEach(timelineEntry => {
      this.cardsList.push(this.formatData(timelineEntry));
    });
  }

  printArray() {
    this.cardsList.forEach(timeLineElement => {
      this.domTimeline.innerHTML = this.domTimeline.innerHTML + timeLineElement;
    });
  }

  printsScore() {
    const homeTeam = this.matchMoments.filter(
      element => element.attackingTeam === "homeTeam"
    );
    const alwayTeam = this.matchMoments.filter(
      element => element.attackingTeam === "alwayTeam"
    );
    const homeScore = homeTeam.reduce(
      (acc, play) => acc + (play.result === "success"),
      0
    );
    const alwayScore = alwayTeam.reduce(
      (acc, play) => acc + (play.result === "success"),
      0
    );

    this.domScoreHomeTeam.innerHTML = homeScore;
    this.domScoreAlwayTeam.innerHTML = alwayScore;
  }

  formatData(timelineEntry) {
    let theTeam = "<strong>time da casa</strong>";
    if (timelineEntry.attackingTeam === "alwayTeam") {
      theTeam = "<strong>time visitante</strong>";
    }
    let content = this.createsContent(timelineEntry);

    return this.createCard(
      timelineEntry.attackingTeam,
      theTeam,
      timelineEntry.result,
      content
    );
  }

  createsContent(matchData) {
    if ("info" in matchData) {
      const area = () => {
        switch (matchData.info.area) {
          case "wing":
            return "canto";
          case "attack":
            return "campo de ataque";
          case "corner":
            return "escanteio";
          case "middle":
            return "meio de campo";
          default:
            return matchData.info.area;
        }
      };

      const possibilities = {
        goal: [
          "<strong>GOOOOL!!!</strong> Lindo gol de " +
            matchData.info.kicker +
            ". A jogada começou com " +
            matchData.info.player +
            ", pelo " +
            area() +
            ". " +
            matchData.info.defensor +
            " tentou impedir, mas já era tarde.",
          "<strong>LINDO GOL!</strong> Grande chute do " +
            matchData.info.kicker +
            ". A jogada começou pelo " +
            area() +
            ", nos pés do  " +
            matchData.info.player +
            ". Uma grande pintura!",
          "<strong>GOL! JOGADA PRECISA!</strong> E foi " +
            matchData.info.kicker +
            " quem deu esse belo chute. A jogada começou pelo " +
            area() +
            " e a bola terminou no fundo das redes!",
          "<strong>GOL, GOL, GOL, GOOOOOOL!</strong> Uma pintura do " +
            matchData.info.kicker +
            ", o " +
            matchData.info.defensor +
            ", que era para estar na marcação, nem viu o que aconteceu. A jogada começou pelo " +
            area() +
            ", nos pés do " +
            matchData.info.player
        ],
        kick: [
          "<strong>Ufa, foi por pouco</strong> " +
            matchData.info.kicker +
            " da um belo chute, mas " +
            matchData.info.keeper +
            " faz uma grande defesa.",
          "<strong>O que que é isso?</strong> " +
            matchData.info.kicker +
            " manda a bola para as alturas!",
          "<strong>Quaase... </strong>" +
            matchData.info.kicker +
            " recebeu um passe fantástico, era ele e o goleiro, chutou e... Um chute horrível, saiu LONGE do alvo...",
          "<strong>Por centímetros!</strong> A estrela do " +
            matchData.info.kicker +
            " parece estar brilhando, um chute de primeira que BATE NO TRAVESSÃO!",
          "<strong>Bela defesa!</strong> " +
            matchData.info.keeper +
            " faz um pequeno milagre, defende a bomba chutada por " +
            matchData.info.kicker
        ],
        defensor: [
          "Bonita <strong>roubada de bola</strong> do " +
            matchData.info.defensor +
            " pelo " +
            area() +
            "!",
          "Ótima <strong>roubada de bola</strong> feita pelo " +
            matchData.info.defensor +
            "Pelo " +
            area()
        ],
        startedAtk: [
          matchData.info.player +
            " tenta começar um ataque, mas " +
            matchData.info.stealer +
            " estava forte na marcação e impediu o ataque!",
          matchData.info.player +
            " parece perdido em campo... Ele tenta começar um ataque, mas " +
            matchData.info.stealer +
            " <strong>não deixou a jogada continuar</strong>...",
          matchData.info.stealer +
            " está impossível hoje! Mesmo que " +
            matchData.info.player +
            " tenha tentado começado uma jogada pelo " +
            area() +
            ", <strong>nenhuma bola passa</strong> pelo " +
            matchData.info.stealer +
            " hoje!"
        ]
      };

      switch (matchData.info.lastStep) {
        case "goal":
          return possibilities.goal[getRandomInt(possibilities.goal.length)];
        case "kick":
          return possibilities.kick[getRandomInt(possibilities.kick.length)];
        case "defensor":
          return possibilities.defensor[
            getRandomInt(possibilities.defensor.length)
          ];
        case "startedAtk":
          return possibilities.startedAtk[
            getRandomInt(possibilities.startedAtk.length)
          ];
        default:
          return (
            "Ihh, o jogo está difícil para o time " +
            theTeam +
            ", não estão conseguindo controlar a bola e pensar uma jogada..."
          );
      }
    } else {
      return "Ihh, o <strong>jogo está difícil ein</strong>... Não estão conseguindo controlar a bola e nem pensar uma jogada...";
    }
  }

  createCard(attackingTeam, teamName, result, content) {
    switch (result) {
      case 'success':
        return `<div class="card card__timeline card__timeline--goal card__timeline--goal-${attackingTeam}"><p>Um gol do ${teamName}</p><hr><p>${content}</p></div>`;
      case 'statistic':
        return `<div class="card card__timeline"><p>Comentarista</p><hr><p>${content}</p></div>`;
      default:
        return `<div class="card card__timeline"><p>Uma jogada do ${teamName}</p><hr><p>${content}</p></div>`;
    }
    
  }
}

const backEnd = new callBackEnd();

document.body.classList.add("loading");

const wholeId = document.location.search;
const id = wholeId.split("=")[1];

post("/.netlify/functions/get_match_data", id).then(response => {
  backEnd.fetch(response.data);
});
