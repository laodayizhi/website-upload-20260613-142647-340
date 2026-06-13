(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector(".menu-toggle");
    var navMenu = document.querySelector(".nav-menu");

    if (menuButton && navMenu) {
      menuButton.addEventListener("click", function () {
        var isOpen = navMenu.classList.toggle("open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
      });
    }

    document.querySelectorAll(".hero-carousel").forEach(function (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
      var prev = carousel.querySelector(".hero-prev");
      var next = carousel.querySelector(".hero-next");
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === index);
        });
      }

      function move(step) {
        show(index + step);
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          move(1);
        }, 5000);
      }

      if (prev) {
        prev.addEventListener("click", function () {
          move(-1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          move(1);
          restart();
        });
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          show(i);
          restart();
        });
      });

      show(0);
      restart();
    });

    document.querySelectorAll(".filter-panel").forEach(function (panel) {
      var input = panel.querySelector(".movie-filter");
      var year = panel.querySelector(".year-filter");
      var container = panel.nextElementSibling;
      var cards = container ? Array.prototype.slice.call(container.querySelectorAll(".movie-card")) : [];
      var empty = document.createElement("div");
      empty.className = "no-results";
      empty.textContent = "没有找到匹配影片";

      function applyFilter() {
        var keyword = input ? input.value.trim().toLowerCase() : "";
        var selectedYear = year ? year.value : "";
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title"),
            card.getAttribute("data-year"),
            card.getAttribute("data-type"),
            card.getAttribute("data-region"),
            card.getAttribute("data-genre")
          ].join(" ").toLowerCase();
          var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchYear = !selectedYear || card.getAttribute("data-year") === selectedYear;
          var showCard = matchKeyword && matchYear;
          card.classList.toggle("is-filtered", !showCard);
          if (showCard) {
            visible += 1;
          }
        });

        if (container) {
          if (!visible && !empty.parentNode) {
            container.parentNode.insertBefore(empty, container.nextSibling);
          }
          if (visible && empty.parentNode) {
            empty.parentNode.removeChild(empty);
          }
        }
      }

      if (input) {
        input.addEventListener("input", applyFilter);
      }
      if (year) {
        year.addEventListener("change", applyFilter);
      }

      var params = new URLSearchParams(window.location.search);
      var query = params.get("q");
      if (query && input) {
        input.value = query;
      }
      applyFilter();
    });
  });
})();

function startMoviePlayer(source) {
  function setup() {
    var player = document.querySelector(".movie-player");
    if (!player) {
      return;
    }

    var video = player.querySelector("video");
    var cover = player.querySelector(".player-cover");
    var attached = false;
    var hlsInstance = null;

    function attachSource() {
      if (!video || attached) {
        return;
      }

      attached = true;
      video.controls = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function playVideo() {
      attachSource();
      if (cover) {
        cover.classList.add("is-hidden");
      }
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener("click", playVideo);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          playVideo();
        }
      });
      video.addEventListener("ended", function () {
        if (hlsInstance) {
          hlsInstance.stopLoad();
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
}
