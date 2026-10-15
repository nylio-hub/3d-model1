startPage('');

var user = currentUser();
var editingWorkId = '';

if (!user) {
  document.getElementById('notice').innerHTML =
    `<div class="alert">Чтобы открыть профиль, нужно <a href="${link('login.html')}">войти на сайт</a>.</div>`;
} else {
  document.getElementById('accountArea').hidden = false;
  setupAccountForm();

  if (user.role === 'modeler') {
    document.getElementById('modelerArea').hidden = false;
    document.getElementById('pageHint').textContent =
      'Заполните описание и добавьте работы, чтобы попасть в каталог.';
    setupProfileForm();
    setupWorkForm();
    showWorks();
  }
}

function categoryOptions() {
  var html = '';
  for (var i = 0; i < categories.length; i++) {
    html += `<option value="${categories[i].id}">${categories[i].name}</option>`;
  }
  return html;
}

function setupAccountForm() {
  document.getElementById('aName').value = user.name;
  document.getElementById('aCity').value = user.city;

  document.getElementById('accountForm').onsubmit = function (event) {
    event.preventDefault();

    var name = document.getElementById('aName').value.trim();
    var city = document.getElementById('aCity').value.trim();
    var oldPassword = document.getElementById('aOldPassword').value;
    var newPassword = document.getElementById('aNewPassword').value;
    var errorBox = document.getElementById('accountError');
    var error = '';

    if (name.length < 2) error = 'Введите имя';
    else if (newPassword && oldPassword !== user.password) error = 'Текущий пароль указан неверно';
    else if (newPassword && newPassword.length < 4) error = 'Новый пароль должен быть не короче 4 символов';

    if (error) {
      errorBox.innerHTML = `<div class="error-text">${error}</div>`;
      return;
    }

    user.name = name;
    user.city = city || 'Не указан';
    if (newPassword) user.password = newPassword;

    saveData();
    document.getElementById('aOldPassword').value = '';
    document.getElementById('aNewPassword').value = '';
    errorBox.innerHTML = '<div class="alert alert-success mt-2">Данные сохранены</div>';
    renderHeader('');
  };
}

function setupProfileForm() {
  var profile = findBy(modelers, 'userId', user.id);

  document.getElementById('pCategory').innerHTML = categoryOptions();
  document.getElementById('wCategory').innerHTML = categoryOptions();

  document.getElementById('pSpec').value = profile.spec;
  document.getElementById('pCategory').value = profile.categoryId;
  document.getElementById('pPrice').value = profile.priceFrom;
  document.getElementById('pDays').value = profile.days;
  document.getElementById('pSkills').value = profile.skills.join(', ');
  document.getElementById('pBio').value = profile.bio;

  document.getElementById('profileForm').onsubmit = function (event) {
    event.preventDefault();

    var spec = document.getElementById('pSpec').value.trim();
    var price = Number(document.getElementById('pPrice').value);
    var days = Number(document.getElementById('pDays').value);
    var bio = document.getElementById('pBio').value.trim();
    var errorBox = document.getElementById('profileError');
    var error = '';

    if (spec.length < 3) error = 'Укажите специализацию';
    else if (price < 500) error = 'Минимальная стоимость не меньше 500 рублей';
    else if (days < 1) error = 'Укажите срок в днях';
    else if (bio.length < 20) error = 'Опишите себя подробнее, хотя бы 20 символов';

    if (error) {
      errorBox.innerHTML = `<div class="error-text">${error}</div>`;
      return;
    }

    var skills = [];
    var parts = document.getElementById('pSkills').value.split(',');
    for (var i = 0; i < parts.length; i++) {
      var skill = parts[i].trim();
      if (skill) skills.push(skill);
    }

    profile.spec = spec;
    profile.categoryId = document.getElementById('pCategory').value;
    profile.priceFrom = price;
    profile.days = days;
    profile.skills = skills;
    profile.bio = bio;

    saveData();
    errorBox.innerHTML = '<div class="alert alert-success mt-2">Профиль сохранён</div>';
  };
}

function showWorks() {
  var list = worksOf(user.id);
  var html = '';

  for (var i = 0; i < list.length; i++) {
    html += ` <div class="card work-card"><div class="cover" style="background-color:${list[i].color}"></div><div class="work-body"><div class="t">${safe(list[i].title)}</div><div class="muted small mb-1">${money(list[i].price)}</div><div class="row"><button class="btn-reset edit-work" data-id="${list[i].id}">Изменить</button><button class="btn-reset delete-work" data-id="${list[i].id}">Удалить</button></div></div></div>`;
  }

  document.getElementById('worksList').innerHTML =
    html || emptyBox('Работ пока нет. Добавьте первую в форме ниже.');

  var editButtons = document.querySelectorAll('.edit-work');
  for (var j = 0; j < editButtons.length; j++) {
    editButtons[j].onclick = function () {
      startEditWork(this.dataset.id);
    };
  }

  var deleteButtons = document.querySelectorAll('.delete-work');
  for (var k = 0; k < deleteButtons.length; k++) {
    deleteButtons[k].onclick = function () {
      if (!confirm('Удалить работу из портфолио?')) return;
      removeWork(this.dataset.id);
      if (editingWorkId === this.dataset.id) stopEditWork();
      showWorks();
    };
  }
}

function startEditWork(workId) {
  var work = findWork(workId);
  editingWorkId = workId;

  document.getElementById('workFormTitle').textContent = 'Изменить работу';
  document.getElementById('workSubmit').textContent = 'Сохранить изменения';
  document.getElementById('workCancel').hidden = false;
  document.getElementById('wTitle').value = work.title;
  document.getElementById('wPrice').value = work.price;
  document.getElementById('wCategory').value = work.categoryId;
  document.getElementById('workForm').scrollIntoView({ behavior: 'smooth' });
}

function stopEditWork() {
  editingWorkId = '';

  document.getElementById('workFormTitle').textContent = 'Добавить работу';
  document.getElementById('workSubmit').textContent = 'Добавить в портфолио';
  document.getElementById('workCancel').hidden = true;
  document.getElementById('wTitle').value = '';
  document.getElementById('wPrice').value = '';
  document.getElementById('workError').innerHTML = '';
}

function setupWorkForm() {
  document.getElementById('workCancel').onclick = stopEditWork;

  document.getElementById('workForm').onsubmit = function (event) {
    event.preventDefault();

    var title = document.getElementById('wTitle').value.trim();
    var price = Number(document.getElementById('wPrice').value);
    var categoryId = document.getElementById('wCategory').value;
    var errorBox = document.getElementById('workError');

    if (title.length < 3) {
      errorBox.innerHTML = '<div class="error-text">Введите название работы</div>';
      return;
    }
    if (price < 500) {
      errorBox.innerHTML = '<div class="error-text">Укажите стоимость не меньше 500 рублей</div>';
      return;
    }

    if (editingWorkId) {
      var work = findWork(editingWorkId);
      work.title = title;
      work.price = price;
      work.categoryId = categoryId;
    } else {
      works.push({
        id: newId('w'),
        modelerId: user.id,
        categoryId: categoryId,
        title: title,
        price: price,
        color: nextCoverColor()
      });
    }

    saveData();
    stopEditWork();
    showWorks();
  };
}
