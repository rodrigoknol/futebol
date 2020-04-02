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