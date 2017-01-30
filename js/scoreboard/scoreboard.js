$( document ).ready(function() {

    console.log("Scoreboard.js loaded");

    var coursesJSON = $.parseJSON(
        $.ajax({
            url: 'https://pure-inlet-98383.herokuapp.com/course/1/checkmarks',
            async: false,
            dataType: 'json',
        }).responseText
    );

    console.log(coursesJSON);

    var courseName = "maa1";
    var rows = '';
    rows += '<tr class="success"><th></th>';
    Object.keys(coursesJSON[courseName]["john"]).forEach(function(exerciseName) {
        rows += '<th>' + exerciseName + '</th>';
    });

    rows += '</tr>';
    Object.keys(coursesJSON[courseName]).forEach(function(studentName) {
        rows += '<tr id = "row' + studentName + '">' +
            '<td>' + studentName + '</td>';
        Object.entries(coursesJSON[courseName][studentName]).forEach(
            ([key, value]) => rows += '<td style="background-color:' + value + '">' + value + '</td>'
        );
        '</tr>';
    });

    document.getElementById( 'courseHeader1').innerHTML = courseName;
    document.getElementById( 'table' ).innerHTML = rows;

});

