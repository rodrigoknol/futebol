const corinthians = {
  player: "Tiago Nunes",
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

function runFriendly(alwayTeam) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const homeTeam = userData.startingTeam;
  const data = { alwayTeam, homeTeam };

  if (homeTeam.players.length === 11) {
    return post(
      "/.netlify/functions/save_pre_match_data",
      JSON.stringify(data)
    ).then((theResponse) => {
      const theMatchId = theResponse["@ref"].id;
      window.location.replace(`/match?id=${theMatchId}`);
    });
  }

  document.body.classList.add("loading");

  if (confirm("Para jogar, você precisa ter um time titular completo escalado.")) {
    window.location.replace(`/manage-team`);
  }
}
