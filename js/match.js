const matchData = {
  homeTeam: {
    gameMode: 'normal',
    atackStyle: 'mixed',
    players: [
      {goalkeeper: 'Cássio'},
      {left_wing_back: 'Carlos Augusto'},
      {right_wing_back: 'Fagner'},
      {center_back: 'Pedro Henrique'},
      {center_back: 'Bruno Méndez'},
      {midfielder: 'Camacho'},
      {midfielder: 'Gabriel'},
      {midfielder: 'Mateus Vital'},
      {winger: 'Pedrinho'},
      {winger: 'Janderson'},
      {stricker: 'Vagner Love'}
    ],
  },
  alwayTeam: {
    gameMode: 'normal',
    atackStyle: 'mixed',
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

  const screen = `<h1>Time da casa ${score.homeTeam} v ${score.alwayTeam} Time visitante</h1> <p>Posse de bola do time da casa: ${gameData.gameStats.ballPossession.homeTeam}% </p>`

  canvas.innerHTML = screen;

  gameData.theGame.forEach(element => {

    console.log(element)

    let theTeam = '<strong>da casa</strong>';
    if(element.attackingTeam === 'alwayTeam'){
      theTeam = '<strong>visitante</strong>'
    }

    if('info' in element){
      switch (element.info.lastStep) {
        case 'goal':
          canvas.innerHTML = canvas.innerHTML + 
            '<p>Jogada do time ' + theTeam + '</p>' +
            '<p><strong>GOOOOL!</strong> Lindo gol de ' + element.info.kicker + '. A jogada começou com ' + element.info.player + ', ' + element.info.defensor + ' tentou impedir, mas já era tarde.</p></br>';
          break;
        case 'kick':
          canvas.innerHTML = canvas.innerHTML + 
            '<p>Jogada do time ' + theTeam + '</p>' +
            '<p><strong>Ufa, foi por pouco</strong> ' + element.info.kicker + ' da um belo chute, mas ' + element.info.keeper + ' faz a defesa.</p></br>';
            break;
        case 'defensor':
          canvas.innerHTML = canvas.innerHTML + 
            '<p>Jogada do time ' + theTeam + '</p>' +
            '<p>Bonita <strong>roubada de bola</strong> do ' + element.info.defensor + '!</p></br>';
            break;
        case 'startedAtk':
          canvas.innerHTML = canvas.innerHTML + 
            '<p>Jogada do time ' + theTeam + '</p>' +
            '<p>' + element.info.player + ' tenta começar um ataque, mas ' + element.info.stealer + ' estava forte na marcação e impediu o ataque!</p></br>';
          break;
        default:
          canvas.innerHTML = canvas.innerHTML + 
            '<p>Ihh, o jogo está difícil para o time ' + theTeam + ', não estão conseguindo controlar a bola e pensar uma jogada...</p></br>';
          break;
      }
    } else {
      canvas.innerHTML = canvas.innerHTML + 
        '<p>Ihh, o jogo está difícil para o time ' + theTeam + ', não estão conseguindo controlar a bola e pensar uma jogada...</p></br>';
    }
    
    
  });
}

