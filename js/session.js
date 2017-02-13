const BACKEND_BASE_URL = "https://pure-inlet-98383.herokuapp.com/"
var session_user;

var req = new XMLHttpRequest();

req.onreadystatechange = function() {
    if (req.readyState !== this.DONE) {
        return false;
    }
    if (req.status !== 200) {
        return false;
    }

    session_user = JSON.parse(req.responseText);
    const KIRJAUTUMINEN = document.getElementById("kirjautuminen");
    const LOGOUT = document.getElementById("logout");

    if (session_user.has_sign_in == null) {
      KIRJAUTUMINEN.style.display = "initial"
    } else {
      LOGOUT.style.display = "initial"
    }
    console.log(session_user.has_sign_in) // for debugging
}

req.open("GET", BACKEND_BASE_URL + "user/get_session_user", true);
req.withCredentials = true;
req.send();
