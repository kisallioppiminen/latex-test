$( document ).ready(function() {
    console.log( "Button.js ready" );
    $('.problemButton').click(function() {
        console.log("Button " + this.id + " pressed.");
        /*  Send POST to server */
    });
});

