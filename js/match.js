const matchData = {
  homeTeam: {
    gameMode: 'normal',
    attackStyle: 'mixed',
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

    print(data)
  }
}

const backEnd = new callBackEnd();
document.getElementById('btn').addEventListener('click', ()=>{backEnd.fetch()});

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
      '<li>Estilo de jogo: <strong>' + intensity + '</strong></li>'+
      '<li>Prioridade de ataques: <strong>' + atkStyle + '</strong></li>'+
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
  }
}

function print(data){
  const gameData = data;
  const canvas = document.getElementById('content');
  const screen = '';

  canvas.innerHTML = screen;

  gameData.theGame.forEach(element => {

    let theTeam = '<strong>time da casa</strong>';
    if(element.attackingTeam === 'alwayTeam'){
      theTeam = '<strong>time visitante</strong>'
    }

    const area = ()=>{
      switch (element.info.area) {
        case 'wing':
          return 'canto'
        case 'attack':
          return 'campo de ataque'
        case 'corner':
          return 'escanteio'
        case 'middle':
          return 'meio de campo'
        default:
          return element.info.area
      }
    }

    if('info' in element){
      switch (element.info.lastStep) {
        case 'goal':
          canvas.innerHTML = canvas.innerHTML + 
            '<div class="card card__timeline card__timeline--goal card__timeline--goal-' + element.attackingTeam + '"><p>Jogada do ' + theTeam + '</p><hr>' +
            '<p><strong>GOOOOL!</strong> Lindo gol de ' + element.info.kicker + '. A jogada começou com ' + element.info.player + ', pelo ' + area() + '. ' + element.info.defensor + ' tentou impedir, mas já era tarde.</p></div>';
          break;
        case 'kick':
          canvas.innerHTML = canvas.innerHTML + 
            '<div class="card card__timeline"><p>Jogada do ' + theTeam + '</p><hr>' +
            '<p><strong>Ufa, foi por pouco</strong> ' + element.info.kicker + ' da um belo chute, mas ' + element.info.keeper + ' faz uma bela defesa.</p></div>';
            break;
        case 'defensor':
          canvas.innerHTML = canvas.innerHTML + 
            '<div class="card card__timeline"><p>Jogada do ' + theTeam + '</p><hr>' +
            '<p>Bonita <strong>roubada de bola</strong> do ' + element.info.defensor + ' pelo ' + area() + '!</p></div>';
            break;
        case 'startedAtk':
          canvas.innerHTML = canvas.innerHTML + 
            '<div class="card card__timeline"><p>Jogada do ' + theTeam + '</p><hr>' +
            '<p>' + element.info.player + ' tenta começar um ataque, mas ' + element.info.stealer + ' estava forte na marcação e impediu o ataque!</p></div>';
          break;
        default:
          canvas.innerHTML = canvas.innerHTML + 
            '<div class="card card__timeline"><p>Ihh, o jogo está difícil para o time ' + theTeam + ', não estão conseguindo controlar a bola e pensar uma jogada...</p></div>';
          break;
      }
    } else {
      canvas.innerHTML = canvas.innerHTML + 
        '<div class="card card__timeline"><p>Ihh, o jogo está difícil para o time ' + theTeam + ', não estão conseguindo controlar a bola e pensar uma jogada...</p></div>';
    }
    
    
  });
}

