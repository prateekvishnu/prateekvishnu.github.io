// Add your javascript here
// Don't forget to add it into respective layouts where this js file is needed

$(document).ready(function() {
  AOS.init( {
    // uncomment below for on-scroll animations to played only once
    // once: true  
  }); // initialize animate on scroll library
});

// Smooth scroll for links with hashes
$('a.smooth-scroll')
.click(function(event) {
  // On-page links
  if (
    location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
    && 
    location.hostname == this.hostname
  ) {
    // Figure out element to scroll to
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    // Does a scroll target exist?
    if (target.length) {
      // Only prevent default if animation is actually gonna happen
      event.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 1000, function() {
        // Callback after animation
        // Must change focus!
        var $target = $(target);
        $target.focus();
        if ($target.is(":focus")) { // Checking if the target was focused
          return false;
        } else {
          $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
          $target.focus(); // Set focus again
        };
      });
    }
  }
});

var x = 0;
var images = document.querySelectorAll(".images");
var dots = document.querySelectorAll(".dot");

function showImage(index) {
    for (let i = 0; i < images.length; i++) {
        images[i].style.display = "none";
        dots[i].classList.remove("active");
    }
    images[index].style.display = "block";
    dots[index].classList.add("active");
}

function navigate(direction) {
    x += direction;
    if (x >= images.length) {
        x = 0;
    } else if (x < 0) {
        x = images.length - 1;
    }
    showImage(x);
}

document.getElementById("prev").addEventListener("click", function() {
    navigate(-1);
});

document.getElementById("next").addEventListener("click", function() {
    navigate(1);
});

for (let i = 0; i < dots.length; i++) {
    dots[i].addEventListener("click", function() {
        showImage(i);
        x = i;
    });
}

showImage(x);
setInterval(function () {
    navigate(1);
}, 2000);



