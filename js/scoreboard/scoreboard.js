$( document ).ready(function() {

    // Creates tables
    function createTable(coursesJSON) {
        var courseName = "maa1";
        var rows = '';
        rows += '<tr><th></th>';
        Object.keys(coursesJSON[courseName]["john"]).forEach(function(exerciseName) {
            rows += '<th>' + exerciseName + '</th>';
        });

        rows += '</tr>';
        Object.keys(coursesJSON[courseName]).forEach(function(studentName) {
            rows += '<tr id = "row' + studentName + '">' +
                '<td>' + studentName + '</td>';

            var problems = coursesJSON[courseName][studentName];
            for (var key in problems) {
                var value = problems[key];
                rows += '<td style="background-color:' + value + '">' + value + '</td>'
            }

            '</tr>';
        });

        document.getElementById( 'courseHeader').innerHTML = courseName;
        document.getElementById( 'courseTable' ).innerHTML = rows;
    }

    // GET happens here
    $.ajax({
        url: 'https://pure-inlet-98383.herokuapp.com/course/1/checkmarks',
        dataType: 'json',
        success: function(data) {
            createTable(data);
        },
    });

});

