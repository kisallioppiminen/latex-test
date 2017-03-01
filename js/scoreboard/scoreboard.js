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

function createListItem(courseData) {
    var sd = new Date(courseData.startdate);
    var ed = new Date(courseData.enddate);
    var formattedTime = `${sd.getDate()}.${sd.getMonth() + 1}.${sd.getFullYear().toString().substr(2,2)} – ${ed.getDate()}.${ed.getMonth() + 1}-${ed.getFullYear().toString().substr(2,2)}`;
    var html_boilerplate = `<section class="panel panel-courselisting">
        <header>
        <h1 id="courseHeader">${courseData.name}
        </h1>
        <h2 style="display: inline-block; color: #666666">${formattedTime}</h2>
        <h1 style="float: right;">
            <a id="courseHeader${courseData.coursekey}" data-toggle="collapse" class="collapsed" data-target="#checkmarkTable${courseData.coursekey}"></a>
        </h1>
        </header>

        <div id="checkmarkTable${courseData.coursekey}" class="collapse" style="overflow-x:auto;">
            <table id="courseTable${courseData.coursekey}" class="table" ></table>
        </div></section>`;

    console.log(html_boilerplate)

    $(".courseList").append(html_boilerplate);
}

function createCourseList(JSONdata) {
    for (i in JSONdata) {
        createListItem(JSONdata[i]);
    }
}

function getCourses() {
    $.ajax({
        url: BACKEND_BASE_URL + `teachers/${session.getUserId()}/courses`,
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data) {
            createCourseList(data);
        },
        error: function() {
            console.warn("Could not retrieve course keys");
        }
    });
}

/**
 * Execute when DOM has loaded, get teacher's scoreboards
 */
$(document).ready(function() {

    getCourses();

});

