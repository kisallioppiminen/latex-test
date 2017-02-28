/**
 * Changes exercise header color based on color and exercise ID.
 * @param id {String} 'COLOR_ID;EXERCISE_ID' for example '0;e56f54a7-3619-4cf8-bb6c-00ab8243b818'
 */
function changeProblemHeaderColor(id) {
    var problemID = id.substr(2, id.length - 1);

    // RGB values for red, yellow and green
    var colors = ["rgb(217, 83, 79)", "rgb(240, 173, 78)", "rgb(92, 184, 92)"];
    var color = colors[id.charAt(0)];

    var header_id = 'div[id="' + problemID + '"]';

    // Fallback to default gray if same button is pressed again
    if ($(header_id + " header").css("background").includes(color) ) {
        $(header_id + " header ").css({"background" : "background: -webkit-linear-gradient(top, #F9F8F8, #F1F1F1);" +
        "background: -moz-linear-gradient(top, #F9F8F8, #F1F1F1);" +
        "background: -ms-linear-gradient(top, #F9F8F8, #F1F1F1);" +
        "background: -o-linear-gradient(top, #F9F8F8, #F1F1F1);"});
        var text_id = 'h3[id="textbar_' + id.substr(2,id.length - 1) + '"]';
        // Restore text
        $(text_id).html("Miten tehtävä meni?");
    } else {
        $(header_id + " header").css({"background" : color});
    }
}

/**
 * Returns integer based on input color
 * @param status {String} color (red, yellow, green)
 * @returns {Integer} (0: red, 1: yellow, 2: green)
 */
function getColorID(status) {
    var colors = { "red": 0, "yellow": 1, "green": 2 };
    return colors[status];
}

/**
 * Colors headers for exercises student has already submitted
 * @param jsonData
 */
function colorCheckmarks(jsonData) {
    for (var problem in jsonData) {
        if (jsonData.hasOwnProperty(problem)) {
            if ($('div[id="' + problem + '"]').length) {
                changeProblemHeaderColor(getColorID(jsonData[problem]) + ";" + problem);
            }
        }
    }
}

/**
 * Requests student's checkmarks and proceeds to color them if request is successful.
 */
function getCheckmarks() {
    var student_id = 1;
    var course_id = 6; // HARDCODED
    var restfulUrl = BACKEND_BASE_URL + `students/${student_id}/courses/${course_id}/checkmarks`;

    $.ajax({
        url: restfulUrl,
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data) {
            colorCheckmarks(data);
        },
        error: function(data) {
            console.warn("Could not retrieve checkmarks. Message: " + JSON.parse(data.responseText).error);
        }
    });
}

/**
 * Changes button title text
 * @param id {String} exercise ID, for example 'e56f54a7-3619-4cf8-bb6c-00ab8243b818'
 * @param message {String} message to be displayed
 */
function changeButtonTitleText(id, message) {
    var text_id = 'h3[id="textbar_' + id + '"]';
    $(text_id).html(message);
}

/**
 * Execute when DOM has loaded
 */
$(document).ready(function() {

    // Get checkmarks
    getCheckmarks();

    // Triggers when student sends a checkmark
    $('.problemButton').click(function() {
        var problemId = this.id;

        var stats = ["red", "yellow", "green"];

        var checkmark = {
            html_id: this.id.substr(2, this.id.length - 1),
            status: stats[this.id.charAt(0)],
            coursekey: "geometriatestiavain" // HARDCODED
        };

        $.ajax({
            url: BACKEND_BASE_URL+ 'checkmarks',
            type : 'POST',
            dataType : 'json',
            contentType: 'application/json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data : JSON.stringify(checkmark),
            success : function() {
                console.log("OK!");
                changeButtonTitleText(problemId.substr(2,problemId.length - 1), "Vastauksesi on lähetetty!");
                changeProblemHeaderColor(problemId);
            },
            error: function(data) {
                changeButtonTitleText(problemId.substr(2,problemId.length - 1), "Virhe! " + JSON.parse(data.responseText).error);
            }
        });
    });
});