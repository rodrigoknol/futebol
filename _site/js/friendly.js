const corinthians = {
  player: "bot",
  team: "Corinthians",
  formation: "4-4-2",
  gameMode: "normal",
  attackStyle: "mixed",
  players: [
    { goalkeeper: "Cássio" },
    { left_wing_back: "Lucas Piton" },
    { right_wing_back: "Fagner" },
    { center_back: "Pedro Henrique" },
    { center_back: "Gil" },
    { midfielder: "Camacho" },
    { midfielder: "Cantillo" },
    { midfielder: "Mateus Vital" },
    { midfielder: "Luan" },
    { stricker: "Vagner Love" },
    { stricker: "Mauro Boselli" },
  ],
};

const palmeiras = {
  player: "bot",
  team: "Palmeiras",
  formation: "4-4-2",
  gameMode: "normal",
  attackStyle: "mixed",
  players: [
    { goalkeeper: "Weverton" },
    { left_wing_back: "Matías Viña" },
    { right_wing_back: "Marcos Rocha" },
    { center_back: "Felipe Melo" },
    { center_back: "Emerson Santos" },
    { midfielder: "Patrick de Paula" },
    { midfielder: "Ramires" },
    { midfielder: "Bruno Henrique Corsini" },
    { midfielder: "Lucas Lima" },
    { winger: "Dudu" },
    { winger: "Wilian Bigode" },
  ],
};

const galaticos = {
  player: "bot",
  team: "Galaticos",
  formation: "4-3-3",
  gameMode: "all-atk",
  attackStyle: "mixed",
  players: [
    { goalkeeper: "Weverton" },
    { left_wing_back: "Filipe Luís" },
    { right_wing_back: "Fagner" },
    { center_back: "Rodrigo Caio" },
    { center_back: "Gil" },
    { midfielder: "Cantillo" },
    { midfielder: "Luan" },
    { midfielder: "Lucas Lima" },
    { winger: "Pedrinho" },
    { winger: "Dudu" },
    { stricker: "Mauro Boselli" },
  ],
};

const pechincha = {
  player: "bot",
  team: "Pechincha FC",
  formation: "3-5-2",
  gameMode: "counter-atk",
  attackStyle: "mixed",
  players: [
    { goalkeeper: "Muralha" },
    { center_back: "Cleberson" },
    { center_back: "Emerson Santos" },
    { center_back: "Bruno Méndez" },
    { midfielder: "Jorginho" },
    { midfielder: "Ramires" },
    { midfielder: "Gabriel" },
    { midfielder: "Mateus Vital" },
    { midfielder: "Patrick de Paula" },
    { stricker: "Ribamar" },
    { winger: "Janderson" },
  ],
};

function prepare(){
  return null
}

function runFriendly(alwayTeam) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const homeTeam = userData.startingTeam;
  const data = { alwayTeam, homeTeam };

  if (homeTeam.players.length === 11) {
    document.body.classList.add("loading");
    return post(
      "/.netlify/functions/save_pre_match_data",
      JSON.stringify(data)
    ).then((theResponse) => {
      const theMatchId = theResponse["@ref"].id;
      window.location.replace(`/match?id=${theMatchId}`);
    });
  }

  if (confirm("Para jogar, você precisa ter um time titular completo escalado.")) {
    window.location.replace(`/manage-team`);
  }
}
