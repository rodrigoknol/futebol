async function post(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data
  });
  return await response.json();
}

class playersList{
  constructor(domListID, players){
    this.domList = document.getElementById(domListID)
    this.players = players
  }

  createsList(){
    const formatedplayers = this.formatData()
    const rows = [];
    formatedplayers.forEach(player => {rows.push(this.createplayerRow(player))})
  }

  formatData(){
    return this.players.map(player => {return {position: this.definePosition(player), name: `<strong>${player.name}</strong>`,  score: this.createStar(player.score), price: `${player.price.toFixed(1)} milhões`}} )
  }

  createStar(score){
    const star = "★";
    return `<span class="text--gold-color">${star.repeat(score)}</span>`
  }

  definePosition(player){
    switch (player.position) {
      case 'stricker':
        return 'Centro-avante'
      case 'winger':
        return 'Ponta'
      case 'center_back':
        return 'Zagueiro'
      case 'goalkeeper':
        return 'Goleiro'
      case 'midfielder':
        return 'Meio Campista'
      case 'left_wing_back':
        return 'Lateral Esquerdo'
      case 'right_wing_back':
        return 'Lateral Direito'
      default:
        return '???'
    } 
  }

  createplayerRow(playerData){
    const theRow = this.domList.insertRow();

    Object.keys(playerData).forEach(element=>{
      const cell = theRow.insertCell();
      cell.innerHTML = playerData[element]
    })

    const commerceCell = theRow.insertCell();
    commerceCell.innerHTML = `<a class="btn btn--no-margins" onclick="sellPlayer(${playerData.name})">Vender</a>`;
  }
}

class createsDashboard{
  constructor(data){
    this.data = data;
    this.domElements = {
      players: document.getElementById('totalPlayers'),
      teamValue: document.getElementById('teamValue'),
      bankAccount: document.getElementById('bankAccount'),
    }
    this.results = {
      totalPlayers: 0,
      teamValue: 0,
      bankAccount: data.bankAccount.toFixed(1),
    }
  }

  getData(){
    if(localStorage.getItem('user_players')){
      this.organize(JSON.parse(localStorage.getItem('user_players')))
    } else{
      getPlayers(data.playersList).then(
        res => {this.organize(res)}
      )
    }
  }
  
  organize(res){
    localStorage.setItem('user_players', JSON.stringify(res))
    const allPlayers = [...res.attackers, ...res.defensor, ...res.goalkeeper, ...res.midfielder, ...res.wing_back];

    this.results.totalPlayers = allPlayers.length || 0;
    this.results.teamValue = allPlayers.reduce((acc, player) => acc + player.price, 0).toFixed(1) || 0;
    this.printResults()

    const theList = new playersList('playersList', allPlayers);
    theList.createsList()
  }

  printResults(){
    this.domElements.players.innerText = this.results.totalPlayers;
    this.domElements.teamValue.innerText = this.results.teamValue;
    this.domElements.bankAccount.innerText = this.results.bankAccount;
  }
}

async function getPlayers(data){
  const theResponse = await post("/.netlify/functions/get_players_data", JSON.stringify(data));
  return theResponse;
}

document.body.classList.add("loading");
if(localStorage.getItem('user')){
  prepare(JSON.parse(localStorage.getItem('user')))
} else {
  setTimeout(() => {
    post(
      "/.netlify/functions/get_team_data",
      JSON.stringify({id: getLoginData('id')})
    ).then(theResponse => {
      prepare(theResponse.data.playerBase)
    });
  }, 600);
}

function prepare(data){
  savesLocally(data)
  document.getElementById('teamName').innerText = data.teamName || 'Seu time';
  document.body.classList.remove("loading");

  const dashBoardTable = new createsDashboard(data);
  dashBoardTable.getData()
}

function savesLocally(data){
  localStorage.setItem('user', JSON.stringify(data))
}