$(function() {
    var data;
    $.getJSON("data/cleaned_data.json", function(json) {
        data = json;

        var urlParams = new URLSearchParams(window.location.search);
        var articleParam = urlParams.get("article");
        var articles = data.articles;

        if (articles[articleParam]) {
            var currentArticleId = articleParam;
        } else {
            var randomIdx = Math.floor(
                Math.random() * Object.keys(articles).length
            );
            var currentArticleId = randomIdx.toString();
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

        var tagsHtml = "";
        relatedTags.forEach(function(tagData) {
            tagsHtml +=
                "<div class='btn-container'><a class='btn' href='/index.html?article=" +
                tagData.articleId +
                "'>Related article - " +
                tagData.tag +
                "</a></div>";
        });

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
            '<a class="btn" href="/index.html">Random article</a>' + tagsHtml
        );
    });
});
