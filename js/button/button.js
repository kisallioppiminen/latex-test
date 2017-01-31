function changeProblemHeaderColor(id) {
    var problemID = id.substr(2, id.length - 1);

    // red, yellow, green
    var colors = ["#d9534f", "#f0ad4e", "#5cb85c"];

    var header_id = 'div[id="' + problemID + '"]';
    $(header_id + " header ").css({"background" : colors[id.charAt(0)]});
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