startPage('');

var loginForm = document.getElementById('loginForm');
var registerForm = document.getElementById('registerForm');
var tabs = document.querySelectorAll('.tab');

function showTab(name) {
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.toggle('is-active', tabs[i].dataset.tab === name);
  }
  loginForm.hidden = name !== 'login';
  registerForm.hidden = name !== 'register';
}

for (var t = 0; t < tabs.length; t++) {
  tabs[t].onclick = function () {
    showTab(this.dataset.tab);
  };
}

if (getParam('tab') === 'register') showTab('register');

var categoryOptions = '';
for (var c = 0; c < categories.length; c++) {
  categoryOptions += `<option value="${categories[c].id}">${categories[c].name}</option>`;
}
document.getElementById('rgCategory').innerHTML = categoryOptions;

var roleInputs = document.querySelectorAll('input[name="role"]');
for (var r = 0; r < roleInputs.length; r++) {
  roleInputs[r].onchange = function () {
    document.getElementById('modelerFields').hidden = this.value !== 'modeler';
  };
}

loginForm.onsubmit = function (event) {
  event.preventDefault();

  var email = document.getElementById('liEmail').value;
  var password = document.getElementById('liPassword').value;
  var user = findUserByEmail(email);
  var errorBox = document.getElementById('loginError');

  if (!user) {
    errorBox.innerHTML = '<div class="error-text">Пользователь с такой почтой не найден</div>';
    return;
  }
  if (user.password !== password) {
    errorBox.innerHTML = '<div class="error-text">Неверный пароль</div>';
    return;
  }

  signIn(user.id);
  location.href = link('account.html');
};

registerForm.onsubmit = function (event) {
  event.preventDefault();

  var name = document.getElementById('rgName').value.trim();
  var email = document.getElementById('rgEmail').value.trim();
  var password = document.getElementById('rgPassword').value;
  var city = document.getElementById('rgCity').value.trim();
  var role = document.querySelector('input[name="role"]:checked').value;
  var errorBox = document.getElementById('registerError');
  var error = '';

  if (name.length < 2) error = 'Введите имя';
  else if (email.indexOf('@') === -1) error = 'Введите корректный адрес почты';
  else if (password.length < 4) error = 'Пароль должен быть не короче 4 символов';
  else if (findUserByEmail(email)) error = 'Такая почта уже зарегистрирована';

  if (error) {
    errorBox.innerHTML = `<div class="error-text">${error}</div>`;
    return;
  }

  var user = {
    id: newId('u'),
    name: name,
    email: email,
    password: password,
    role: role,
    city: city || 'Не указан',
    registered: today(),
    color: nextAvatarColor(),
    favorites: []
  };
  users.push(user);

  if (role === 'modeler') {
    modelers.push({
      userId: user.id,
      spec: 'Начинающий 3D-модельер',
      categoryId: document.getElementById('rgCategory').value,
      priceFrom: Number(document.getElementById('rgPrice').value) || 5000,
      rating: 0,
      ordersDone: 0,
      days: 7,
      skills: ['Blender'],
      bio: 'Профиль только создан.'
    });
  }

  saveData();
  signIn(user.id);
  location.href = link('account.html');
};

function showQuickLogin() {
  var chosen = [];
  var modelerCount = 0;
  var customerCount = 0;

  for (var i = 0; i < users.length; i++) {
    if (users[i].role === 'modeler' && modelerCount < 3) {
      chosen.push(users[i]);
      modelerCount++;
    }
    if (users[i].role === 'customer' && customerCount < 3) {
      chosen.push(users[i]);
      customerCount++;
    }
  }

  if (chosen.length === 0) return;

  var html = '';
  for (var j = 0; j < chosen.length; j++) {
    html += ` <button type="button" class="demo-user" data-id="${chosen[j].id}"><span class="avatar avatar-sm" style="background:${chosen[j].color}">${initials(chosen[j].name)}</span><span><b>${safe(chosen[j].name)}</b> · ${roleName(chosen[j].role)}<br><span class="muted tiny">${safe(chosen[j].email)}</span></span></button>`;
  }

  document.getElementById('quickLogin').innerHTML =
    `<div class="card mt-2"><h3>Быстрый вход</h3>${html}<div class="hint">Нажмите на человека, чтобы войти под ним. Пароль у демо-пользователей: 1234</div></div>`;

  var buttons = document.querySelectorAll('.demo-user');
  for (var k = 0; k < buttons.length; k++) {
    buttons[k].onclick = function () {
      signIn(this.dataset.id);
      location.href = link('account.html');
    };
  }
}

showQuickLogin();
