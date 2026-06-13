(function () {
  function setupPlayer(container) {
    const video = container.querySelector('video');
    const overlay = container.querySelector('.player-overlay');
    const source = container.getAttribute('data-hls-source');

    if (!video || !source) {
      return;
    }

    let hls = null;

    function bindSource() {
      if (hls || video.src) {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        video.src = source;
      }
    }

    function playVideo(event) {
      if (event) {
        event.preventDefault();
      }
      bindSource();
      const promise = video.play();
      if (promise && typeof promise.then === 'function') {
        promise.catch(function () {
          container.classList.remove('playing');
        });
      }
    }

    overlay.addEventListener('click', playVideo);
    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });
    video.addEventListener('play', function () {
      container.classList.add('playing');
    });
    video.addEventListener('pause', function () {
      container.classList.remove('playing');
    });
    video.addEventListener('ended', function () {
      container.classList.remove('playing');
    });
  }

  document.querySelectorAll('.movie-player').forEach(setupPlayer);

  document.querySelectorAll('[data-play-now]').forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      const player = document.querySelector('.movie-player');
      const overlay = player ? player.querySelector('.player-overlay') : null;
      if (overlay) {
        overlay.click();
        player.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
})();
