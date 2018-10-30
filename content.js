$(function() {
    var data;
    var lidData;

    $.getJSON("php/lid.txt", function(lidJSON) {
        lidData = lidJSON;
    });

    $.getJSON("data/cleaned_data.json", function(json) {

        data = json;
        var urlParams = new URLSearchParams(window.location.search);
        var randomArticle = false;
        if(urlParams.get("ra")) {
            randomArticle = true;
        }

        var articles = data.articles;

        if (lidData) {
            var lid = lidData.lid;
        }
        else {
            randomArticle = true;
        }

        if (randomArticle) {
            var randomIdx = Math.floor(
                Math.random() * Object.keys(articles).length
            );
            var currentArticleId = randomIdx.toString();
        }
        else if (lid) {
            $("#message-box").html("<p>The last person to visit this page left the following article for you to read.</p>");
            var currentArticleId = lid;
        }
        var currentArticle = articles[currentArticleId];

        var relatedTags = [];
        for (var tag in data.tags) {
            if (data.tags[tag].includes(currentArticleId)) {
                var otherArticles = data.tags[tag].filter(
                    id => id !== currentArticleId
                );
                var randomArticleId =
                    otherArticles[
                        Math.floor(Math.random() * otherArticles.length)
                    ];
                relatedArticle = {
                    tag: tag,
                    articleId: randomArticleId
                };
                relatedTags.push(relatedArticle);
            }
        }

        var leaveHTML = "<a class='btn leave' href='#' data-leave-id='"+currentArticleId+"'>Leave</a>";

        $("#bg-container").css(
            "background-image",
            "url(" + currentArticle.img_url + ")"
        );
        $("#title").html(
            "<h2><a href='" +
                currentArticle.url +
                "' target='_blank' class='link'>" +
                currentArticle.title +
                "</a></h2>"
        );
        $("#author").html("<p>By " + currentArticle.author + "</p>");
        $("#excerpt").html("<p>" + currentArticle.excerpt + "</p>");
        $("#btns-container").html(
            '<a class="btn random" href="/index.html?ra=1">Random</a>' + leaveHTML
        );
    });

    // write the ID and timestamp to txt file
    $(document).on("click", "a.leave", function() { 

        var leaveID = $(this).data('leave-id');

        $.post(
            "php/handleLeave.php",
            {
                lid: leaveID
            },
            function(data, status) {
                console.log("DATA: " + data + "\nStatus: " + status);
            }
        );
    });


});
