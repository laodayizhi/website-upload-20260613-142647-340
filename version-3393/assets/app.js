(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-main-nav]');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var next = document.querySelector('[data-hero-next]');
  var prev = document.querySelector('[data-hero-prev]');
  var index = 0;
  var timer = null;

  function showSlide(nextIndex) {
    if (!slides.length) {
      return;
    }

    index = (nextIndex + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === index);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === index);
    });
  }

  function startSlider() {
    if (slides.length < 2) {
      return;
    }

    timer = window.setInterval(function () {
      showSlide(index + 1);
    }, 5000);
  }

  function resetSlider() {
    if (timer) {
      window.clearInterval(timer);
    }
    startSlider();
  }

  if (next) {
    next.addEventListener('click', function () {
      showSlide(index + 1);
      resetSlider();
    });
  }

  if (prev) {
    prev.addEventListener('click', function () {
      showSlide(index - 1);
      resetSlider();
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener('click', function () {
      showSlide(dotIndex);
      resetSlider();
    });
  });

  showSlide(0);
  startSlider();

  var params = new URLSearchParams(window.location.search);
  var q = params.get('q') || '';
  var forms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));

  forms.forEach(function (form) {
    var input = form.querySelector('[data-search-input]');
    var year = form.querySelector('[data-year-filter]');
    var type = form.querySelector('[data-type-filter]');
    var scope = document.querySelector('[data-filter-scope]') || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));

    if (input && q) {
      input.value = q;
    }

    function applyFilter() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var yearValue = year ? year.value : '';
      var typeValue = type ? type.value : '';

      cards.forEach(function (card) {
        var title = (card.getAttribute('data-title') || '').toLowerCase();
        var cardYear = card.getAttribute('data-year') || '';
        var cardType = card.getAttribute('data-type') || '';
        var cardRegion = (card.getAttribute('data-region') || '').toLowerCase();
        var text = card.textContent.toLowerCase() + ' ' + title + ' ' + cardRegion + ' ' + cardType.toLowerCase();
        var matched = true;

        if (keyword && text.indexOf(keyword) === -1) {
          matched = false;
        }

        if (yearValue && cardYear !== yearValue) {
          matched = false;
        }

        if (typeValue && cardType !== typeValue) {
          matched = false;
        }

        card.classList.toggle('hidden-card', !matched);
      });
    }

    ['input', 'change'].forEach(function (eventName) {
      if (input) {
        input.addEventListener(eventName, applyFilter);
      }
      if (year) {
        year.addEventListener(eventName, applyFilter);
      }
      if (type) {
        type.addEventListener(eventName, applyFilter);
      }
    });

    applyFilter();
  });

  var heroSearch = document.querySelector('[data-hero-search]');

  if (heroSearch) {
    heroSearch.addEventListener('submit', function (event) {
      var input = heroSearch.querySelector('input');
      var value = input ? input.value.trim() : '';
      if (!value) {
        event.preventDefault();
      }
    });
  }
})();
