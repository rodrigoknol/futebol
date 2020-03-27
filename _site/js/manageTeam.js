const teamPlayersList = {
  goalkeeper: [
    {position: 'goalkeeper',
     name: 'Cássio',
     points: 0}
  ],
  wing_back: [
    {position: 'left_wing_back',
     name: 'Carlos Augusto',
     points: 0},
    {position: 'left_wing_back',
     name: 'Lucas Piton',
     points: 0},
    {position: 'right_wing_back',
     name: 'Fagner',
     points: 0}
  ],
  defensor: [
    {position: 'center_back',
     name: 'Gil',
     points: 0},
    {position: 'center_back',
     name: 'Bruno Méndez',
     points: 0},
    {position: 'center_back',
     name: 'Pedro Henrique',
     points: 0},
  ],
  midfielder: [
    {position: 'midfielder',
     name: 'Camacho',
     points: 0},
    {position: 'midfielder',
     name: 'Cantillo',
     points: 0},
    {position: 'midfielder',
     name: 'Gabriel',
     points: 0},
     {position: 'midfielder',
     name: 'Ramiro',
     points: 0},
     {position: 'midfielder',
     name: 'Mateus Vital',
     points: 0},
     {position: 'midfielder',
     name: 'Luan',
     points: 0},
  ],
  attackers: [
    {position: 'stricker ',
     name: 'Mauro Boselli',
     points: 0},
     {position: 'stricker',
     name: 'Vagner Love',
     points: 0},
     {position: 'winger',
     name: 'Janderson',
     points: 0},
     {position: 'winger',
     name: 'Pedrinho',
     points: 0},
  ],
}

class manageTeam{
  constructor(tableDOM, formationSelect, playersListDOM, positionSelect){
    this.tableDOM = document.getElementById(tableDOM);
    this.playersListDOM = document.getElementById(playersListDOM);
    this.formationElement = document.getElementById(formationSelect);
    this.formation = document.getElementById(formationSelect).value;
    this.positionElement = document.getElementById(positionSelect);
    this.position = document.getElementById(positionSelect).value;
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

  }
}

const createFormation = new manageTeam('playersTable', 'formation', 'playersListDOM', 'position');
createFormation.createField()
createFormation.updatesFormation()