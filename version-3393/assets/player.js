var SitePlayer = (function () {
  function mount(source) {
    var video = document.querySelector('[data-player-video]');
    var button = document.querySelector('[data-play-button]');
    var attached = false;
    var hls = null;

    if (!video || !button || !source) {
      return;
    }

    function attachSource() {
      if (attached) {
        return;
      }

      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        return;
      }

      video.src = source;
    }

    function begin() {
      attachSource();
      button.classList.add('hidden');
      video.controls = true;
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          video.controls = true;
        });
      }
    }

    button.addEventListener('click', begin);
    video.addEventListener('click', function () {
      if (!attached || video.paused) {
        begin();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hls && hls.destroy) {
        hls.destroy();
      }
    });
  }

  return {
    mount: mount
  };
})();
