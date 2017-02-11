const BACKEND_BASE_URL = "http://localhost:3000/"
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

// Don't need async, could be in seperate file?

function logout() {

  // const deleteURL = BACKEND_BASE_URL + "users/sign_out"

  // $.ajax({
  //     url: deleteURL,
  //     type: 'DELETE',
  //     success: function(result) {
  //       console.log("Are we logged out?" + result)
  //     }
  //     error: function(err) {
  //       console.log("We got some err" + err)
  //     }
  // });

  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState !== this.DONE) {
      console.log("state " + req.readyState);
      return false;
    }
    if (req.status !== 200) {
      console.log("status " + req.status);
      return false;
    }
    if (req.status === 204) {
      console.log("status " + req.status);
      console.log("Loggin user out!")
      return false;
    }
    console.log("Logging out!")
  }
  req.open("DELETE", BACKEND_BASE_URL + "users/sign_out", true);
  // /users/sign_out(.:format) 
  req.withCredentials = true;
  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  req.send();
}

function login() {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState !== this.DONE) {
      console.log("state " + req.readyState);
      return false;
    }
    if (req.status !== 200) {
      console.log("status " + req.status);
      return false;
    }
    console.log("Pass to the loggin!")
  }
  req.open("POST", BACKEND_BASE_URL + "users/sign_in", true);
  // /users/sign_out(.:format) 
  req.withCredentials = true;
  req.send();
}



