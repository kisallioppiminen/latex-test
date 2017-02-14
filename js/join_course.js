function sendSignUpJSON(coursekey) {
    $.ajax({
        url: BACKEND_BASE_URL + 'courses/join',
        type : 'POST',
        dataType : 'json',
        contentType: 'application/json',
        data : JSON.stringify(coursekey),
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success : function(data) {
            console.log(data);
        },
        error: function(xhr, resp, text) {
            console.log(xhr, resp, text);
        }
    });
}

$( document ).ready(function() {

    $("#joiningForm").on('submit', function (e) {
        console.log("hehe");
        var data = $(this).serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        sendSignUpJSON(data);
        e.preventDefault();
    });

});