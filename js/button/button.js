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

$( document ).ready(function() {
    console.log( "Button.js ready" );
    $('.problemButton').click(function() {
        console.log("Button " + this.id + " pressed.");
        /* Send POST request here */
        var stats = ["red", "yellow", "green"];

        var checkmark = {
            user_id: 1,
            html_id: this.id.substr(2, this.id.length - 1),
            status: stats[this.id.charAt(0)],
            coursekey: "coursekey1"
        };

        $.ajax({
            url: 'https://pure-inlet-98383.herokuapp.com/checkmarks',
            type : "POST",
            dataType : 'json',
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(checkmark),
            success : function() {
                console.log("OK!");
            },
            error: function(xhr, resp, text) {
                console.log(xhr, resp, text);
            }
        });

        /* Change button title text */
        var text_id = 'h3[id="textbar_' + this.id.substr(2,this.id.length - 1) + '"]';
        $(text_id).html("Vastauksesi on lähetetty!");

        /* Change problem header color */
        changeProblemHeaderColor(this.id);
    });
});