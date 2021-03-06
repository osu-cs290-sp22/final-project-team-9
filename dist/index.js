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

// Playlists takes in an array of playlists in a Spotify request format
function InsertBubbles(playlists, url = "/next?id=") {
    var outerEl = document.getElementById("right");
    var row = Math.floor(outerEl.offsetHeight / 220);
    var col = Math.ceil(outerEl.offsetWidth / 220);
    var numElements = (row * col);

    for (let i = 0; i < playlists.length; i++) {
        if (playlists[i].tracks.total == 0) {
            continue;
        }
        const element = Handlebars.templates['bubble.hbs']({
            title: playlists[i].name,
            imageSrc: (playlists[i].images[0]) ? playlists[i].images[0].url : "",
            id: url + playlists[i].id,
            lazy: (i >= numElements) ? "lazy" : "eager",
        });
        document.getElementById('right').insertAdjacentHTML('beforeend', element);

    }
}

window.onload = function() {
    var buttons = document.getElementsByClassName("item"),
        len = buttons !== null ? buttons.length : 0,
        i = 0;
    for (i; i < len; i++) {
        buttons[i].className += " item-transition";
    }
}

function animateLoad() {
    var outerEl = document.getElementById("right");
    var row = Math.floor(outerEl.offsetHeight / 220);
    var col = Math.ceil(outerEl.offsetWidth / 220);
    var numElements = (row * col);

    for (var i = 0; i < numElements; i++) {
        const element = Handlebars.templates['placeholder.hbs']();
        document.getElementById('right').insertAdjacentHTML('beforeend', element);
    }

    var innerEls = document.getElementsByClassName("placeholder");

    if (row > 1 && col > 1) {
        // Create 2D array computed grid
        let matrix = [...Array(row)].map(e => Array());
        for (var i = 0; i < col; i++) {
            for (var j = 0; j < row; j++) {
                if (innerEls[(row * i) + (j)]) {
                    matrix[j].push(innerEls[(row * i) + (j)]);
                } else {
                    matrix[j].push(null);
                }
            }
        }
        // Calculate diagonal lines from matrix
        let diags = [...Array(row + col - 1)].map(e => Array());
        for (let line = 1; line <= (row + col - 1); line++) {
            let start_col = Math.max(0, line - row);
            let count = Math.min(line, (col - start_col), row);

            for (let j = 0; j < count; j++) {
                if (matrix[Math.min(row, line) - j - 1]) {
                    diags[line - 1].push(matrix[Math.min(row, line) - j - 1][start_col + j])
                }
            }
        }
        // Apply increasing animation delay to each subsequent diagonal line
        for (var i = 0; i < diags.length; i++) {
            diags[i].forEach(el => {
                if (el != null) {
                    el.style["-webkit-animation"] = "loadanimation " + (1000 + (500 * (i + 1))) + "ms linear infinite";
                    el.style["animation"] = "loadanimation " + (1000 + (500 * (i + 1))) + "ms linear infinite";
                }
            })
        }
    }
}

function animateFlex(elClass, wrapper) {
    // Store elements to variables
    var innerEls = document.getElementsByClassName(elClass);
    var outerEl = document.getElementById(wrapper);

    // Compute visible height of inner element
    var styles = window.getComputedStyle(innerEls[0]);
    var margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);

    // Compute rows and columns in grid
    var row = Math.floor(outerEl.offsetHeight / Math.ceil(innerEls[0].offsetHeight + margin))
    var col = Math.ceil(innerEls.length / row)

    // Don't animate if Array is 1D
    if (row > 1 && col > 1) {
        // Create 2D array computed grid
        let matrix = [...Array(row)].map(e => Array());
        for (var i = 0; i < col; i++) {
            for (var j = 0; j < row; j++) {
                if (innerEls[(row * i) + (j)]) {
                    matrix[j].push(innerEls[(row * i) + (j)]);
                } else {
                    matrix[j].push(null);
                }
            }
        }
        // Calculate diagonal lines from matrix
        let diags = [...Array(row + col - 1)].map(e => Array());
        for (let line = 1; line <= (row + col - 1); line++) {
            let start_col = Math.max(0, line - row);
            let count = Math.min(line, (col - start_col), row);

            for (let j = 0; j < count; j++) {
                if (matrix[Math.min(row, line) - j - 1]) {
                    diags[line - 1].push(matrix[Math.min(row, line) - j - 1][start_col + j])
                }
            }
        }
        // Apply increasing animation delay to each subsequent diagonal line
        for (var i = 0; i < diags.length; i++) {
            diags[i].forEach(el => {
                if (el != null) {
                    el.style["-webkit-animation"] = "animation " + (1000 + (500 * (i + 1))) + "ms linear both";
                    el.style["animation"] = "animation " + (1000 + (500 * (i + 1))) + "ms linear both";
                }
            })
        }
    }
}

function scrollOut() {
    document.getElementById('right').classList = "animate__animated animate__fadeOutUp";
    document.getElementById('right').style["overflow-x"] = "hidden";
    document.getElementById('left').classList = "animate__animated animate__fadeOutUp";
}

function scrollIn() {
    document.getElementById('right').classList = "animate__animated animate__fadeInUp";
    document.getElementById('right').style["overflow-x"] = "hidden";
    document.getElementById('left').classList = "animate__animated animate__fadeInUp";
}

function filterBubbles(query) {
    var container = document.getElementById('right');
    var items = container.querySelectorAll('.bubble');
    for (var i = 0; i < items.length; i++) {
        if (items[i].innerHTML.toLowerCase().indexOf(query.toLowerCase()) > -1) {
            items[i].style.display = "";
        } else {
            items[i].style.display = "none";
        }
    }
}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function(item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

function scrollHandler(evt) {
    evt.preventDefault();
    scrollContainer.scrollLeft += evt.deltaY;
    scrollContainer.scrollLeft += evt.deltaX;
};