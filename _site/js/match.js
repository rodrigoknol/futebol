const matchData = {
  homeTeam: {
    gameMode: 'normal',
    attackStyle: 'mixed',
    player: '',
    team: '',
    players: [
      {goalkeeper: 'Cássio'},
      {left_wing_back: 'Carlos Augusto'},
      {right_wing_back: 'Fagner'},
      {center_back: 'Gil'},
      {center_back: 'Bruno Méndez'},
      {midfielder: 'Camacho'},
      {midfielder: 'Gabriel'},
      {midfielder: 'Luan'},
      {winger: 'Janderson'},
      {winger: 'Pedrinho'},
      {stricker: 'Vagner Love'}
    ],
  },
  alwayTeam: {
    gameMode: 'normal',
    attackStyle: 'lateral',
    player: '',
    team: '',
    players: [
      {goalkeeper: 'Cássio'},
      {left_wing_back: 'Lucas Piton'},
      {right_wing_back: 'Fagner'},
      {center_back: 'Pedro Henrique'},
      {center_back: 'Gil'},
      {midfielder: 'Camacho'},
      {midfielder: 'Cantillo'},
      {midfielder: 'Ramiro'},
      {midfielder: 'Luan'},
      {winger: 'Pedrinho'},
      {stricker: 'Mauro Boselli'}
    ],
  }
}

async function post(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  return await response.json();
}

function getRandomInt(max){
  return Math.floor(Math.random() * Math.floor(max))
}

class callBackEnd {
  fetch(){
    const dummyData = '{"gameStats":{"ballPossession":{"homeTeam":28.672705034084352,"alwayTeam":71.32729496591566},"intensity":{"homeTeam":"normal","alwayTeam":"normal"},"atkStyle":{"homeTeam":"mixed","alwayTeam":"lateral"}},"theGame":[{"attackingTeam":"alwayTeam","result":"failed","turn":0,"info":{"lastStep":"kick","kicker":"Cantillo","keeper":"Cássio","area":"middle"}},{"attackingTeam":"alwayTeam","result":"failed","turn":1,"info":{"lastStep":"kick","kicker":"Ramiro","keeper":"Cássio","area":"middle"}},{"attackingTeam":"homeTeam","result":"failed","turn":2,"info":{"lastStep":"kick","kicker":"Pedrinho","keeper":"Cássio","area":"wing"}},{"attackingTeam":"homeTeam","result":"failed","turn":3,"info":{"lastStep":"startedAtk","player":"Carlos Augusto","stealer":"Pedro Henrique","area":"wing"}},{"attackingTeam":"alwayTeam","result":"failed","turn":4,"info":{"lastStep":"startedAtk","player":"Cantillo","stealer":"Gil","area":"corner"}},{"attackingTeam":"alwayTeam","result":"success","turn":5,"info":{"lastStep":"goal","kicker":"Pedrinho","player":"Pedrinho","defensor":"Bruno Méndez","keeper":"Cássio","area":"attack"}},{"attackingTeam":"alwayTeam","result":"failed","turn":6,"info":{"lastStep":"kick","kicker":"Ramiro","keeper":"Cássio","area":"wing"}},{"attackingTeam":"alwayTeam","result":"success","turn":7,"info":{"lastStep":"goal","kicker":"Mauro Boselli","player":"Pedrinho","defensor":"Fagner","keeper":"Cássio","area":"wing"}}]}'
    this.control(JSON.parse(dummyData))

    // post('/.netlify/functions/run_match', matchData)
    // .then((data) => {
    //   control(data)
    // });
  }

  control(data){
    const summary = new createSummary(data)
    summary.createContent()
  
    const timeline = new createTimeline(data)
    timeline.organizeTimeline()
    timeline.printsScore()
  }
}

class createSummary{
  constructor(data){
    this.domHomeTeam = document.getElementById('dashboardHome');
    this.domAlwayTeam = document.getElementById('dashboardAlway');
    this.gameStats = data.gameStats;
  }

  createDashTable(team){
    let intensity = 'Normal';
    switch (this.gameStats.intensity[team]) {
      case 'counter-atk':
        intensity = 'Contra-ataque'
        break;
      case 'all-atk':
        intensity = 'Ataque Total'
        break;
      case 'all-def':
        intensity = 'Retranca'
        break;
      default:
        break;
    }
  
    let atkStyle = 'Misto'
    switch (this.gameStats.atkStyle[team]) {
      case 'wing':
        atkStyle = 'Pelas laterais'
        break;
      case 'middle':
        atkStyle = 'Pelo meio'
        break;
    }
  
    return   '<ul class="list--no-style">'+
      '<li>Modo de jogo: <strong>' + intensity + '</strong></li>'+
      '<li>Estilo de ataques: <strong>' + atkStyle + '</strong></li>'+
      '<li>Posse de bola: <strong>' + this.gameStats.ballPossession[team].toFixed(1)  + '%</strong></li>'+
      '</ul>';
  }

  createContent(){
    this.domHomeTeam.innerHTML = this.createDashTable('homeTeam')
    this.domAlwayTeam.innerHTML = this.createDashTable('alwayTeam')
  }
}

class createTimeline{
  constructor(data){
    this.domTimeline = document.getElementById('content');
    this.domScoreHomeTeam = document.getElementById('scoreHomeTeam');
    this.domScoreAlwayTeam = document.getElementById('scoreAlwayTeam');
    this.matchMoments = data.theGame;
    this.matchStats = data.gameStats;
    this.cardsList = [];
    this.printedItens = 0;
  }

  organizeTimeline(){
    this.createArray()
    this.printArray()
  }

  createArray(){
    this.matchMoments.forEach(timelineEntry => {
      this.cardsList.push(this.formatData(timelineEntry))
    })
  }

  printArray(){
    this.cardsList.forEach(timeLineElement => {
      this.domTimeline.innerHTML = this.domTimeline.innerHTML + timeLineElement;
    })
  }

  printsScore(){
    const homeTeam = this.matchMoments.filter(element => element.attackingTeam === 'homeTeam');
    const alwayTeam = this.matchMoments.filter(element => element.attackingTeam === 'alwayTeam');
    const homeScore = homeTeam.reduce((acc, play) => acc + (play.result === 'success'), 0);
    const alwayScore = alwayTeam.reduce((acc, play) => acc + (play.result === 'success'), 0);

    this.domScoreHomeTeam.innerHTML = homeScore;
    this.domScoreAlwayTeam.innerHTML = alwayScore;
  }

  formatData(timelineEntry){
    let theTeam = '<strong>time da casa</strong>';
    if(timelineEntry.attackingTeam === 'alwayTeam'){
      theTeam = '<strong>time visitante</strong>'
    }
    let content = this.createsContent(timelineEntry);

    return this.createCard(timelineEntry.attackingTeam, theTeam, timelineEntry.result, content)
  }

  createsContent(matchData){
    const area = ()=>{
      switch (matchData.info.area) {
        case 'wing':
          return 'canto'
        case 'attack':
          return 'campo de ataque'
        case 'corner':
          return 'escanteio'
        case 'middle':
          return 'meio de campo'
        default:
          return matchData.info.area
      }
    }

    const possibilities ={
      goal:['<strong>GOOOOL!!!</strong> Lindo gol de ' + matchData.info.kicker + '. A jogada começou com ' + matchData.info.player + ', pelo ' + area() + '. ' + matchData.info.defensor + ' tentou impedir, mas já era tarde.',
      '<strong>LINDO GOL!</strong> Grande chute do ' + matchData.info.kicker + '. A jogada começou pelo ' + area() + ', nos pés do  ' + matchData.info.player + '. Uma grande pintura!',
      '<strong>GOL! JOGADA PRECISA!</strong> E foi '+ matchData.info.kicker +' quem deu esse belo chute. A jogada começou pelo ' + area() +' e a bola terminou no fundo das redes!',
      '<strong>GOL, GOL, GOL, GOOOOOOL!</strong> Uma pintura do '+ matchData.info.kicker  + ', o ' + matchData.info.defensor + ', que era para estar na marcação, nem viu o que aconteceu. A jogada começou pelo ' + area() +', nos pés do ' + matchData.info.player ],
      kick:['<strong>Ufa, foi por pouco</strong> ' + matchData.info.kicker + ' da um belo chute, mas ' + matchData.info.keeper + ' faz uma bela defesa.',
      '<strong>O que que é isso?</strong> ' + matchData.info.kicker + ' manda a bola para as alturas!',
      '<strong>Quaase... </strong>' + matchData.info.kicker + ' recebeu um passe fantástico, era ele e o goleiro, chutou e... Um chute horrível, saiu LONGE do alvo...',
      '<strong>Por centímetros!</strong> A estrela do ' + matchData.info.kicker + ' parece estar brilhando, um chute de primeira que BATE NO TRAVESSÃO!',
      '<strong>Bela defesa!</strong> ' + matchData.info.keeper + ' faz um pequeno milagre, defende a bomba chutada por ' + matchData.info.kicker],
      defensor:['Bonita <strong>roubada de bola</strong> do ' + matchData.info.defensor + ' pelo ' + area() + '!',
      'O time atacante não está com nada! Gerande <strong>roubada de bola</strong> feita pelo ' + matchData.info.defensor],
      startedAtk:[matchData.info.player + ' tenta começar um ataque, mas ' + matchData.info.stealer + ' estava forte na marcação e impediu o ataque!',
      matchData.info.player + ' parece perdido em campo... Ele tenta começar um ataque, mas ' + matchData.info.stealer + ' não deixou a jogada continuar...',
      matchData.info.stealer + ' está impossível hoje! Mesmo que ' + matchData.info.player + ' tenha começado uma jogada pelo ' + area() + ', nenhuma bola passa pelo ' + matchData.info.stealer + ' hoje!'],
    };

    if('info' in matchData){
      switch (matchData.info.lastStep) {
        case 'goal':
          return possibilities.goal[getRandomInt(possibilities.goal.length)];
        case 'kick':
          return possibilities.kick[getRandomInt(possibilities.kick.length)];
        case 'defensor':
          return possibilities.defensor[getRandomInt(possibilities.defensor.length)];
        case 'startedAtk':
          return possibilities.startedAtk[getRandomInt(possibilities.startedAtk.length)];
        default:
          return 'Ihh, o jogo está difícil para o time ' + theTeam + ', não estão conseguindo controlar a bola e pensar uma jogada...'
      }
    } else {
      return 'Ihh, o jogo está difícil para o time ' + theTeam + ', não estão conseguindo controlar a bola e pensar uma jogada...';
    }
  }

  createCard(attackingTeam, teamName, result, content){
    if(result === 'success'){
      return `<div class="card card__timeline card__timeline--goal card__timeline--goal-${attackingTeam}"><p>Um gol do ${teamName}</p><hr><p>${content}</p></div>`
    }
    return `<div class="card card__timeline"><p>Uma jogada do ${teamName}</p><hr><p>${content}</p></div>`
  }
}

const backEnd = new callBackEnd();
backEnd.fetch()