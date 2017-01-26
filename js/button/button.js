$( document ).ready(function() {
    console.log( "Button.js ready" );
    $('.problemButton').click(function() {
        console.log("Button " + this.id + " pressed.");
        /*  Send POST request here */

        /* Change button title text */
        var text_id = 'h3[id="textbar_' + this.id.substr(2,this.id.length - 1) + '"]';
        $(text_id).html("Vastauksesi on lähetetty!");
    });
});

