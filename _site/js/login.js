async function post(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data
  });
  return await response.json();
}

function onSignIn(googleUser) {
  const profile = googleUser.getBasicProfile();
  const id_token = googleUser.getAuthResponse().id_token;
  const data = {
    id_token,
    id: profile.getId(),
    name: profile.getName(),
    email: profile.getEmail(),
  }

  post(
    "/.netlify/functions/login",
    JSON.stringify(data)
  ).then(returnedData => {redirectUser(returnedData)});
}

function redirectUser(data){
  if (data.status === 'error'){
    return signOut()
  }

  switch (data.message) {
    case 'user registered':
      window.location.replace("/manage-team");
      break;
    case 'new user':
      window.location.replace("/register")
      break;
    default:
      window.location.replace("/manage-team");
      break;
  }
}

function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}