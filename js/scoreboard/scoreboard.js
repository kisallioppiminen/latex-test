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
function createTable(courseData) {
    console.log(courseData);
    var table = '<table class="scoreboard"><th class="nameColumn"></th>';

    for (var i in exercises) {
        var exercise = exercises[i];
        table += '<th class="numberHeader">' + exercise.number + '</th>';
    }

    table += '</tr><tr>';

    for (var j in courseData) {
        student = courseData[j];
        table += '<td class="name">' + student.user + '</td>';
        for (var k in student.exercises) {
            correct_exercise = exercises[k];
            exercise = student.exercises.filter(function(obj) {
                return obj.id == correct_exercise.id;
            });
            table += '<td id="status"><div class="' + exercise[0].status + '" data-toggle="tooltip" title="' + student.user + " - " + correct_exercise.number + '"></div></td>';
        }
        table += '</tr><tr>';
    }

    table += '</table>';

    $('div[id=checkmarkTable' + table_id + ']').html(table);

    var alertID = "#loadingAlert" + course.coursekey;
    $(alertID).hide();

    $('[data-toggle="tooltip"]').tooltip(); 
}

/**
 * Connects exercise IDs to exercise numbers
 * @param pageData
 * @param data
 */
function getExerciseNumbers(pageData) {
    // Match either chapter number or exercise ID
    var regex = /(?:id="chapterNumber" value="([0-9])")|(?:<div\s+class="tehtava"\s+id="([a-zA-Z0-9ÅåÄäÖö.;:_-]+)">)/g;
    var regex_array = regex.exec(pageData);

    // Initialize variables
    exercises = [];
    var chapterNumber = 0;
    var exerciseCounter = 1;

    // While matches are found
    while (regex_array != null) {
        if (regex_array[1] == null) {
            exercises.push({
                id: regex_array[2],
                number: chapterNumber + "." + exerciseCounter
            });
            exerciseCounter++;
        } else if (regex_array[2] == null) {
            chapterNumber = regex_array[1];
            exerciseCounter = 1;
        }
        regex_array = regex.exec(pageData);
    }
}

/**
 * Gets print.html page as raw HTML data
 * @param course_id {String} html_id, for example 'may1'
 * @param data JSON data
 */
function generateExerciseNumbers(course_id) {
    return $.ajax({
        url : `/kurssit/${course_id}/print.html`,
        success : function(result){
            return getExerciseNumbers(result);
        },
        error: function() {
            console.log("Could not retrieve course page");
        }
    });
}

/**
 * Gets scoreboard JSON data
 * @param  {Integer} id Course ID
 */
function getScoreboard(id) {
    return $.ajax({
        url: BACKEND_BASE_URL + `courses/${id}/scoreboard`,
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true
    })
    .done(function(e) {
        students = e.students;
    });
}

/**
 * Loads scoreboard
 * @param  {String} coursekey course key of current course
 */
function loadScoreboard(coursekey) {
    table_id = coursekey;
    for (i in courseData) {
        if (courseData[i].coursekey == coursekey) {
            course = courseData[i];
            generateExerciseNumbers(courseData[i].html_id).done(function() {
                html_id = courseData[i].html_id;
                course_id = courseData[i].id;
                getScoreboard(course_id).done(function() {
                    console.log(students);
                    createTable(students);
                });
            });
            break;
        }
    }
}

/**
 * Creates a collapsible list item (for course)
 * @param  {JSON} courseData course data
 */
function createListItem(courseData) {
    var sd = new Date(courseData.startdate);
    var ed = new Date(courseData.enddate);
    var formattedTime = `${sd.getDate()}.${sd.getMonth() + 1}.${sd.getFullYear().toString().substr(2,2)} – ${ed.getDate()}.${ed.getMonth() + 1}-${ed.getFullYear().toString().substr(2,2)}`;
    var html_boilerplate = `<section class="panel panel-courselisting">
        <header>
        <h1>${courseData.name}
        </h1>
        <h2 style="display: inline-block; color: #666666">${formattedTime}</h2>
        <h1 style="float: right;">
            <a id="${courseData.coursekey}" data-toggle="collapse" class="collapsed" data-target="#checkmarkTable${courseData.coursekey}"></a>
        </h1>
        </header>

        <div id="checkmarkTable${courseData.coursekey}" class="collapse" style="overflow-x:auto;">
            <div class="alert alert-info" id="loadingAlert${courseData.coursekey}">
                <strong>Ladataan tulostaulua...</strong>
            </div>
        </div></section>`;

    $(".courseList").append(html_boilerplate);
}

/**
 * Creates course list from JSON data
 * @param  {JSON} JSONdata course data in JSON
 */
function createCourseList(JSONdata) {
    for (i in JSONdata) {
        createListItem(JSONdata[i]);
    }
    // place a listener when collapse is opened
    $('header h1 a').click(function() {
        loadScoreboard(this.id);
    });

}

/**
 * Execute when DOM has loaded, get teacher's scoreboards
 */
$(document).ready(function() {
    console.log('scoreboard.js loaded');
    $.ajax({
        url: BACKEND_BASE_URL + `teachers/${session.getUserId()}/courses`,
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data) {
            courseData = data;
            createCourseList(data);
        },
        error: function() {
            console.warn("Could not retrieve course keys");
        }
    });

});

