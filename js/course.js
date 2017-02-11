// Flatpickr options
flatpickr(".flatpickr", {
    "locale": "fi",
    defaultDate: "a",
    altInput: true,
    altFormat: "F j, Y"
});

function createCoursePost(exercises) {
    var postForm = {
        html_id: data.courseSelect,
        coursekey: data.coursekey,
        name: data.courseName,
        exercises: exercises,
        startdate: data.startDate,
        enddate: data.endDate
    };

    $.ajax({
        url: 'https://pure-inlet-98383.herokuapp.com/courses/newcourse',
        type : "POST",
        dataType : 'json',
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(postForm),
        success : function(data) {
            console.log(data);
        },
        error: function(xhr, resp, text) {
            console.log(xhr, resp, text);
        }
    });
}

function extractExercises(pageData) {
    regex = /(?:id="chapterNumber" value="([0-9])")|(?:<div\s+class="tehtava"\s+id="([a-zA-Z0-9ÅåÄäÖö.;:_-]+)">)/g;
    regex_array = regex.exec(pageData);

    var exercises = {};
    var chapterNumber = 0;
    var exerciseCounter = 1;

    while (regex_array != null) {
        if (regex_array[1] == null) {
            exercises[chapterNumber + "." + exerciseCounter] = regex_array[2];
            exerciseCounter++;
        } else if (regex_array[2] == null) {
            chapterNumber = regex_array[1];
            exerciseCounter = 1;
        }
        regex_array = regex.exec(pageData);
    }
    createCoursePost(exercises);
}

function getCourseExercises(course_id) {
    var course_url = "/kurssit/" + course_id + "/print.html";

    $.ajax({
        url : course_url,
        success : function(result){
            console.log(extractExercises(result));
        },
        error: function() {
            console.log("Could not retrieve course page");
        }
    });

}

$( document ).ready(function() {
    $("form").on('submit', function (e) {
        data = $(this).serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        getCourseExercises(data.courseSelect);
        e.preventDefault();
    });

    $('input').on('input',function(e){
        var b = true;
        if ($("#courseName").val().length == 0) { b = false };
        if ($("#coursekey").val().length == 0) { b = false };
        if ($("#startDate").val().length == 0) { b = false };
        if ($("#endDate").val().length == 0) { b = false };
        if (b) {
            $("#submitCourse").prop("disabled", false);
            $(".validationMessage").hide();
        } else {
            $("#submitCourse").prop("disabled", true);
            $(".validationMessage").show();
        }
    });

});