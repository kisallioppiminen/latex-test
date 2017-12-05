var SITE = {
    init: function() {
        SITE.initToc();
    },
    initToc: function() {
        
        var exReset = 0;
        var chapterNumber = 0;
        $(".tehtava").each(function(index, value) {
            
            // reset excercise counter
            if ($(this).hasClass( "first-exercise" )) {
               exReset = index;
               chapterNumber++;
            };
            
            var exCount = (index + 1 - exReset);
            var exName = "Tehtävä " + chapterNumber + "." + exCount + ": " + $(value).find("h1 a").text();

            // relabel assignments
            $(value).find("header h1 a").text(exName);

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
