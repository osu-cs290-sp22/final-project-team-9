function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
if (getCookie("spToken") != "") {
    document.getElementById("loginButton").innerHTML = "Logout";
    document.getElementById("loginButton").href = "/logout";
} else {
    document.getElementById("loginButton").innerHTML = "Login";
    document.getElementById("loginButton").href = "/auth";

}