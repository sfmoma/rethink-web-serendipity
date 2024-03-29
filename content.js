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
    if (urlParams.get("ra")) {
      randomArticle = true;
    }

    var articles = data.articles;

    if (lidData) {
      var lid = lidData.lid;
    } else {
      randomArticle = true;
    }

    if (randomArticle) {
      var randomIdx = Math.floor(Math.random() * Object.keys(articles).length);
      var currentArticleId = randomIdx.toString();
    } else if (lid) {
      $("#message-box").html("<p>A previous visitor chose this for you:</p>");
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
          otherArticles[Math.floor(Math.random() * otherArticles.length)];
        relatedArticle = {
          tag: tag,
          articleId: randomArticleId
        };
        relatedTags.push(relatedArticle);
      }
    }

    var leaveHTML =
      "<div class='btn-container' id='btn-container-leave'><a class='btn leave' href='#' data-leave-id='" +
      currentArticleId +
      "'>Leave me for the next visitor!</a></div>";

    $("#bg-container").css(
      "background-image",
      "url(" + currentArticle.img_url + ")"
    );
    $("#title").html(
      "<a href='" +
        currentArticle.url +
        "' target='_blank' tabindex=0 class='link'>" +
        currentArticle.title +
        "</a>"
    );
    $("#author").html("By " + currentArticle.author);
    $("#excerpt").html(currentArticle.excerpt);
    $("#btns-container").html(
      '<div class="btn-container"><a class="btn random" href="index.html?ra=1">View a random article</a></div>' +
        leaveHTML
    );
  });

  // write the ID and timestamp to txt file
  $(document).on("click", "a.leave", function() {
    var leaveID = $(this).data("leave-id");
    $("#btn-container-leave").html(
      "<p class='success-msg'>Thank you for sharing.</p>"
    );

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
