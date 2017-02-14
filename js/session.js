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
    var LOGGEDIN = document.getElementsByClassName("logged-in");
    var LOGGEDOUT = document.getElementsByClassName("logged-out");

    if (session_user.has_sign_in == null) {
			for(i=0; i<LOGGEDOUT.length; i++) {
				LOGGEDOUT[i].style.display = 'initial';
			}
    } else {
			for(i=0; i<LOGGEDIN.length; i++) {
				LOGGEDIN[i].style.display = 'initial';
			}
    }
    console.log(session_user.has_sign_in) // for debugging
}

req.open("GET", BACKEND_BASE_URL + "user/get_session_user", true);
req.withCredentials = true;
req.send();
