startPage('');

var box = document.getElementById('accountPage');
var user = currentUser();

if (!user) {
  box.innerHTML = `<div class="page-head"><h1>Личный кабинет</h1></div>` +
    emptyBox(`Чтобы попасть в кабинет, <a href="${link('login.html')}">войдите на сайт</a>`);
} else if (user.role === 'modeler') {
  showModelerAccount();
} else {
  showCustomerAccount();
}

function accountHead(buttons) {
  return ` <div class="page-head"><div class="profile-head"><span class="avatar avatar-lg" style="background:${user.color}">${initials(user.name)}</span><div class="info"><h1>${safe(user.name)}</h1><div class="row row-wrap"><span class="badge ${user.role === 'modeler' ? 'badge-violet' : 'badge-dark'}">${roleName(user.role)}</span><span class="muted small">${safe(user.email)}</span><span class="muted small">${safe(user.city)}</span></div></div><div class="profile-actions">${buttons}</div></div></div>`;
}

function statBox(value, caption) {
  return `<div class="stat"><div class="v">${value}</div><div class="k">${caption}</div></div>`;
}

function favoritesSection() {
  var list = favorites();
  var html = '';

  for (var i = 0; i < list.length; i++) {
    var modeler = findModeler(list[i]);
    if (modeler) html += modelerCard(modeler);
  }

  return `<h2 class="mt-3">Избранные модельеры</h2><div class="grid grid-3"> ${html || emptyBox(`Пусто. Нажмите ♥ на карточке модельера в <a href="${link('catalog.html')}">каталоге</a>`)} </div>`;
}

function showCustomerAccount() {
  var myOrders = [];
  var waiting = 0;
  var active = 0;
  var spent = 0;

  for (var i = 0; i < orders.length; i++) {
    if (orders[i].customerId !== user.id) continue;
    myOrders.push(orders[i]);

    if (orders[i].status === 'open') waiting++;
    if (orders[i].status === 'in_progress' || orders[i].status === 'review') active++;
    if (orders[i].status === 'done') spent += orders[i].agreedPrice || orders[i].budget;
  }

  sortByDate(myOrders);

  var listHtml = '';
  for (var j = 0; j < myOrders.length; j++) {
    listHtml += orderCard(myOrders[j]);
  }

  box.innerHTML =
    accountHead(` <a class="btn btn-primary" href="${link('create-order.html')}">Создать заказ</a><a class="btn btn-ghost" href="${link('catalog.html')}">Найти модельера</a><a class="btn btn-ghost" href="${link('profile-edit.html')}">Мой профиль</a>`) + ` <div class="grid grid-4 mb-3"> ${statBox(myOrders.length, 'заказов размещено')} ${statBox(waiting, 'ждут откликов')} ${statBox(active, 'в работе')} ${statBox(money(spent), 'потрачено на заказы')} </div><h2>Мои заказы</h2><div class="grid grid-2"> ${listHtml || emptyBox(`Вы ещё не размещали заказов. <a href="${link('create-order.html')}">Создать первый</a>`)} </div>${favoritesSection()}`;
  bindFavorites(showCustomerAccount);
}

function showModelerAccount() {
  var profile = findModeler(user.id);
  var myOrders = [];
  var active = 0;
  var earned = 0;

  for (var i = 0; i < orders.length; i++) {
    if (orders[i].modelerId !== user.id) continue;
    myOrders.push(orders[i]);

    if (orders[i].status === 'in_progress' || orders[i].status === 'review') active++;
    if (orders[i].status === 'done') {
      var total = orders[i].agreedPrice || orders[i].budget;
      earned += total - commissionOf(total);
    }
  }

  sortByDate(myOrders);

  var myProposals = proposalsByModeler(user.id);
  var waiting = 0;
  var proposalsHtml = '';

  for (var j = 0; j < myProposals.length; j++) {
    var proposal = myProposals[j];
    var order = findOrder(proposal.orderId);
    if (!order) continue;
    if (proposal.status === 'sent') waiting++;

    var label = '<span class="badge badge-warning">На рассмотрении</span>';
    if (proposal.status === 'accepted') label = '<span class="badge badge-success">Приняли</span>';
    if (proposal.status === 'rejected') label = '<span class="badge">Отклонили</span>';

    proposalsHtml += ` <div class="review"><div style="flex:1"><div class="row-between"><a href="${link('order.html')}?id=${order.id}"><b>${safe(order.title)}</b></a> ${label} </div><div class="muted small"> Ваша цена ${money(proposal.price)} · срок ${proposal.days} ${dayWord(proposal.days)} · отклик от ${dateRu(proposal.createdAt)} </div></div></div>`;
  }

  var ordersHtml = '';
  for (var k = 0; k < myOrders.length; k++) {
    ordersHtml += orderCard(myOrders[k]);
  }

  box.innerHTML =
    accountHead(` <a class="btn btn-primary" href="${link('profile-edit.html')}">Редактировать профиль</a><a class="btn btn-ghost" href="${link('modeler.html')}?id=${user.id}">Мой профиль в каталоге</a><a class="btn btn-ghost" href="${link('orders.html')}">Найти заказ</a>`) + ` <div class="grid grid-4 mb-3"> ${statBox(profile.rating.toFixed(1), 'рейтинг')} ${statBox(waiting, 'откликов на рассмотрении')} ${statBox(active, 'заказов в работе')} ${statBox(money(earned), 'заработано после комиссии')} </div><h2>Заказы в работе</h2><div class="grid grid-2 mb-3"> ${ordersHtml || emptyBox(`Пока нет заказов. <a href="${link('orders.html')}">Посмотреть биржу</a>`)} </div><h2>Мои отклики</h2><div class="card"> ${proposalsHtml || emptyBox('Вы ещё никому не откликались')} </div>${favoritesSection()}`;
  bindFavorites(showModelerAccount);
}
