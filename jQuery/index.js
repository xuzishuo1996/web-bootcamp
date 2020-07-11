
$(document).ready(function() {
  // $("h1").css("color", "red");
  $("h1").addClass("big-title");
  $("h1").text("big-title");
  $("button").html("<em>Hi</em>");

  $("a").attr("href");  //getter
  $("a").attr("href", "https://www.yahoo.com");  //setter

  $("h1").click(function() {
    $("h1").css("color", "purple");
  });

  // $("button").click(function() {
  //   $("h1").css("color", "purple");
  // });

  $("button").on("click", function() {
    // $("h1").fadeToggle(); //fadeOut/fadeIn
    $("h1").slideUp().slideDown().animate({ //can chain them
      opacity: 0.5,
      margin: 20  //20 means 20px; "20%" need to be quoted
    });  //animate() can only control numeric values
  })

  $("input").keydown(function(event) {
    $("h1").text(event.key);
  });

  $(document).on("mouseover", function() {
      $("h1").css("color", "purple");
  });

  $("h1").before("<button>New</Button>"); //after/prepend/append
})
