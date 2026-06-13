(function () {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const hint = document.getElementById('search-hint');
  const params = new URLSearchParams(window.location.search);
  const initial = params.get('q') || '';
  const movies = Array.isArray(window.SEARCH_MOVIES) ? window.SEARCH_MOVIES : [];

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function card(movie) {
    const tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return [
      '<article class="movie-card">',
      '  <a class="poster" href="' + escapeHtml(movie.url) + '" aria-label="' + escapeHtml(movie.title) + '">',
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="play-badge">播放</span>',
      '  </a>',
      '  <div class="movie-card-body">',
      '    <div class="movie-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
      '    <h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="tag-list">' + tags + '</div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function runSearch(value) {
    const query = String(value || '').trim().toLowerCase();

    if (!query) {
      results.innerHTML = '';
      hint.textContent = '输入关键词后即可筛选影片';
      return;
    }

    const matched = movies.filter(function (movie) {
      const text = [
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        movie.oneLine,
        (movie.tags || []).join(' ')
      ].join(' ').toLowerCase();
      return text.indexOf(query) !== -1;
    }).slice(0, 120);

    hint.textContent = matched.length ? '已为你筛选出相关影片' : '没有找到匹配影片，可以换个关键词';
    results.innerHTML = matched.map(card).join('');
  }

  if (input) {
    input.value = initial;
    input.addEventListener('input', function () {
      runSearch(input.value);
    });
  }

  runSearch(initial);
})();
