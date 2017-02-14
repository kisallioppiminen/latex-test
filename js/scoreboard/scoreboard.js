$( document ).ready(function() {

    function getColor(color) {
        switch (color) {
            case "red":
                return 'rgb(217, 83, 79)'; break;
            case "yellow":
                return 'rgb(240, 173, 78)'; break;
            case "green":
                return 'rgb(92, 184, 92)'; break;
        }
    }

    function getProblemName(id) {
        var array = id.split(";");
        return array[1];
    }

    // Creates tables
    function createTable(coursesJSON) {
        var courseName = "maa1";
        var rows = '';
        rows += '<tr><th>Oppilas</th>';

        for (var problem in coursesJSON[Object.keys(coursesJSON)[0]]) {
            rows += '<th>' + getProblemName(problem) + '</th>';
        }
        rows += '</tr>';

        Object.keys(coursesJSON).forEach(function(studentName) {
            rows += '<tr id = "row' + studentName + '">' +
                '<td>' + studentName + '</td>';

            var problems = coursesJSON[studentName];
            for (var key in problems) {
                var value = problems[key];
                if (value == "grey") {
                    rows += '<td style="font-size:150%;font-weight:bold;color:' + value + ';">&#10007;</td>'
                } else {
                    rows += '<td style="font-size:150%;font-weight:bold;color:' + getColor(value) + ';">&#10004;</td>'
                }
            }

            '</tr>';
        });

        document.getElementById( 'courseHeader').innerHTML = courseName;
        document.getElementById( 'courseTable' ).innerHTML = rows;
    }

    // GET happens here
    $.ajax({
        url: BACKEND_BASE_URL + '/courses/scoreboards',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data) {
            console.log(data);
            createTable(data);
        },
    });

});

