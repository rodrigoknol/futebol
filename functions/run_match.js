const fetch = require("node-fetch");

let turn = 0;

exports.handler = (event, context, callback) => {

  async function post(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: data
    });
    return await response.json();
  }
  
  post('https://futebol-game.netlify.com/.netlify/functions/get_players_for_match', event.body)
    .then((data) => {
      matchLogic(data)
    });

  function matchLogic(data) {
    const basicTeamsStats ={
      homeTeam: {
        pricePoints: calculateTeamTotalPrice('homeTeam', data),
        atkPoints: calculateAttackPoints('homeTeam', data),
        defPoints: calculateDefensePoints('homeTeam', data),
      },
      alwayTeam: {
        pricePoints: calculateTeamTotalPrice('alwayTeam', data),
        atkPoints: calculateAttackPoints('alwayTeam', data),
        defPoints: calculateDefensePoints('alwayTeam', data),
      }
    }

    const gameStats ={
      ballPossession: calculatePossession(basicTeamsStats),
      intensity: {
        homeTeam: data.teamData.homeTeam.gameMode,
        alwayTeam: data.teamData.alwayTeam.gameMode,
      },
      atkStyle: {
        homeTeam: data.teamData.homeTeam.atackStyle,
        alwayTeam: data.teamData.alwayTeam.atackStyle,
      }
    }

    let theGame = [];

    while (turn <= 7) {
      switch (turn) {
        case 0:
          if(gameStats.ballPossession.homeTeam > gameStats.ballPossession.alwayTeam) {
            theGame = [...theGame, getTurn('homeTeam', 'alwayTeam', data, basicTeamsStats, gameStats)]
          } else {
            theGame = [...theGame, getTurn('alwayTeam', 'homeTeam', data, basicTeamsStats, gameStats)]
          }
          break;
        case 1:
          if(gameStats.intensity.homeTeam !== 'all-atk'){
            theGame = [...theGame, getTurn('alwayTeam', 'homeTeam', data, basicTeamsStats, gameStats)]
          } else {
            theGame = [...theGame, getTurn('homeTeam', 'alwayTeam', data, basicTeamsStats, gameStats)]
          }
          break;
        case 2:
          if(gameStats.intensity.alwayTeam !== 'all-atk'){
            theGame = [...theGame, getTurn('homeTeam', 'alwayTeam', data, basicTeamsStats, gameStats)]
          } else {
            theGame = [...theGame, getTurn('alwayTeam', 'homeTeam', data, basicTeamsStats, gameStats)]
          }
          break;
        case 3:
          theGame = [...theGame, getTurn('homeTeam', 'alwayTeam', data, basicTeamsStats, gameStats)]
          break;
        case 4:
          theGame = [...theGame, getTurn('alwayTeam', 'homeTeam', data, basicTeamsStats, gameStats)]
          break;
        case 5:
          if(basicTeamsStats.homeTeam.pricePoints > basicTeamsStats.alwayTeam.pricePoints){
            theGame = [...theGame, getTurn('homeTeam', 'alwayTeam', data, basicTeamsStats, gameStats)]
          } else {
            theGame = [...theGame, getTurn('alwayTeam', 'homeTeam', data, basicTeamsStats, gameStats)]
          }
          break;
        case 6:
          if(basicTeamsStats.homeTeam.pricePoints > basicTeamsStats.alwayTeam.pricePoints){
            theGame = [...theGame, getTurn('homeTeam', 'alwayTeam', data, basicTeamsStats, gameStats)]
          } else {
            theGame = [...theGame, getTurn('alwayTeam', 'homeTeam', data, basicTeamsStats, gameStats)]
          }
          break;
        case 7:
          if(gameStats.ballPossession.homeTeam > gameStats.ballPossession.alwayTeam) {
            theGame = [...theGame, getTurn('homeTeam', 'alwayTeam', data, basicTeamsStats, gameStats)]
          } else {
            theGame = [...theGame, getTurn('alwayTeam', 'homeTeam', data, basicTeamsStats, gameStats)]
          }
          break;
        default:
          theGame = [...theGame, getTurn('homeTeam', 'alwayTeam', data, basicTeamsStats, gameStats)]
          break;
      }

      turn ++
    }

    const finalData = {
      gameStats,
      theGame,
    }

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(finalData),
    })
  }
}

function getRandomInt(max){
  return Math.floor(Math.random() * Math.floor(max))
}

function getTurn(attackTeam, defenseTeam, data, basicTeamsStats, gameStats){
  const atk = data.thePlayers[attackTeam];
  const def = data.thePlayers[defenseTeam];

  if(basicTeamsStats[attackTeam].atkPoints > basicTeamsStats[defenseTeam].defPoints){
    return attackStyle(atk, def, gameStats, attackTeam)
  }

  if(getRandomInt(2) ===  1){
    return attackStyle(atk, def, gameStats, attackTeam)
  }

  return {
    attackingTeam: attackTeam,
    result: 'failed',
  }
}

function attackStyle(atk, def, gameStats, attackTeam){
  const possibilities = {
    mixed: ['wing', 'attack', 'middle', 'corner', 'wing', 'middle'],
    lateral: ['wing', 'wing', 'atack', 'corner', 'wing', 'middle', 'wing', 'wing'],
    middle: ['wing', 'attack', 'middle', 'corner', 'middle', 'middle', 'middle', 'middle'],
  }

  switch (gameStats.atkStyle[attackTeam]) {
    case 'mixed':
      return attackCreation(atk, def, possibilities.mixed[getRandomInt(possibilities.mixed.length)], attackTeam)
    case 'lateral':
      return attackCreation(atk, def, possibilities.lateral[getRandomInt(possibilities.lateral.length)], attackTeam)
    case 'middle':
      return attackCreation(atk, def, possibilities.middle[getRandomInt(possibilities.middle.lengt)], attackTeam)
    default:
      return {
        attackingTeam: attackTeam,
        result: 'failed',
        turn,
        info: {
          lastStep: 'atack_didnt_happen',
        }
      }
  }
}

function attackCreation(team, defTeam, area, attackTeam){
  const player = playerSelection(team, area);
  const stealer = playerSelection(defTeam, 'most');
  let attackSuccessRatio = 0;

  switch (player.stats.mental.vision) {
    case 3:
      attackSuccessRatio = 0.6;
      break;
    case 2:
      attackSuccessRatio = 0.5;
      break;
    default:
      attackSuccessRatio = 0.4;
      break;
  }

  switch (player.stats.attack.dribbling) {
    case 3:
      attackSuccessRatio = attackSuccessRatio + 0.2;
      break;
    case 2:
      attackSuccessRatio = attackSuccessRatio + 0.1;
      break;
    default:
      null
      break;
  }

  if(area === 'wing' || area === 'corner'){
    switch (player.stats.base.crossing) {
      case 3:
        attackSuccessRatio = attackSuccessRatio + 0.25;
        break;
      case 1:
        attackSuccessRatio = attackSuccessRatio - 0.1;
        break;
      default:
        attackSuccessRatio = attackSuccessRatio + 0.15;
        break;
    }
  } else {
    switch (player.stats.base.pass) {
      case 3:
        attackSuccessRatio = attackSuccessRatio + 0.25;
        break;
      case 1:
        attackSuccessRatio = attackSuccessRatio - 0.1;
        break;
      default:
        attackSuccessRatio = attackSuccessRatio + 0.15;
        break;
    }
  }

  switch (stealer.stats.defense.marking) {
    case 3:
      attackSuccessRatio = attackSuccessRatio - 0.25;
      break;
    case 2:
      attackSuccessRatio = attackSuccessRatio - 0.15;
      break;
    default:
      attackSuccessRatio = attackSuccessRatio - 0.05;
      break;
  }

  if((attackSuccessRatio * 100) >= getRandomInt(100)){
    const keeper = playerSelection(defTeam, 'keeper');
    const defensor = playerSelection(defTeam, 'defense');
    let defenseSuccessRatio = 0;

    switch (defensor.stats.defense.interceptions) {
      case 3:
        defenseSuccessRatio = defenseSuccessRatio + 0.3;
        break;
      case 2:
        defenseSuccessRatio = defenseSuccessRatio + 0.2;
        break;
      default:
        defenseSuccessRatio = defenseSuccessRatio + 0.1;
        break;
    }

    if((defenseSuccessRatio * 100) >= getRandomInt(100)){
      return {
        attackingTeam: attackTeam,
        result: 'failed',
        turn,
        info: {
          lastStep: 'defensor',
          player: player.name,
          defensor: defensor.name,
          area,
        }
      }
    }

    return finishesTurn(player, defensor, attackTeam, team, keeper, area)
  }

  return {
    attackingTeam: attackTeam,
    result: 'failed',
    turn,
    info: {
      lastStep: 'startedAtk',
      player: player.name,
      stealer: stealer.name,
      area
    }
  }
  
}

function finishesTurn(player, defensor, attackTeam, team, keeper, area){
  const options = ['midfielder', 'wing', 'self', 'attack'];
  const selected = options[getRandomInt(options.length)];
  let finisher = player;
  let goalSuccessRate = 0;

  if(area === 'corner'){
    finisher = playerSelection(team, 'most')
  }

  if (selected !== 'self'){
    finisher = playerSelection(team, 'selected')
  }

  switch (finisher.stats.attack.finishing) {
    case 3:
      goalSuccessRate = goalSuccessRate + 1
      break;
    case 2:
      goalSuccessRate = goalSuccessRate + 0.66
      break;
    default:
      goalSuccessRate = goalSuccessRate + 0.33
      break;
  }

  switch (keeper.stats.goalkeeping.positioning) {
    case 3:
      goalSuccessRate = goalSuccessRate - 0.3
      break;
    case 2:
      goalSuccessRate = goalSuccessRate - 0.15
      break;
    default:
      break;
  }

  switch (keeper.stats.goalkeeping.reflexes) {
    case 3:
      goalSuccessRate = goalSuccessRate - 0.3
      break;
    case 2:
      goalSuccessRate = goalSuccessRate - 0.15
      break;
    default:
      break;
  }
  
  if((goalSuccessRate * 100) >= getRandomInt(100)){
    return {
      attackingTeam: attackTeam,
      result: 'success',
      turn,
      info: {
        lastStep: 'goal',
        kicker: finisher.name,
        player: player.name,
        defensor: defensor.name,
        keeper: keeper.name,
        area
      }
    }
  }

  return {
    attackingTeam: attackTeam,
    result: 'failed',
    turn,
    info: {
      lastStep: 'kick',
      kicker: finisher.name,
      keeper: keeper.name,
      area
    }
  }
}

function playerSelection(team, area){
  let thePlayers = [];

  switch (area) {
    case 'wing':
      thePlayers = [...thePlayers, ...team.filter(players => players.position === 'left_wing_back')];
      thePlayers = [...thePlayers, ...team.filter(players => players.position === 'right_wing_back')];
      thePlayers = [...thePlayers, ...team.filter(players => players.position === 'winger')];
      return thePlayers[getRandomInt(thePlayers.length)]
    case 'attack':
      thePlayers = [...thePlayers, ...team.filter(players => players.position === 'stricker')];
      thePlayers = [...thePlayers, ...team.filter(players => players.position === 'winger')];
      return thePlayers[getRandomInt(thePlayers.length)]
    case 'defense':
      thePlayers = [...thePlayers, ...team.filter(players => players.position === 'left_wing_back')];
      thePlayers = [...thePlayers, ...team.filter(players => players.position === 'right_wing_back')];
      thePlayers = [...thePlayers, ...team.filter(players => players.position === 'center_back')];
      thePlayers = [...thePlayers, ...team.filter(players => players.position === 'center_back')];
      return thePlayers[getRandomInt(thePlayers.length)]
    case 'most':
      thePlayers = [...thePlayers, ...team.filter(players => players.position === 'left_wing_back')];
      thePlayers = [...thePlayers, ...team.filter(players => players.position === 'right_wing_back')];
      thePlayers = [...thePlayers, ...team.filter(players => players.position === 'center_back')];
      thePlayers = [...thePlayers, ...team.filter(players => players.position === 'winger')];
      thePlayers = [...thePlayers, ...team.filter(players => players.position === 'midfielder')];
      return thePlayers[getRandomInt(thePlayers.length)]
    case 'keeper':
      thePlayers = [...team.filter(players => players.position === 'goalkeeper')];
      return thePlayers[0]
    default:
      thePlayers = [...thePlayers, ...team.filter(players => players.position === 'midfielder')];
      return thePlayers[getRandomInt(thePlayers.length)]
  }
}

function calculatePossession(basicTeamsStats){
  const random = Math.random() * (10 - 5) - 2.5;
  let homeTeam = 0;
  let alwayTeam = 0;

  basicTeamsStats.homeTeam.pricePoints >= basicTeamsStats.alwayTeam.pricePoints ? homeTeam ++ : alwayTeam ++;

  basicTeamsStats.homeTeam.defPoints >= basicTeamsStats.alwayTeam.atkPoints ? homeTeam ++ : alwayTeam ++;
  basicTeamsStats.alwayTeam.atkPoints >= basicTeamsStats.homeTeam.defPoints ? alwayTeam ++ : homeTeam ++;

  basicTeamsStats.homeTeam.defPoints >= basicTeamsStats.alwayTeam.defPoints ? homeTeam ++ : alwayTeam ++;

  basicTeamsStats.homeTeam.atkPoints >= basicTeamsStats.alwayTeam.atkPoints ? homeTeam ++ : alwayTeam ++;
  
  basicTeamsStats.homeTeam.pricePoints + basicTeamsStats.homeTeam.defPoints + basicTeamsStats.homeTeam.atkPoints >= basicTeamsStats.alwayTeam.pricePoints + basicTeamsStats.alwayTeam.defPoints + basicTeamsStats.alwayTeam.atkPoints ? homeTeam ++ : alwayTeam ++;
  basicTeamsStats.alwayTeam.pricePoints + basicTeamsStats.alwayTeam.defPoints + basicTeamsStats.alwayTeam.atkPoints >= basicTeamsStats.homeTeam.pricePoints + basicTeamsStats.homeTeam.defPoints + basicTeamsStats.homeTeam.atkPoints ? alwayTeam ++ : homeTeam ++;

  (basicTeamsStats.homeTeam.pricePoints * basicTeamsStats.homeTeam.atkPoints) / basicTeamsStats.alwayTeam.defPoints >= (basicTeamsStats.alwayTeam.pricePoints * basicTeamsStats.alwayTeam.atkPoints) / basicTeamsStats.homeTeam.defPoints ? homeTeam ++ : alwayTeam ++;
  (basicTeamsStats.alwayTeam.pricePoints * basicTeamsStats.alwayTeam.atkPoints) / basicTeamsStats.homeTeam.defPoints >= (basicTeamsStats.homeTeam.pricePoints * basicTeamsStats.homeTeam.atkPoints) / basicTeamsStats.alwayTeam.defPoints ? alwayTeam ++ : homeTeam ++;

  return {
    homeTeam: ((((homeTeam -1) + 6) * 100) / 19) - (random),
    alwayTeam: ((((alwayTeam -1) + 6) * 100) / 19) + (random),
  }

}

function calculateTeamTotalPrice(theTeam, data){
  return data.thePlayers[theTeam].reduce((acc, player) => acc + player.price, 0)
}

function calculateDefensePoints(theTeam, data){
  const defenseTeamGroups = {
    left_wing_back: data.thePlayers[theTeam].filter(players => players.position === 'left_wing_back'),
    right_wing_back: data.thePlayers[theTeam].filter(players => players.position === 'right_wing_back'),
    center_back: data.thePlayers[theTeam].filter(players => players.position === 'center_back'),
    midfielder: data.thePlayers[theTeam].filter(players => players.position === 'midfielder'),
  }
  
  const defenseTeam = [...defenseTeamGroups.left_wing_back, ...defenseTeamGroups.right_wing_back, ...defenseTeamGroups.center_back, ...defenseTeamGroups.midfielder];

  const points = {
    stamina: defenseTeam.reduce((acc, player) => acc + player.stats.base.stamina, 0),
    marking: defenseTeam.reduce((acc, player) => acc + player.stats.defense.marking, 0),
    interceptions: defenseTeam.reduce((acc, player) => acc + player.stats.defense.interceptions, 0),
    pass: defenseTeam.reduce((acc, player) => acc + player.stats.base.pass, 0),
  }
  switch (data.teamData[theTeam].gameMode) {
    case 'normal':
      return (points.stamina + ((points.marking + points.interceptions) * 2.5) + points.pass)
    case 'counter-atk':
      return ((points.stamina * 0.75) + ((points.marking + points.interceptions) * 2.25) + (points.pass * 1.5))
    case 'all-atk':
      return ((points.stamina * 0.75) + ((points.marking + points.interceptions) * 1.75) + points.pass)
    case 'all-def':
      return ((points.stamina * 1.25) + ((points.marking + points.interceptions) * 2.75) + (points.pass * 1.25))
    default:
      return (points.stamina + ((points.marking + points.interceptions) * 2.5) + points.pass)
  }
}

function calculateAttackPoints(theTeam, data){
  const attackTeamGroups = {
    left_wing_back: data.thePlayers[theTeam].filter(players => players.position === 'left_wing_back'),
    right_wing_back: data.thePlayers[theTeam].filter(players => players.position === 'right_wing_back'),
    midfielder: data.thePlayers[theTeam].filter(players => players.position === 'midfielder'),
    winger: data.thePlayers[theTeam].filter(players => players.position === 'winger'),
    stricker: data.thePlayers[theTeam].filter(players => players.position === 'stricker'),
  }
  
  const attackTeam = [...attackTeamGroups.left_wing_back, ...attackTeamGroups.right_wing_back, ...attackTeamGroups.midfielder, ...attackTeamGroups.winger, ...attackTeamGroups.stricker];

  const points = {
    agility: attackTeam.reduce((acc, player) => acc + player.stats.base.stamina, 0),
    pass: attackTeam.reduce((acc, player) => acc + player.stats.base.pass, 0),
    crossing: attackTeam.reduce((acc, player) => acc + player.stats.base.crossing, 0),
    finishing: attackTeam.reduce((acc, player) => acc + player.stats.attack.finishing, 0),
    dribbling: attackTeam.reduce((acc, player) => acc + player.stats.attack.dribbling, 0),
    vision: attackTeam.reduce((acc, player) => acc + player.stats.mental.vision, 0),
  }

  switch (data.teamData[theTeam].gameMode) {
    case 'normal':
      return (points.agility + ((points.pass + points.crossing) * 0.5) + ((points.finishing + points.dribbling + points.vision) * 2))
    case 'counter-atk':
      return ((points.agility * 1.25 ) + ((points.pass + points.crossing) * 0.75) + ((points.finishing + points.dribbling + points.vision) * 1.75))
    case 'all-atk':
      return (points.agility + (points.pass + points.crossing) + ((points.finishing + points.dribbling + points.vision) * 2))
    case 'all-def':
      return (points.agility + ((points.pass + points.crossing) * 0.25) + ((points.finishing + points.dribbling + points.vision) * 1.5))
    default:
      return (points.agility + ((points.pass + points.crossing) * 0.5) + ((points.finishing + points.dribbling + points.vision) * 2))
  }
}