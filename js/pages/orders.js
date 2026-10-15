startPage('orders');

var searchInput = document.getElementById('oSearch');
var categorySelect = document.getElementById('oCategory');
var statusSelect = document.getElementById('oStatus');

var categoriesHtml = '<option value="">Все категории</option>';
for (var i = 0; i < categories.length; i++) {
  categoriesHtml += `<option value="${categories[i].id}">${categories[i].name}</option>`;
}
categorySelect.innerHTML = categoriesHtml;

categorySelect.value = getParam('cat');
statusSelect.value = 'open';

function render() {
  var query = searchInput.value.trim().toLowerCase();
  var found = [];

  for (var i = 0; i < orders.length; i++) {
    var order = orders[i];
    var text = (order.title + ' ' + order.description).toLowerCase();

    if (query && text.indexOf(query) === -1) continue;
    if (categorySelect.value && order.categoryId !== categorySelect.value) continue;
    if (statusSelect.value && order.status !== statusSelect.value) continue;
    found.push(order);
  }

  sortByDate(found);

  document.getElementById('ordersCount').innerHTML =
    `<b>${found.length}</b> ${orderWord(found.length)}`;

  var html = '';
  for (var j = 0; j < found.length; j++) {
    html += orderCard(found[j]);
  }
  document.getElementById('ordersList').innerHTML =
    html || emptyBox('Нет заказов, подходящих под выбранные условия');
}

searchInput.oninput = render;
categorySelect.onchange = render;
statusSelect.onchange = render;

document.getElementById('oReset').onclick = function () {
  searchInput.value = '';
  categorySelect.value = '';
  statusSelect.value = '';
  render();
};

render();
