var SITE = {
    init: function() {
        SITE.initToc();
    },
    initToc: function() {
        $(".tehtava").each(function(index, value) {
            if ($('#chapterNumber').val() == null) {
                var chNumber = "";
            } else {
                var chNumber = parseInt($('#chapterNumber').val());
            }
            
            var exCount = (index + 1);
            var problemNumber = chNumber + "." + exCount;
            var exName = "Tehtävä " + problemNumber + ": " + $(value).find("h1 a").text();

             // add assignments to toc 
//            $("#tehtavat-toc").append("<li><a data-toggle='collapse' href='" + $(value).find("h1 a").attr("href") + "'>" + exName + "</a></li>");

            // add links to assignment names
//            $(value).attr("id", $(value).find("h1 a").attr("href").substring(1) + "-ex");


            // relabel assignments
            $(value).find("header h1 a").text(exName);

            // Problem ID
            /*var problemID = this.id;

            if (session.getUserId() !== undefined) {
                // Insert button group here
                var $input = $('<div class="problemButtonWrap"><h3 id="textbar_' + problemID + '">Miten tehtävä meni?</h3><div class="btn-group btn-group"><button data-toggle="tooltip" title="En osannut tehtävää. Tarvitsen apua." class="problemButton btn btn-danger btn-primary" id=' + "0;" + problemID + '><img class="face" src="/img/faces/sad.svg"></button>'
                        + '<button data-toggle="tooltip" title="Ratkaisin tehtävän, mutta olen epävarma vastauksesta." class="problemButton btn btn-warning btn-primary" id=' + "1;" + problemID + '><img class="face" src="/img/faces/meh.svg"></button>'
                        + '<button data-toggle="tooltip" title="Ratkaisin tehtävän ja osaan tämän." class="problemButton btn btn-success btn-primary" id=' + "2;" + problemID + '><img class="face" src="/img/faces/happy.svg"></button></div></div>');
                $(value).find("div:first").append($input);
            }*/

            // $(value).find("header").append(buttonHTML);


            // relabel IDs
            // $(value).attr("id", problemID);

            // tag subassignments


            $(value).find("div h1").each(function(subIndex, value) {
                $(value).text(exCount + "." + (subIndex + 1) + ": " + $(value).text());
            });


        });

        $(".panel").each(function(index, value) {
            let firstExercise;
            let lastExercise;

            $(this).find('.tehtava').each(function(index, value) {
                if (index === 0) {
                    firstExercise = $(this).find('header h1').text();
                };

                lastExercise = $(this).find('header h1').text();
            });

            $(this).find('.otsikko').each(function(index, value) {
                var exHeader = $(value).find("h1 a").text();
                var newHeader = exHeader + " ("+ /[0-9].[0-9]+/.exec(firstExercise)[0] + " - " + /[0-9].[0-9]+/.exec(lastExercise)[0] + ")";
                $(value).find("h1 a").text(newHeader);
            });

        });
        
        if ($('#theoremStart').val() == null) {
                var thStart = 1;
            } else {
                var thStart = parseInt($('#theoremStart').val());
            }
        
         $(".theorem").each(function(thIndex, value) {

            var thCount = (thStart + thIndex);
            var thName = "TEOREEMA " + thCount;

            // relabel theorem
            if (this.id === '') {
                $(value).find("h3").text(thName);
            } else {
                $(value).find("h3").text(this.id + " (" + thName +")");
            }
        });
     
/*
        // link toc to assignments
        $("#tehtavat-toc a").each(function(index, value) {
            $(value).click(function() {
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href') + "-ex").offset().top
                }, 400);

                $($.attr(this, 'href')).click();
            });
        });

        var idx = 1;
        $("section h1").each(function(index, value) {
            if ($(value).parents('.tehtava').length) {
                return; // ignore assignments
            }

            if ($(value).parents('.no-toc').length) {
                return; //ignore sections with .no-toc
            }

            if ($(value).parent('section').length) {


                var chapterCount = idx;

                var chapterText = chapterCount + ". " + $(value).text();
                
                console.log(chapterText);

                $(value).attr("id", "chapter" + chapterCount);
                $(value).text(chapterText);

                // add chapters to toc 
                $("#material-toc").append("<li><a href='#chapter" + chapterCount + "'>" + chapterText + "</a></li>");
                idx++;

                // iterate through siblings
                var sibling = $(value).next();
                var count = 1;
                while (sibling) {
                    // do not relabel assignments
                    if (!$(sibling).prop("tagName") || $(sibling).prop("tagName").toLowerCase() === "h1") {
                        break;
                    }

                    if ($(sibling).prop("tagName").toLowerCase() === "h2") {
                        var subChapterText = (chapterCount + "." + count + ". " + $(sibling).text());
                        $(sibling).text(subChapterText);
                        var id = "chapter" + chapterCount + "-" + count;
                        $(sibling).attr("id", id);
                        
                        $("#material-toc").append("<li><a href='#" + id + "'>&nbsp;&nbsp;&nbsp;" + subChapterText + "</a></li>");
                        
                        count++;
                    }


                    sibling = $(sibling).next();
                    
                    if(sibling.length <= 0) {
                        break;
                    }
                }
            }

        });
  */
    }  

};


$(function() {
    SITE.init();
});
