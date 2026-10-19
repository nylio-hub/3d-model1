startPage('');

var user = currentUser();
var form = document.getElementById('orderForm');
var notice = document.getElementById('notice');
var editedOrder = findOrder(getParam('edit'));

if (!user) {
  notice.innerHTML = `<div class="alert">Чтобы разместить заказ, нужно <a href="${link('login.html')}">войти на сайт</a>.</div>`;
  form.hidden = true;
} else if (user.role !== 'customer') {
  notice.innerHTML = `<div class="alert">Вы вошли как модельер. Заказы размещают заказчики. <a href="${link('orders.html')}">Открытые заказы</a>.</div>`;
  form.hidden = true;
} else if (editedOrder && editedOrder.customerId !== user.id) {
  notice.innerHTML = `<div class="alert">Это чужой заказ, его нельзя редактировать.</div>`;
  form.hidden = true;
} else if (editedOrder && editedOrder.status !== 'open') {
  notice.innerHTML = `<div class="alert">Заказ уже в работе, менять условия нельзя.</div>`;
  form.hidden = true;
} else {
  setupForm();
}

function setupForm() {
  var titleInput = document.getElementById('fTitle');
  var descriptionInput = document.getElementById('fDescription');
  var categorySelect = document.getElementById('fCategory');
  var budgetInput = document.getElementById('fBudget');
  var deadlineInput = document.getElementById('fDeadline');
  var preview = document.getElementById('commissionPreview');

  var options = '';
  for (var i = 0; i < categories.length; i++) {
    options += `<option value="${categories[i].id}">${categories[i].name}</option>`;
  }
  categorySelect.innerHTML = options;

  if (editedOrder) {
    document.querySelector('h1').textContent = 'Редактировать заказ';
    document.querySelector('.page-head .muted').textContent = 'Условия можно менять, пока не выбран исполнитель.';
    form.querySelector('button[type="submit"]').textContent = 'Сохранить изменения';

    titleInput.value = editedOrder.title;
    descriptionInput.value = editedOrder.description;
    categorySelect.value = editedOrder.categoryId;
    budgetInput.value = editedOrder.budget;
    deadlineInput.value = editedOrder.deadline;
  } else {
    var deadline = new Date();
    deadline.setDate(deadline.getDate() + 14);
    deadlineInput.value = deadline.toISOString().slice(0, 10);

    var invited = findModeler(getParam('modeler'));
    if (invited) {
      document.getElementById('invitedBox').innerHTML =
        `<div class="alert">Заказ будет предложен модельеру <b>${safe(invited.name)}</b>. Откликнуться смогут и другие.</div>`;
      categorySelect.value = invited.categoryId;
    }
  }

  function showCommission() {
    var total = Number(budgetInput.value) || 0;
    var fee = commissionOf(total);

    preview.innerHTML = ` <div class="money-line"><span class="muted">Вы платите</span><span>${money(total)}</span></div><div class="money-line"><span class="muted">Комиссия площадки, ${commissionPercent()}</span><span class="green">${money(fee)}</span></div><div class="money-line total"><span>Получит исполнитель</span><span>${money(total - fee)}</span></div>`;
  }

  budgetInput.oninput = showCommission;
  showCommission();

  form.onsubmit = function (event) {
    event.preventDefault();

    var title = titleInput.value.trim();
    var description = descriptionInput.value.trim();
    var budget = Number(budgetInput.value);
    var errorBox = document.getElementById('formError');
    var error = '';

    if (title.length < 5) error = 'Название должно быть не короче 5 символов';
    else if (description.length < 20) error = 'Опишите задачу подробнее, хотя бы 20 символов';
    else if (budget < 500) error = 'Укажите бюджет не меньше 500 рублей';
    else if (!deadlineInput.value) error = 'Выберите срок сдачи';
    else if (deadlineInput.value < today()) error = 'Срок сдачи не может быть в прошлом';

    if (error) {
      errorBox.innerHTML = `<div class="error-text">${error}</div>`;
      return;
    }

    if (editedOrder) {
      editedOrder.title = title;
      editedOrder.description = description;
      editedOrder.categoryId = categorySelect.value;
      editedOrder.budget = budget;
      editedOrder.deadline = deadlineInput.value;
      saveData();
      location.href = link('order.html') + '?id=' + editedOrder.id;
      return;
    }

    var order = {
      id: newId('o'),
      customerId: user.id,
      title: title,
      description: description,
      categoryId: categorySelect.value,
      budget: budget,
      deadline: deadlineInput.value,
      status: 'open',
      modelerId: null,
      createdAt: today()
    };

    orders.push(order);
    saveData();
    location.href = link('order.html') + '?id=' + order.id;
  };
}
