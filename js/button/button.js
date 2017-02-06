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
    var stats = ["red", "yellow", "green"];
    for (var i = 0; i < stats.length; i++) {
        if (stats[i] == status) {
            return i;
        }
    }
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
    var course_id = 1;
    // ES6
    var restfulUrl = `https://pure-inlet-98383.herokuapp.com/students/${student_id}/courses/${course_id}/checkmarks`;

    $.ajax({
        url: restfulUrl,
        dataType: 'json',
        success: function(data) {
            colorCheckmarks(data);
        },
        error: function(xhr, resp, text) {
            console.log("Error");
            console.log(xhr, resp, text);
        }
    });
}

function changeButtonTitleText(id, message) {
    var text_id = 'h3[id="textbar_' + id + '"]';
    $(text_id).html(message);
}

$( document ).ready(function() {
    console.log( "Button.js ready" );

    // Get checkmarks
    getCheckmarks();

    $('.problemButton').click(function() {
        var problemId = this.id;
        console.log("Button " + this.id + " pressed.");
        /* Send POST request here */
        var stats = ["red", "yellow", "green"];

        var checkmark = {
            user_id: 1,
            html_id: this.id.substr(2, this.id.length - 1),
            status: stats[this.id.charAt(0)],
            coursekey: "testikurssiavain"
        };

        $.ajax({
            url: 'https://pure-inlet-98383.herokuapp.com/checkmarks',
            type : "POST",
            dataType : 'json',
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(checkmark),
            success : function() {
                console.log("OK!");
                changeButtonTitleText(problemId.substr(2,problemId.length - 1), "Vastauksesi on lähetetty!");
                changeProblemHeaderColor(problemId);
            },
            error: function(xhr, resp, text) {
                console.log(xhr, resp, text);
                changeButtonTitleText(problemId.substr(2,problemId.length - 1), "Virhe! Vastausta ei lähetetty!");
            }
        });
    });
});