const teamPlayersList = {
  goalkeeper: [
    {position: 'goalkeeper',
     name: 'Cássio',
     points: 4}
  ],
  wing_back: [
    {position: 'left_wing_back',
     name: 'Carlos Augusto',
     points: 2},
    {position: 'left_wing_back',
     name: 'Lucas Piton',
     points: 2},
    {position: 'right_wing_back',
     name: 'Fagner',
     points: 4}
  ],
  defensor: [
    {position: 'center_back',
     name: 'Gil',
     points: 4},
    {position: 'center_back',
     name: 'Bruno Méndez',
     points: 2},
    {position: 'center_back',
     name: 'Pedro Henrique',
     points: 3},
  ],
  midfielder: [
    {position: 'midfielder',
     name: 'Camacho',
     points: 3},
    {position: 'midfielder',
     name: 'Cantillo',
     points: 5},
    {position: 'midfielder',
     name: 'Gabriel',
     points: 2},
     {position: 'midfielder',
     name: 'Ramiro',
     points: 4},
     {position: 'midfielder',
     name: 'Mateus Vital',
     points: 3},
     {position: 'midfielder',
     name: 'Luan',
     points: 4},
  ],
  attackers: [
    {position: 'stricker',
     name: 'Mauro Boselli',
     points: 4},
     {position: 'stricker',
     name: 'Vagner Love',
     points: 3},
     {position: 'winger',
     name: 'Janderson',
     points: 2},
     {position: 'winger',
     name: 'Pedrinho',
     points: 5},
  ],
}

class manageTeam{
  constructor(tableDOM, formationSelect, playersListDOM, positionSelect, teamPlayersList){
    this.tableDOM = document.getElementById(tableDOM);
    this.playersListDOM = document.getElementById(playersListDOM);
    this.formationElement = document.getElementById(formationSelect);
    this.formation = document.getElementById(formationSelect).value;
    this.positionElement = document.getElementById(positionSelect);
    this.position = document.getElementById(positionSelect).value;
    this.allPlayers = teamPlayersList;
    this.selectedPlayers = []
  }

  createField(){  
    const rows = {
      a: this.createRow(),
      b: this.createRow(),
      c: this.createRow(),
      d: this.createRow(),
      e: this.createRow(),
      f: this.createRow(),
      keeper: this.createRow()
    }
    const formations = {
      '4-3-3':{
        a: [false, false, true, false, false],
        b: [true, false, false, false, true],
        c: [false, false, true, false, false],
        d: [false, true, false, true, false],
        e: [true, false, false, false, true],
        f: [false, true, false, true, false],
        keeper: [false, false, true, false, false],
      },
      '4-1-4-1':{
        a: [false, false, true, false, false],
        b: [false, true, false, true, false],
        c: [true, false, false, false, true],
        d: [false, false, true, false, false],
        e: [true, false, false, false, true],
        f: [false, true, false, true, false],
        keeper: [false, false, true, false, false],
      },
      '4-4-2':{
        a: [false, true, false, true, false],
        b: [false, false, false, false, false],
        c: [false, true, false, true, false],
        d: [false, true, false, true, false],
        e: [true, false, false, false, true],
        f: [false, true, false, true, false],
        keeper: [false, false, true, false, false],
      },
      '3-5-2':{
        a: [false, true, false, true, false],
        b: [false, false, false, false, false],
        c: [false, true, false, true, false],
        d: [true, false, true, false, true],
        e: [false, false, true, false, false],
        f: [false, true, false, true, false],
        keeper: [false, false, true, false, false],
      }
    }
    const rowList = ['a','b','c','d','e','f','keeper'];

    rowList.forEach(rowLetter =>{
      formations[this.formation][rowLetter].forEach(element => {
        this.createCell(rows[rowLetter], element)
      });
    })
  }

  createRow(){
    return this.tableDOM.insertRow()
  }

  createCell(row, actionable = false){
    const cell = row.insertCell()
    if(actionable){
      cell.classList.add('field__item')
    }
  }

  updatesFormation(){
    this.formationElement.addEventListener('change', ()=>{this.changesFormation()})
  }

  changesFormation(){
    this.formation = this.formationElement.value;
    this.tableDOM.innerHTML = '';
    this.createField()
  }

  createPlayerList(){
    this.allPlayers[this.position].forEach(player => {
      this.playersListDOM.innerHTML = this.playersListDOM.innerHTML + this.createCard(player)
    })
  }

  createCard(playerStats){
    const star = '★';
    const positions = {
      goalkeeper: 'Goleiro',
      left_wing_back: 'Lateral Esquerdo',
      right_wing_back: 'Lateral Direito',
      center_back: 'Zagueiro',
      midfielder: 'Meio Campista',
      stricker: 'Centro-Avante',
      winger: 'Ponta'
    }

    return `<div class="card"><div class="card__flex"><img class="img__icon" src="/img/icons/positions/${playerStats.position}.svg" /><div><h3>${playerStats.name}</h3><p>Posição: <strong>${positions[playerStats.position]}</strong></p></div></div><hr /><p class="text--gold-color">${star.repeat(playerStats.points)}</p></div>`
  }

  updatesPosition(){
    this.positionElement.addEventListener('change', ()=>{this.changesPosition()})
  }

  changesPosition(){
    console.log(this.positionElement.value)
    this.position = this.positionElement.value;
    this.playersListDOM.innerHTML = '';
    this.createPlayerList()
  }
}

const createFormation = new manageTeam('playersTable', 'formation', 'playersListDOM', 'position', teamPlayersList);
createFormation.createField()
createFormation.createPlayerList()

createFormation.updatesFormation()
createFormation.updatesPosition()