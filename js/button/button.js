function changeProblemHeaderColor(id) {
    var problemID = id.substr(2, id.length - 1);

    // red, yellow, green
    var colors = ["rgb(217, 83, 79)", "rgb(240, 173, 78)", "rgb(92, 184, 92)"];
    var color = colors[id.charAt(0)];

    var header_id = 'div[id="' + problemID + '"]';

    if ( $(header_id + " header ").css("background").includes(color) ) {
        // Fallback to default
        $(header_id + " header ").css({"background" : "background: -webkit-linear-gradient(top, #F9F8F8, #F1F1F1);" +
        "background: -moz-linear-gradient(top, #F9F8F8, #F1F1F1);" +
        "background: -ms-linear-gradient(top, #F9F8F8, #F1F1F1);" +
        "background: -o-linear-gradient(top, #F9F8F8, #F1F1F1);"});
        console.log("Change text");
        var text_id = 'h3[id="textbar_' + id.substr(2,id.length - 1) + '"]';
        $(text_id).html("Miten tehtävä meni?");
    } else {
        $(header_id + " header ").css({"background" : color});
    }


}

function getColorID(status) {
    var colors = { "red": 0, "yellow": 1, "green": 2 };
    return colors[status];
}

function colorCheckmarks(jsonData) {

    for (var problem in jsonData) {
        if (jsonData.hasOwnProperty(problem)) {
            if ($('div[id="' + problem + '"]').length) {
                changeProblemHeaderColor(getColorID(jsonData[problem]) + ";" + problem);
            }
        }
    }

}

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

function changeButtonTitleText(id, message) {
    var text_id = 'h3[id="textbar_' + id + '"]';
    $(text_id).html(message);
}

$(document).ready(function() {
    console.log("Button.js ready");

    // Get checkmarks
    getCheckmarks();

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