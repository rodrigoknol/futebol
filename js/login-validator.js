async function post(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data
  });
  return await response.json();
}

function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    window.location.replace("/");
  });
}

function isSignedIn(){
  const auth2 = gapi.auth2.getAuthInstance();
  if(!auth2.isSignedIn.get()){
    window.location.replace("/");
  }
}

function onLoad() {
  gapi.load('auth2', function() {
    gapi.auth2.init().then(()=>{isSignedIn()});
  });
}