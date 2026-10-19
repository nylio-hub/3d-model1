var categories = [
  { id: 'c1', name: 'Персонажи' },
  { id: 'c2', name: 'Оружие и техника' },
  { id: 'c3', name: 'Архитектура' },
  { id: 'c4', name: 'Интерьер и мебель' },
  { id: 'c5', name: 'Модели для 3D-печати' },
  { id: 'c6', name: 'Игровые ассеты' },
  { id: 'c7', name: 'Украшения' },
  { id: 'c8', name: 'Продуктовая визуализация' }
];

var AVATAR_COLORS = ['#7a6ea8', '#5f8a6e', '#a8815f', '#5f7fa8', '#a86f85', '#7f8a55', '#5f8a8a', '#8a7355'];
var COVER_COLORS = ['#ece7f5', '#e4eee7', '#f3e9e2', '#e5ecf3', '#f2e6ec', '#eef0e2', '#e9eef0', '#f0eae0'];

var users = [];
var modelers = [];
var works = [];
var orders = [];
var proposals = [];
var reviews = [];
var messages = [];

var STORAGE_KEY = 'hub3d_data';
var COMMISSION = 0.02;

function saveData() {
  var data = {
    users: users,
    modelers: modelers,
    works: works,
    orders: orders,
    proposals: proposals,
    reviews: reviews,
    messages: messages
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn(e);
  }
}

function loadData() {
  var saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return;
  }
  if (!saved) return;

  var data = JSON.parse(saved);
  users = data.users;
  modelers = data.modelers;
  works = data.works;
  orders = data.orders;
  proposals = data.proposals;
  reviews = data.reviews;
  messages = data.messages || [];
}

function newId(prefix) {
  return prefix + Date.now() + Math.floor(Math.random() * 100);
}

function findBy(list, field, value) {
  for (var i = 0; i < list.length; i++) {
    if (list[i][field] === value) return list[i];
  }
  return null;
}

function filterBy(list, field, value) {
  var found = [];
  for (var i = 0; i < list.length; i++) {
    if (list[i][field] === value) found.push(list[i]);
  }
  return found;
}

function removeBy(list, field, value) {
  for (var i = 0; i < list.length; i++) {
    if (list[i][field] === value) {
      list.splice(i, 1);
      return;
    }
  }
}

function findUser(id) { return findBy(users, 'id', id); }
function findCategory(id) { return findBy(categories, 'id', id); }
function findOrder(id) { return findBy(orders, 'id', id); }
function findWork(id) { return findBy(works, 'id', id); }

function worksOf(modelerId) { return filterBy(works, 'modelerId', modelerId); }
function proposalsOf(orderId) { return filterBy(proposals, 'orderId', orderId); }
function proposalsByModeler(id) { return filterBy(proposals, 'modelerId', id); }
function reviewsOf(modelerId) { return sortByDate(filterBy(reviews, 'modelerId', modelerId)); }

function hasProposal(orderId, modelerId) { return findBy(proposalsOf(orderId), 'modelerId', modelerId) !== null; }
function hasReview(orderId) { return findBy(reviews, 'orderId', orderId) !== null; }

function categoryName(id) {
  var category = findCategory(id);
  return category ? category.name : '';
}

function findUserByEmail(email) {
  var wanted = email.trim().toLowerCase();
  for (var i = 0; i < users.length; i++) {
    if (users[i].email.toLowerCase() === wanted) return users[i];
  }
  return null;
}

function findModeler(userId) {
  var user = findUser(userId);
  var profile = findBy(modelers, 'userId', userId);
  if (!user || !profile) return null;

  return {
    id: user.id, name: user.name, city: user.city, color: user.color,
    registered: user.registered, spec: profile.spec, categoryId: profile.categoryId,
    priceFrom: profile.priceFrom, rating: profile.rating, ordersDone: profile.ordersDone,
    days: profile.days, skills: profile.skills, bio: profile.bio
  };
}

function allModelers() {
  var list = [];
  for (var i = 0; i < modelers.length; i++) {
    var modeler = findModeler(modelers[i].userId);
    if (modeler) list.push(modeler);
  }
  return list;
}

function coverOf(modelerId) {
  var list = worksOf(modelerId);
  return list.length ? list[0].color : '#eceae4';
}

function sortByDate(list) {
  list.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
  return list;
}

function acceptProposal(proposalId) {
  var accepted = findBy(proposals, 'id', proposalId);
  if (!accepted) return;

  var group = proposalsOf(accepted.orderId);
  for (var i = 0; i < group.length; i++) {
    group[i].status = group[i].id === proposalId ? 'accepted' : 'rejected';
  }

  var order = findOrder(accepted.orderId);
  order.modelerId = accepted.modelerId;
  order.agreedPrice = accepted.price;
  order.status = 'in_progress';
  saveData();
}

function addReview(orderId, authorId, modelerId, rating, text) {
  reviews.push({
    id: newId('r'),
    orderId: orderId,
    authorId: authorId,
    modelerId: modelerId,
    rating: Number(rating),
    text: text,
    createdAt: today()
  });

  var mine = filterBy(reviews, 'modelerId', modelerId);
  var sum = 0;
  for (var i = 0; i < mine.length; i++) sum += mine[i].rating;
  var count = mine.length;
  var profile = findBy(modelers, 'userId', modelerId);
  if (profile) profile.rating = Math.round((sum / count) * 10) / 10;
  saveData();
}

function removeOrder(orderId) {
  removeBy(orders, 'id', orderId);
  for (var i = proposals.length - 1; i >= 0; i--) {
    if (proposals[i].orderId === orderId) proposals.splice(i, 1);
  }
  for (var j = messages.length - 1; j >= 0; j--) {
    if (messages[j].orderId === orderId) messages.splice(j, 1);
  }
  saveData();
}

function removeProposal(proposalId) {
  removeBy(proposals, 'id', proposalId);
  saveData();
}

function removeWork(workId) {
  removeBy(works, 'id', workId);
  saveData();
}

function messagesOf(orderId) { return filterBy(messages, 'orderId', orderId); }

function addMessage(orderId, authorId, text) {
  messages.push({
    id: newId('m'),
    orderId: orderId,
    authorId: authorId,
    text: text,
    createdAt: today()
  });
  saveData();
}

function commissionOf(sum) {
  return Math.round(sum * COMMISSION);
}

function commissionPercent() {
  return String(Math.round(COMMISSION * 10000) / 100).replace('.', ',') + '%';
}

function nextAvatarColor() {
  return AVATAR_COLORS[users.length % AVATAR_COLORS.length];
}

function nextCoverColor() {
  return COVER_COLORS[works.length % COVER_COLORS.length];
}

function exportData() {
  var data = {
    users: users,
    modelers: modelers,
    works: works,
    orders: orders,
    proposals: proposals,
    reviews: reviews,
    messages: messages
  };

  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var linkElement = document.createElement('a');

  linkElement.href = url;
  linkElement.download = '3dmodels-data.json';
  linkElement.click();
  URL.revokeObjectURL(url);
}

function importData(file) {
  var reader = new FileReader();

  reader.onload = function () {
    var data = null;
    try {
      data = JSON.parse(reader.result);
    } catch (e) {
      toast('Не удалось прочитать файл: он повреждён или это не файл сайта');
      return;
    }
    if (!data.users || !data.orders) {
      toast('Это не файл с данными сайта');
      return;
    }

    users = data.users;
    modelers = data.modelers;
    works = data.works;
    orders = data.orders;
    proposals = data.proposals;
    reviews = data.reviews;
    messages = data.messages || [];

    saveData();
    toast('Данные загружены');
    setTimeout(function () { location.reload(); }, 900);
  };

  reader.readAsText(file);
}

function clearData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(USER_KEY);
}

loadData();

function today() {
  return new Date().toISOString().slice(0, 10);
}
