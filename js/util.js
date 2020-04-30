async function post(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  });
  return await response.json();
}

async function validateLocal() {
  if (!localStorage.getItem("user")) {
    post(
      "/.netlify/functions/get_team_data",
      JSON.stringify({ id: getLoginData("id") })
    ).then((theResponse) => {
      localStorage.setItem("user", JSON.stringify(theResponse.data.playerBase));
      prepare();
    });
  }

  prepare();
}

function success() {
  const successToast = document.createElement("div");
  successToast.classList.add("toast");
  successToast.classList.add("toast--success");
  successToast.innerHTML =
    "<p><strong>Muito bom!</strong><br>Os seus dados estão salvos e em segurança 😉</p>";
  document.body.append(successToast);

  setTimeout(() => {
    successToast.classList.add("util__hidden");
  }, 4000);
}

async function getPlayers(data){
  const theResponse = await post("/.netlify/functions/get_players_data", JSON.stringify(data));
  return theResponse;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}