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

document.getElementById('btn').addEventListener('click', ()=>{callBackEnd()});

function callBackEnd(){
  post('/.netlify/functions/run_match', matchData)
  .then((data) => {
    print(data)
  });
}

function print(data){
  const gameData = data;
  const canvas = document.getElementById('content');
  const homePlays = gameData.theGame.filter(team => team.attackingTeam === 'homeTeam');
  const alwayPlays = gameData.theGame.filter(team => team.attackingTeam === 'alwayTeam');

  const score = {
    homeTeam: homePlays.filter(play => play.result === 'success').length,
    alwayTeam: alwayPlays.filter(play => play.result === 'success').length,
  }

  const screen = `<h1 class="text--centered">Time da casa ${score.homeTeam} v ${score.alwayTeam} Time visitante</h1>`

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

