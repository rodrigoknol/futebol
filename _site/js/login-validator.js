function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    window.location.replace("/");
  });
}

function getLoginId() {
  const googleAuth = gapi.auth2.getAuthInstance();
  const user = googleAuth.currentUser.get();
  const profile = user.getBasicProfile();

  return profile.getId();
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