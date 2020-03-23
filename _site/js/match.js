const matchData = {
  homeTeam: {
    gameMode: 'normal',
    atackStyle: 'mixed',
    players: [
      {goalkeeper: 'Cássio'},
      {left_wing_back: 'Carlos Augusto'},
      {right_wing_back: 'Fagner'},
      {center_back: 'Pedro Henrique'},
      {center_back: 'Gil'},
      {midfielder: 'Camacho'},
      {midfielder: 'Cantillo'},
      {midfielder: 'Ramiro'},
      {midfielder: 'Luan'},
      {midfielder: 'Mateus Vital'},
      {stricker: 'Mauro Boselli'}
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
      {midfielder: 'Gabriel'},
      {midfielder: 'Cantillo'},
      {midfielder: 'Mateus Vital'},
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
  console.log('to aqui')
  post('/.netlify/functions/run_match', matchData)
  .then((data) => {
    console.log(data)
  });
}
