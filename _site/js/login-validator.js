function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    window.location.replace("/");
  });
}

function getLoginData(type) {
  const googleAuth = gapi.auth2.getAuthInstance();
  const user = googleAuth.currentUser.get();
  const profile = user.getBasicProfile();

  switch (type) {
    case 'id':
      return profile.getId();
    default:
      return profile.getGivenName()
  } 
}

function redirector(){
  const toRedirect = sessionStorage.getItem("pageToRedirect");
  if (toRedirect) {
    sessionStorage.removeItem("pageToRedirect");
    window.location.href = toRedirect;
  }
}

function isSignedIn(){
  const auth2 = gapi.auth2.getAuthInstance();
  if(!auth2.isSignedIn.get()){
    sessionStorage.setItem("pageToRedirect", document.location.href);
    return window.location.replace("/");
  }
  
  redirector()

  return validateLocal()
}

function onLoad() {
  gapi.load('auth2', function() {
    gapi.auth2.init().then(()=>{isSignedIn()});
  });
}