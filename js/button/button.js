function changeProblemHeaderColor(id) {
    var problemID = id.substr(2, id.length - 1);
    var colors = ["#d9534f", "#f0ad4e", "#5cb85c"];

    var header_id = 'div[id="' + problemID + '"]';

    $(header_id + " header ").css({"background" : colors[id.charAt(0)]});
}

$( document ).ready(function() {
    console.log( "Button.js ready" );
    $('.problemButton').click(function() {
        console.log("Button " + this.id + " pressed.");
        /*  Send POST request here */

        /* Change button title text */
        var text_id = 'h3[id="textbar_' + this.id.substr(2,this.id.length - 1) + '"]';
        $(text_id).html("Vastauksesi on lähetetty!");

        changeProblemHeaderColor(this.id);
    });
});

