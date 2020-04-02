const theForm = document.getElementById("form");
theForm.addEventListener("submit", e => {
  submitForm(e);
});

async function post(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data
  });
  return await response.json();
}

function submitForm(e) {
  e.preventDefault();
  const theInput = document.getElementById('team');
  const authData = getBasicData();
  const thePost = {
    team: theInput.value,
    id: authData.id
  }
  
  post(
    "/.netlify/functions/add-team-name",
    JSON.stringify(thePost)
  ).then(data => {
    if(data.result === 'success'){
      window.location.replace("/manage-team");
    } else {
      window.location.replace("/");
    }
  });
}

function printUserName() {
  const data = getBasicData();
  document.getElementById("name").innerText = data.name;
}

function getBasicData() {
  const googleAuth = gapi.auth2.getAuthInstance();
  const user = googleAuth.currentUser.get();
  const profile = user.getBasicProfile();

  return {
    name: profile.getGivenName(),
    id: profile.getId()
  };
}

function onLoad() {
  gapi.load("auth2", function() {
    gapi.auth2.init().then(() => printUserName());
  });
}
