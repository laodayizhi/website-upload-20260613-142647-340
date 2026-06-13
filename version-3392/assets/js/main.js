(function () {
  const toggle = document.querySelector('.nav-toggle');
  const panel = document.querySelector('.mobile-panel');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      const isOpen = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.textContent = isOpen ? '×' : '☰';
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const next = hero.querySelector('[data-hero-next]');
    const prev = hero.querySelector('[data-hero-prev]');
    let current = 0;
    let timer = null;

    function setSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        setSlide(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        setSlide(Number(dot.dataset.heroDot || 0));
        start();
      });
    });

    if (next) {
      next.addEventListener('click', function () {
        setSlide(current + 1);
        start();
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        setSlide(current - 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    start();
  }
})();
