/**
 * Returns RGB value for color
 * @param color {String} "red", "yellow" or "green"
 * @returns {String} RGB value for input color
 */
function getColor(color) {
    var colors = {"red": "rgb(217, 83, 79)", "yellow": "rgb(240, 173, 78)", "green": "rgb(92, 184, 92)" };
    return colors[color];
}

/**
 * Creates HTML table from exercises and course data
 * @param exercises {Object} Exercises and their corresponsing IDs
 * @param coursesJSON {JSON} Course data
 */
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

/**
 * Connects exercise IDs to exercise numbers
 * @param pageData
 * @param data
 */
function getExerciseNumbers(pageData, data) {
    // Match either chapter number or exercise ID
    var regex = /(?:id="chapterNumber" value="([0-9])")|(?:<div\s+class="tehtava"\s+id="([a-zA-Z0-9ÅåÄäÖö.;:_-]+)">)/g;
    var regex_array = regex.exec(pageData);

    // Initialize variables
    var exercises = {};
    var chapterNumber = 0;
    var exerciseCounter = 1;

    // While matches are found
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

/**
 * Gets print.html page as raw HTML data
 * @param course_id {String} html_id, for example 'may1'
 * @param data JSON data
 */
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

/**
 * Creates groups of tables
 * @param data {JSON}
 */
function createTables(data) {
    // Hardcoded, only creates one table for now

    generateExerciseNumbers("maa3", courseJSON);
}

/**
 * Execute when DOM has loaded, get teacher's scoreboards
 */
$(document).ready(function() {
    $.ajax({
        url: BACKEND_BASE_URL + `teachers/${session.getUserId()}/scoreboards`,
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

