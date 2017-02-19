function getColor(color) {
    var colors = {"red": "rgb(217, 83, 79)", "yellow": "rgb(240, 173, 78)", "green": "rgb(92, 184, 92)" };
    return colors[color];
}

function createTable(exercises, coursesJSON) {
    var courseName = "maa3";

    console.log(exercises);

    var rows = '';
    rows += '<tr><th>Oppilas</th>';

    for (var problem in coursesJSON[Object.keys(coursesJSON)[0]]) {
        rows += '<th>' + exercises[problem]; + '</th>';
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

    document.getElementById( 'courseHeader').innerHTML = courseName.toUpperCase();
    document.getElementById( 'courseTable' ).innerHTML = rows;
}

function getExerciseNumbers(pageData, data) {
    var regex = /(?:id="chapterNumber" value="([0-9])")|(?:<div\s+class="tehtava"\s+id="([a-zA-Z0-9ÅåÄäÖö.;:_-]+)">)/g;
    var regex_array = regex.exec(pageData);

    var exercises = {};
    var chapterNumber = 0;
    var exerciseCounter = 1;

    while (regex_array != null) {
        if (regex_array[1] == null) {
            exercises[regex_array[2]] = chapterNumber + "." + exerciseCounter;
            exerciseCounter++;
        } else if (regex_array[2] == null) {
            chapterNumber = regex_array[1];
            exerciseCounter = 1;
        }
        regex_array = regex.exec(pageData);
    }
    createTable(exercises, data);
}

function generateExerciseNumbers(course_id, data) {
    var course_url = "/kurssit/" + course_id + "/print.html";

    $.ajax({
        url : course_url,
        success : function(result){
            getExerciseNumbers(result, data);
        },
        error: function() {
            console.log("Could not retrieve course page");
        }
    });

}

function createTables(data) {
    // Hardcoded, only creates one table for now
    var courseJSON = data.geometriatestiavain;
    generateExerciseNumbers("maa3", courseJSON);
}

$(document).ready(function() {

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
            createTables(data);
        },
    });

});

