startPage('catalog');

var filterSearch = getParam('q');
var filterCategory = getParam('cat');
var filterPrice = getParam('price');
var filterRating = getParam('rating');
var filterDays = '';
var filterSort = 'rating';

var searchInput = document.getElementById('fSearch');
var priceSelect = document.getElementById('fPrice');
var ratingSelect = document.getElementById('fRating');
var daysSelect = document.getElementById('fDays');
var sortSelect = document.getElementById('fSort');

searchInput.value = filterSearch;
priceSelect.value = filterPrice;
ratingSelect.value = filterRating;

var allList = allModelers();
var ratingSum = 0;
for (var n = 0; n < allList.length; n++) {
  ratingSum += allList[n].rating;
}
var averageRating = allList.length ? (ratingSum / allList.length).toFixed(1) : '0.0';

document.getElementById('catStats').innerHTML = ` <div><div class="v">${allList.length}</div><div class="k">${plural(allList.length, 'модельер', 'модельера', 'модельеров')}</div></div><div><div class="v">${averageRating}</div><div class="k">средний рейтинг</div></div><div><div class="v green">${works.length}</div><div class="k">${plural(works.length, 'работа', 'работы', 'работ')} в портфолио</div></div>`;

function showCategories() {
  var html = ` <li class="${filterCategory ? '' : 'is-active'}" data-cat=""><span>Все категории</span><span class="n">${modelers.length}</span></li>`;

  for (var i = 0; i < categories.length; i++) {
    var count = 0;
    for (var j = 0; j < modelers.length; j++) {
      if (modelers[j].categoryId === categories[i].id) count++;
    }
    html += ` <li class="${filterCategory === categories[i].id ? 'is-active' : ''}" data-cat="${categories[i].id}"><span>${categories[i].name}</span><span class="n">${count}</span></li>`;
  }

  document.getElementById('catList').innerHTML = html;

  var items = document.querySelectorAll('#catList li');
  for (var k = 0; k < items.length; k++) {
    items[k].onclick = function () {
      filterCategory = this.dataset.cat;
      render();
    };
  }
}

function matchesSearch(modeler, query) {
  var text = modeler.name + ' ' + modeler.spec + ' ' + modeler.skills.join(' ');
  return text.toLowerCase().indexOf(query.toLowerCase()) !== -1;
}

function sortList(list) {
  if (filterSort === 'rating') {
    list.sort(function (a, b) { return b.rating - a.rating; });
  }
  if (filterSort === 'orders') {
    list.sort(function (a, b) { return b.ordersDone - a.ordersDone; });
  }
  if (filterSort === 'price_asc') {
    list.sort(function (a, b) { return a.priceFrom - b.priceFrom; });
  }
  if (filterSort === 'price_desc') {
    list.sort(function (a, b) { return b.priceFrom - a.priceFrom; });
  }
}

function render() {
  var all = allModelers();
  var found = [];

  for (var i = 0; i < all.length; i++) {
    var modeler = all[i];
    if (filterSearch && !matchesSearch(modeler, filterSearch)) continue;
    if (filterCategory && modeler.categoryId !== filterCategory) continue;
    if (filterPrice && modeler.priceFrom > Number(filterPrice)) continue;
    if (filterRating && modeler.rating < Number(filterRating)) continue;
    if (filterDays && modeler.days > Number(filterDays)) continue;
    found.push(modeler);
  }

  sortList(found);

  document.getElementById('foundCount').innerHTML =
    `<b>${found.length}</b> ${plural(found.length, 'модельер', 'модельера', 'модельеров')}`;

  var html = '';
  for (var j = 0; j < found.length; j++) {
    html += modelerCard(found[j]);
  }
  document.getElementById('modelersList').innerHTML =
    html || emptyBox('Нет модельеров, подходящих под выбранные условия');

  showCategories();
  bindFavorites();
}

searchInput.oninput = function () {
  filterSearch = this.value.trim();
  render();
};

priceSelect.onchange = function () {
  filterPrice = this.value;
  render();
};

ratingSelect.onchange = function () {
  filterRating = this.value;
  render();
};

daysSelect.onchange = function () {
  filterDays = this.value;
  render();
};

sortSelect.onchange = function () {
  filterSort = this.value;
  render();
};

document.getElementById('fReset').onclick = function () {
  filterSearch = '';
  filterCategory = '';
  filterPrice = '';
  filterRating = '';
  filterDays = '';
  filterSort = 'rating';

  searchInput.value = '';
  priceSelect.value = '';
  ratingSelect.value = '';
  daysSelect.value = '';
  sortSelect.value = 'rating';
  render();
};

render();
