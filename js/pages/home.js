startPage('');

var openOrders = [];
for (var i = 0; i < orders.length; i++) {
  if (orders[i].status === 'open') openOrders.push(orders[i]);
}

document.getElementById('heroStats').innerHTML = ` <div><div class="v">${modelers.length}</div><div class="k">${plural(modelers.length, 'модельер', 'модельера', 'модельеров')}</div></div><div><div class="v">${works.length}</div><div class="k">${plural(works.length, 'работа', 'работы', 'работ')} в портфолио</div></div><div><div class="v green">${openOrders.length}</div><div class="k">${plural(openOrders.length, 'открытый', 'открытых', 'открытых')} ${orderWord(openOrders.length)}</div></div>`;

var categoriesHtml = '';
for (var c = 0; c < categories.length; c++) {
  var count = 0;
  for (var m = 0; m < modelers.length; m++) {
    if (modelers[m].categoryId === categories[c].id) count++;
  }
  categoriesHtml += ` <a class="card card-hover cat-card" href="${link('catalog.html')}?cat=${categories[c].id}"><span><span class="n">${categories[c].name}</span><br><span class="muted tiny">${count} ${plural(count, 'модельер', 'модельера', 'модельеров')}</span></span></a>`;
}
document.getElementById('categories').innerHTML = categoriesHtml;

var best = allModelers();
best.sort(function (a, b) {
  return b.rating - a.rating;
});

var modelersHtml = '';
for (var b = 0; b < 6 && b < best.length; b++) {
  modelersHtml += modelerCard(best[b]);
}
document.getElementById('topModelers').innerHTML = modelersHtml ||
  emptyBox(`Модельеров пока нет. <a href="${link('login.html')}?tab=register">Зарегистрироваться как исполнитель</a>`);
bindFavorites();

sortByDate(openOrders);
var ordersHtml = '';
for (var o = 0; o < 3 && o < openOrders.length; o++) {
  ordersHtml += orderCard(openOrders[o]);
}
document.getElementById('openOrders').innerHTML = ordersHtml ||
  emptyBox(`Открытых заказов пока нет. <a href="${link('create-order.html')}">Разместить первый</a>`);

var sumInput = document.getElementById('commTotal');
var resultBox = document.getElementById('commResult');

document.getElementById('commRate').textContent = commissionPercent();

function showCommission() {
  var total = Number(sumInput.value) || 0;
  var fee = commissionOf(total);

  resultBox.innerHTML = ` <div class="money-line"><span class="muted">Заказчик платит</span><span>${money(total)}</span></div><div class="money-line"><span class="muted">Комиссия площадки, ${commissionPercent()}</span><span class="green">${money(fee)}</span></div><div class="money-line total"><span>Получает исполнитель</span><span>${money(total - fee)}</span></div>`;
}

sumInput.oninput = showCommission;
showCommission();
