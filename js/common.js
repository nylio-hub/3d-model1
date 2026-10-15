var USER_KEY = 'hub3d_user';
var THEME_KEY = 'hub3d_theme';
var MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
              'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

var root = location.pathname.indexOf('/pages/') === -1 ? '' : '../';

function link(page) {
  if (page === 'index.html') return root + 'index.html';
  return root + 'pages/' + page;
}

function money(value) {
  return Math.round(value).toLocaleString('ru-RU') + ' ₽';
}

function dateRu(iso) {
  var date = new Date(iso);
  return date.getDate() + ' ' + MONTHS[date.getMonth()];
}

function daysLeft(iso) {
  var diff = new Date(iso) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function plural(count, one, few, many) {
  var last = count % 10;
  var two = count % 100;
  if (two > 10 && two < 20) return many;
  if (last === 1) return one;
  if (last > 1 && last < 5) return few;
  return many;
}

function orderWord(count) {
  return plural(count, 'заказ', 'заказа', 'заказов');
}

function dayWord(count) {
  return plural(count, 'день', 'дня', 'дней');
}

function initials(name) {
  var parts = name.split(' ');
  var text = parts[0][0];
  if (parts[1]) text += parts[1][0];
  return text.toUpperCase();
}

function getParam(name) {
  return new URLSearchParams(location.search).get(name) || '';
}

function safe(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function currentUser() {
  var id = localStorage.getItem(USER_KEY);
  return id ? findUser(id) : null;
}

function signIn(userId) {
  localStorage.setItem(USER_KEY, userId);
}

function signOut() {
  localStorage.removeItem(USER_KEY);
}

function roleName(role) {
  return role === 'modeler' ? 'модельер' : 'заказчик';
}

function currentTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

function applyTheme(name) {
  document.documentElement.dataset.theme = name;
  localStorage.setItem(THEME_KEY, name);
}

var ICON_MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 13.3A8.5 8.5 0 0 1 10.7 3.5a8.5 8.5 0 1 0 9.8 9.8z"></path></svg>';
var ICON_SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"></circle><path d="M12 2.2v2.1M12 19.7v2.1M4.1 4.1l1.5 1.5M18.4 18.4l1.5 1.5M2.2 12h2.1M19.7 12h2.1M4.1 19.9l1.5-1.5M18.4 5.6l1.5-1.5"></path></svg>';

function themeIcon() {
  return currentTheme() === 'dark' ? ICON_SUN : ICON_MOON;
}

var toastTimer = 0;

function toast(text) {
  var box = document.getElementById('toastBox');

  if (!box) {
    box = document.createElement('div');
    box.id = 'toastBox';
    box.className = 'toast';
    document.body.appendChild(box);
  }

  box.textContent = text;
  box.classList.add('is-open');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    box.classList.remove('is-open');
  }, 2600);
}

function favorites() {
  var user = currentUser();
  if (!user) return [];
  if (!user.favorites) user.favorites = [];
  return user.favorites;
}

function isFavorite(modelerId) {
  return favorites().indexOf(modelerId) !== -1;
}

function toggleFavorite(modelerId) {
  if (!currentUser()) {
    toast('Войдите на сайт, чтобы сохранять модельеров');
    return false;
  }

  var list = favorites();
  var at = list.indexOf(modelerId);

  if (at === -1) {
    list.push(modelerId);
    toast('Добавлено в избранное');
  } else {
    list.splice(at, 1);
    toast('Убрано из избранного');
  }

  saveData();
  return true;
}

function favButton(modelerId) {
  return `<button class="fav-btn ${isFavorite(modelerId) ? 'is-on' : ''}" data-fav="${modelerId}" title="В избранное">♥</button>`;
}

function bindFavorites(afterClick) {
  var buttons = document.querySelectorAll('.fav-btn');

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function (event) {
      event.preventDefault();
      if (!toggleFavorite(this.dataset.fav)) return;
      this.classList.toggle('is-on');
      if (afterClick) afterClick();
    };
  }
}

function renderHeader(activePage) {
  var user = currentUser();
  var right = '';

  if (user) {
    var newOrder = user.role === 'customer'
      ? `<a class="btn btn-primary btn-sm new-order" href="${link('create-order.html')}">Создать заказ</a>`
      : '';

    right = ` ${newOrder} <a class="user-chip" href="${link('account.html')}"><span class="avatar avatar-sm" style="background:${user.color}">${initials(user.name)}</span><span>${safe(user.name)}<br><span class="role">${roleName(user.role)}</span></span></a><button class="btn btn-ghost btn-sm" id="logoutBtn">Выйти</button>`;
  } else {
    right = ` <a class="btn btn-ghost btn-sm" href="${link('login.html')}">Войти</a><a class="btn btn-primary btn-sm" href="${link('login.html')}?tab=register">Регистрация</a>`;
  }

  document.getElementById('header').innerHTML = ` <header class="site-header"><div class="container"><a class="brand" href="${link('index.html')}"><span class="brand-mark"><img src="${root}assets/logo.svg" alt=""></span> 3D Models </a><button class="nav-toggle" id="navToggle">Меню</button><nav class="nav" id="mainNav"><a href="${link('catalog.html')}" class="${activePage === 'catalog' ? 'is-active' : ''}">Каталог модельеров</a><a href="${link('orders.html')}" class="${activePage === 'orders' ? 'is-active' : ''}">Заказы</a></nav><form class="header-search" id="headerSearch"><span class="ico"><img src="${root}assets/search.svg" alt=""></span><input id="headerQuery" placeholder="Поиск по каталогу модельеров"></form><div class="header-right"><button class="theme-btn" id="themeBtn" title="Светлая/тёмная тема">${themeIcon()}</button>${right}</div></div></header>`;

  document.getElementById('themeBtn').onclick = function () {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    this.innerHTML = themeIcon();
  };

  document.getElementById('navToggle').onclick = function () {
    document.getElementById('mainNav').classList.toggle('is-open');
  };

  document.getElementById('headerSearch').onsubmit = function (event) {
    event.preventDefault();
    var query = document.getElementById('headerQuery').value.trim();
    location.href = link('catalog.html') + (query ? '?q=' + encodeURIComponent(query) : '');
  };

  var logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.onclick = function () {
      signOut();
      location.href = link('index.html');
    };
  }
}

function renderFooter() {
  document.getElementById('footer').innerHTML = ` <footer class="site-footer"><div class="container"><div class="footer-cols"><div class="brand"><span class="brand-mark"><img src="${root}assets/logo.svg" alt=""></span> 3D Models </div><div><h4>Заказчикам</h4><ul><li><a href="${link('catalog.html')}">Каталог модельеров</a></li><li><a href="${link('create-order.html')}">Разместить заказ</a></li><li><a href="${link('index.html')}#how">Порядок работы</a></li></ul></div><div><h4>Исполнителям</h4><ul><li><a href="${link('orders.html')}">Найти заказ</a></li><li><a href="${link('login.html')}?tab=register">Стать исполнителем</a></li><li><a href="${link('profile-edit.html')}">Мой профиль</a></li></ul></div><div><h4>Данные</h4><ul><li>Хранятся в браузере</li><li class="mt-1"><button class="btn btn-ghost btn-sm" id="demoBtn">Заполнить демо-данными</button></li><li class="mt-1"><button class="btn btn-ghost btn-sm" id="exportBtn">Сохранить в файл</button></li><li class="mt-1"><button class="btn btn-ghost btn-sm" id="importBtn">Загрузить из файла</button></li><li class="mt-1"><button class="btn btn-ghost btn-sm" id="resetBtn">Очистить все данные</button></li><li><input type="file" id="importFile" accept="application/json" hidden></li></ul></div></div></div></footer>`;

  document.getElementById('demoBtn').onclick = function () {
    if (!confirm('Заполнить сайт демо-данными? Всё, что есть на сайте сейчас, будет заменено.')) return;
    fillDemoData();
    signOut();
    toast('Готово. Пароль у всех демо-пользователей: 1234');
    setTimeout(function () { location.href = link('index.html'); }, 1400);
  };

  document.getElementById('exportBtn').onclick = function () {
    exportData();
  };

  document.getElementById('importBtn').onclick = function () {
    document.getElementById('importFile').click();
  };

  document.getElementById('importFile').onchange = function () {
    if (this.files.length) importData(this.files[0]);
  };

  document.getElementById('resetBtn').onclick = function () {
    if (!confirm('Удалить все данные сайта? Профили, заказы и отзывы будут стёрты.')) return;
    clearData();
    location.href = link('index.html');
  };
}

function startPage(activePage) {
  applyTheme(currentTheme());
  renderHeader(activePage);
  renderFooter();
}

var STATUS_TEXT = {
  open: 'Открыт',
  in_progress: 'В работе',
  review: 'На проверке',
  done: 'Завершён',
  cancelled: 'Отменён'
};

var STATUS_STYLE = {
  open: 'badge-dark',
  in_progress: 'badge-violet',
  review: 'badge-warning',
  done: 'badge-success',
  cancelled: 'badge-danger'
};

function statusBadge(status) {
  return `<span class="badge ${STATUS_STYLE[status]}">${STATUS_TEXT[status]}</span>`;
}

function statusSteps(status) {
  var order = ['open', 'in_progress', 'review', 'done'];
  var current = order.indexOf(status);
  var html = '';

  for (var i = 0; i < order.length; i++) {
    var style = '';
    if (i < current) style = 'done';
    if (i === current) style = 'active';
    html += `<div class="step ${style}">${STATUS_TEXT[order[i]]}</div>`;
  }
  return `<div class="steps">${html}</div>`;
}

function emptyBox(text) {
  return `<div class="empty">${text}</div>`;
}

function modelerCard(modeler) {
  return ` <a class="card card-hover modeler-card" href="${link('modeler.html')}?id=${modeler.id}">${favButton(modeler.id)}<div class="cover" style="background-color:${coverOf(modeler.id)}"></div><div class="body"><div class="line1"><span class="brand-line">${categoryName(modeler.categoryId)}</span><span class="brand-line">${safe(modeler.city)}</span></div><div><div class="name">${safe(modeler.name)}</div><div class="spec">${safe(modeler.spec)}</div></div><div class="price"><small>от</small> ${money(modeler.priceFrom)}</div><div class="bottom"><span class="rating-row"><span class="stars">★</span><b>${modeler.rating.toFixed(1)}</b><span class="muted">· ${modeler.ordersDone} ${orderWord(modeler.ordersDone)}</span></span><span class="muted tiny">~${modeler.days} ${dayWord(modeler.days)}</span></div></div></a>`;
}

function workCard(work) {
  return ` <div class="card card-hover work-card"><div class="cover" style="background-color:${work.color}"></div><div class="work-body"><div class="t">${safe(work.title)}</div><div class="row-between"><span class="muted small">${categoryName(work.categoryId)}</span><span class="price small">${money(work.price)}</span></div></div></div>`;
}

function orderCard(order) {
  var left = daysLeft(order.deadline);
  var deadline = order.status === 'open' && left < 0
    ? '<span class="danger">срок истёк</span>'
    : 'до ' + dateRu(order.deadline);
  var count = proposalsOf(order.id).length;

  return ` <a class="card card-hover order-card" href="${link('order.html')}?id=${order.id}"><div class="head"><span class="title">${safe(order.title)}</span> ${statusBadge(order.status)} </div><div class="desc">${safe(order.description)}</div><div class="meta"><span class="price">${money(order.agreedPrice || order.budget)}</span><span>${categoryName(order.categoryId)}</span><span>${deadline}</span><span>${count} ${plural(count, 'отклик', 'отклика', 'откликов')}</span></div></a>`;
}

function reviewItem(review) {
  var author = findUser(review.authorId);
  var stars = '';
  for (var i = 1; i <= 5; i++) {
    stars += i <= review.rating ? '★' : '<span class="off">★</span>';
  }

  return ` <div class="review"><span class="avatar avatar-sm" style="background:${author.color}">${initials(author.name)}</span><div style="flex:1"><div class="row-between"><b>${safe(author.name)}</b><span class="muted tiny">${dateRu(review.createdAt)}</span></div><div class="mb-1"><span class="stars">${stars}</span></div><div class="small">${safe(review.text)}</div></div></div>`;
}

function proposalItem(proposal, canAccept, canWithdraw) {
  var modeler = findModeler(proposal.modelerId);
  var action = '';

  if (proposal.status === 'accepted') {
    action = '<span class="badge badge-success">Выбран исполнителем</span>';
  } else if (proposal.status === 'rejected') {
    action = '<span class="badge">Отклонён</span>';
  } else if (canAccept) {
    action = `<button class="btn btn-primary btn-sm accept-btn" data-id="${proposal.id}">Выбрать исполнителем</button>`;
  } else if (canWithdraw) {
    action = `<button class="btn btn-ghost btn-sm withdraw-btn" data-id="${proposal.id}">Отозвать отклик</button>`;
  }

  return ` <div class="proposal ${proposal.status === 'accepted' ? 'is-accepted' : ''}"><div class="row-between mb-1"><a class="row" href="${link('modeler.html')}?id=${modeler.id}"><span class="avatar avatar-sm" style="background:${modeler.color}">${initials(modeler.name)}</span><span><b>${safe(modeler.name)}</b><span class="muted small"> · ${safe(modeler.spec)}</span><br><span class="small"><span class="stars">★</span> ${modeler.rating.toFixed(1)}</span></span></a><div class="center"><div class="price">${money(proposal.price)}</div><div class="muted tiny">${proposal.days} ${dayWord(proposal.days)}</div></div></div><div class="small muted mb-1">${safe(proposal.message)}</div><div class="row-between"><span class="tiny muted">Отклик от ${dateRu(proposal.createdAt)}</span> ${action} </div></div>`;
}
