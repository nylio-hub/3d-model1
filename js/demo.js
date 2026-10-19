var DEMO_PASSWORD = '1234';

var DEMO_MODELERS = [
  {
    name: 'Артём Ковалёв', email: 'artem@mail.ru', city: 'Москва', cat: 'c1',
    spec: 'Персонажи и существа для игр', price: 12000, days: 9, done: 24,
    skills: ['Blender', 'ZBrush', 'Substance Painter', 'Ретопология'],
    bio: 'Семь лет делаю игровых персонажей: от концепта до готовой к анимации модели. Работаю с топологией под риг, запекаю карты, отдаю исходники в .blend и .fbx.',
    works: [['Орк-берсерк для RPG', 28000], ['Стилизованная героиня', 22000], ['Набор голов для NPC', 15000]]
  },
  {
    name: 'Алина Ветрова', email: 'alina@mail.ru', city: 'Санкт-Петербург', cat: 'c4',
    spec: 'Интерьеры и предметная визуализация', price: 9000, days: 6, done: 41,
    skills: ['Blender', 'Cycles', 'Освещение', 'Материалы'],
    bio: 'Делаю интерьерные сцены для мебельных салонов и дизайнеров. Собираю сцену по обмерному плану, подбираю свет и материалы, отдаю рендеры в 4K.',
    works: [['Гостиная в скандинавском стиле', 24000], ['Кухня-остров', 19000], ['Санузел для каталога', 14000]]
  },
  {
    name: 'Дмитрий Соколов', email: 'dmitry@mail.ru', city: 'Казань', cat: 'c2',
    spec: 'Хардсёрфейс: оружие и техника', price: 15000, days: 12, done: 18,
    skills: ['Blender', 'Marmoset', 'Hard surface', 'PBR'],
    bio: 'Специализируюсь на технике и оружии для шутеров. Высокий и низкий поли, запечённые карты, аккуратные сетки без лишних треугольников.',
    works: [['Штурмовая винтовка', 34000], ['Багги для гонок', 41000], ['Дрон-разведчик', 26000]]
  },
  {
    name: 'Мария Литвинова', email: 'maria@mail.ru', city: 'Новосибирск', cat: 'c7',
    spec: 'Ювелирные модели под литьё', price: 7000, days: 5, done: 33,
    skills: ['Blender', 'Ювелирка', 'STL', 'Восковая печать'],
    bio: 'Готовлю ювелирные модели сразу под печать и литьё: проверяю толщины стенок, посадку камней и литники. Работаю с гравировкой и авторскими формами.',
    works: [['Кольцо с гравировкой', 11000], ['Подвеска «Лист»', 8000], ['Серьги с фианитами', 13000]]
  },
  {
    name: 'Игорь Панов', email: 'igor@mail.ru', city: 'Екатеринбург', cat: 'c5',
    spec: 'Модели под FDM и SLA-печать', price: 4500, days: 4, done: 57,
    skills: ['Blender', 'FreeCAD', 'STL', 'Допуски'],
    bio: 'Проектирую корпуса, крепления и функциональные детали под печать. Считаю допуски, проверяю модель в слайсере до отправки заказчику.',
    works: [['Корпус для датчика', 7500], ['Кронштейн для камеры', 6000], ['Органайзер для стола', 5000]]
  },
  {
    name: 'Ника Тарасова', email: 'nika@mail.ru', city: 'Москва', cat: 'c6',
    spec: 'Low-poly ассеты и окружение', price: 6000, days: 7, done: 29,
    skills: ['Blender', 'Low-poly', 'Unity', 'Тайловые текстуры'],
    bio: 'Собираю наборы ассетов для мобильных и инди-проектов: дома, деревья, мебель, пропсы. Слежу за единым стилем и бюджетом полигонов.',
    works: [['Набор из 12 домов', 25000], ['Лесное окружение', 18000], ['Пропсы для таверны', 12000]]
  },
  {
    name: 'Павел Ершов', email: 'pavel@mail.ru', city: 'Сочи', cat: 'c3',
    spec: 'Экстерьеры и архитектурная визуализация', price: 20000, days: 14, done: 11,
    skills: ['Blender', 'Архитектура', 'Ландшафт', 'Постобработка'],
    bio: 'Визуализирую частные дома и небольшие общественные здания. Работаю по чертежам архитектора, собираю окружение, ландшафт и вечерний свет.',
    works: [['Загородный дом', 42000], ['Кафе на набережной', 38000]]
  },
  {
    name: 'Ольга Дёмина', email: 'olga@mail.ru', city: 'Краснодар', cat: 'c8',
    spec: 'Рендеры товаров для маркетплейсов', price: 8000, days: 5, done: 36,
    skills: ['Blender', 'Продуктовый рендер', 'Студийный свет', 'Композиция'],
    bio: 'Делаю карточки товаров без фотосъёмки: студийный свет, чистый фон, серия ракурсов в одном стиле. Флаконы, техника, упаковка, косметика.',
    works: [['Флакон парфюма', 19000], ['Кофемашина', 17000], ['Коробка косметики', 9000]]
  }
];

var DEMO_CUSTOMERS = [
  { name: 'Сергей Бирюков', email: 'sergey@mail.ru', city: 'Москва' },
  { name: 'Екатерина Нестерова', email: 'kate@mail.ru', city: 'Санкт-Петербург' },
  { name: 'Владислав Гурин', email: 'vlad@mail.ru', city: 'Краснодар' }
];

var DEMO_ORDERS = [
  { customer: 0, modeler: 0, status: 'done', cat: 'c1', title: 'Персонаж-наёмник для инди-игры',
    desc: 'Нужен игровой персонаж по концепту: мужчина в лёгкой броне, стилизация под мультяшный реализм. Топология под риг, две карты 2K.',
    budget: 30000, agreed: 28000, created: -62, deadline: -40,
    review: { rating: 5, text: 'Модель пришла раньше срока, топология чистая, риг лёг без единой правки.' } },

  { customer: 2, modeler: 0, status: 'done', cat: 'c1', title: 'Стилизованная героиня для трейлера',
    desc: 'Женский персонаж для короткого ролика. Анимации не нужны, но нужна аккуратная сетка и материалы под Cycles.',
    budget: 26000, agreed: 25000, created: -20, deadline: -6,
    review: { rating: 4, text: 'В целом хорошо, но пришлось просить доработать кисти рук.' } },

  { customer: 1, modeler: 1, status: 'done', cat: 'c4', title: 'Визуализация гостиной 24 м²',
    desc: 'Есть обмерный план и подборка мебели. Нужны четыре ракурса днём и один вечерний, разрешение 4K.',
    budget: 24000, agreed: 22000, created: -58, deadline: -38,
    review: { rating: 5, text: 'Очень аккуратная работа, все правки внесла за один день.' } },

  { customer: 0, modeler: 1, status: 'done', cat: 'c4', title: 'Санузел для мебельного каталога',
    desc: 'Небольшая сцена под каталог: тумба, зеркало, свет. Фон нейтральный, нужны два ракурса.',
    budget: 15000, agreed: 14000, created: -18, deadline: -5,
    review: { rating: 5, text: 'Сделала быстро и ровно в стиле остальных карточек каталога.' } },

  { customer: 2, modeler: 2, status: 'done', cat: 'c2', title: 'Штурмовая винтовка для шутера',
    desc: 'Оружие для игры от первого лица. Нужны high-poly, low-poly до 15 тысяч треугольников и запечённые PBR-карты.',
    budget: 35000, agreed: 34000, created: -50, deadline: -30,
    review: { rating: 4, text: 'Хардсёрфейс отличный, но по срокам вышли на три дня позже.' } },

  { customer: 0, modeler: 3, status: 'done', cat: 'c7', title: 'Кольцо с гравировкой под литьё',
    desc: 'Обручальное кольцо с растительной гравировкой. Нужен STL, готовый к восковой печати, толщина стенки от 0,8 мм.',
    budget: 12000, agreed: 11000, created: -46, deadline: -28,
    review: { rating: 5, text: 'Файл сразу ушёл в печать, ювелир принял без замечаний.' } },

  { customer: 1, modeler: 4, status: 'done', cat: 'c5', title: 'Корпус для датчика под FDM',
    desc: 'Корпус на плату 40 на 60 мм, крепление на два винта М3, крышка на защёлках. Печать PLA, сопло 0,4.',
    budget: 8000, agreed: 7500, created: -40, deadline: -25,
    review: { rating: 5, text: 'Собралось с первого раза, все допуски выверены.' } },

  { customer: 2, modeler: 5, status: 'done', cat: 'c6', title: 'Набор из 12 low-poly домов',
    desc: 'Городской набор для мобильной игры: жилые дома, лавка, ратуша. Единый стиль, атлас текстур 1K на весь набор.',
    budget: 26000, agreed: 25000, created: -36, deadline: -18,
    review: { rating: 4, text: 'Ассеты хорошие, текстуры немного подправляли под наш шейдер.' } },

  { customer: 0, modeler: 6, status: 'done', cat: 'c3', title: 'Экстерьер загородного дома',
    desc: 'Двухэтажный дом по чертежам архитектора. Нужны три ракурса, ландшафт с участком и вечерний свет.',
    budget: 45000, agreed: 42000, created: -30, deadline: -12,
    review: { rating: 5, text: 'Ракурсы подобраны отлично, заказчик согласовал проект с первого показа.' } },

  { customer: 1, modeler: 7, status: 'done', cat: 'c8', title: 'Рендеры флакона парфюма, 5 ракурсов',
    desc: 'Стеклянный флакон с колпачком под золото. Белый фон, мягкие отражения, серия в одном стиле для маркетплейса.',
    budget: 20000, agreed: 19000, created: -26, deadline: -10,
    review: { rating: 5, text: 'Свет выставлен профессионально, забрали всю серию без правок.' } },

  { customer: 2, modeler: 0, status: 'in_progress', cat: 'c1', title: 'Три существа для мобильной игры',
    desc: 'Три противника низкого уровня в едином стиле: слизень, крыса-переросток и голем. Бюджет 6 тысяч треугольников на модель.',
    budget: 40000, agreed: 38000, created: -8, deadline: 12,
    chat: [
      [0, 'Добрый день! Референсы приложил в описании, можно начинать.'],
      [1, 'Принял, спасибо. Блокаут всех трёх покажу через три дня.'],
      [0, 'Отлично, жду. Главное - силуэты, они должны читаться на маленьком экране.']
    ] },

  { customer: 0, modeler: 1, status: 'review', cat: 'c4', title: 'Кухня-гостиная для каталога мебели',
    desc: 'Сцена 32 м² с островом и обеденной зоной. Нужны три дневных ракурса под карточки товара.',
    budget: 27000, agreed: 26000, created: -14, deadline: 4,
    chat: [
      [1, 'Сдала первую версию, посмотрите, пожалуйста, свет на втором ракурсе.'],
      [0, 'Спасибо, смотрю сегодня вечером и пишу правки.']
    ] },

  { customer: 0, status: 'open', cat: 'c8', title: 'Модель кофемашины для карточки товара',
    desc: 'Нужна модель бытовой кофемашины по фотографиям и три студийных рендера на белом фоне для маркетплейса.',
    budget: 18000, created: -3, deadline: 11,
    proposals: [
      { modeler: 7, price: 17000, days: 5, text: 'Делала похожую технику, примеры есть в портфолио. Соберу модель по фото и отдам три ракурса в 4K.' },
      { modeler: 1, price: 19500, days: 6, text: 'Могу взять с расширенным светом и дополнительным ракурсом сверху.' }
    ] },

  { customer: 1, status: 'open', cat: 'c2', title: 'Стилизованный меч для портфолио',
    desc: 'Фэнтезийный меч по концепту, low-poly с запечёнными картами. Нужны исходники и рендер в Marmoset.',
    budget: 9000, created: -2, deadline: 9,
    proposals: [
      { modeler: 2, price: 9000, days: 4, text: 'Возьмусь, оружие - мой основной профиль. Отдам high, low и полный набор карт.' },
      { modeler: 5, price: 8500, days: 6, text: 'Сделаю в стилизованном ключе, если нужен более мультяшный вариант.' }
    ] },

  { customer: 2, status: 'open', cat: 'c5', title: 'Подставка под телефон для 3D-печати',
    desc: 'Складная подставка под смартфон, печать без поддержек, регулируемый угол. Нужен STL и превью-рендер.',
    budget: 5000, created: -1, deadline: 7,
    proposals: [
      { modeler: 4, price: 4500, days: 3, text: 'Спроектирую под печать без поддержек и проверю в слайсере перед сдачей.' }
    ] },

  { customer: 0, status: 'cancelled', cat: 'c6', title: 'Анимация робота на 10 секунд',
    desc: 'Требовалась короткая анимация ходьбы робота для презентации. Задачу закрыли своими силами, заказ снят.',
    budget: 30000, created: -20, deadline: -2 }
];

function demoDate(shift) {
  var date = new Date();
  date.setDate(date.getDate() + shift);
  return date.toISOString().slice(0, 10);
}

function fillDemoData() {
  users = [];
  modelers = [];
  works = [];
  orders = [];
  proposals = [];
  reviews = [];
  messages = [];

  var modelerIds = [];
  var customerIds = [];
  var i;

  for (i = 0; i < DEMO_MODELERS.length; i++) {
    var m = DEMO_MODELERS[i];
    var modelerId = 'dm' + (i + 1);
    modelerIds.push(modelerId);

    users.push({
      id: modelerId, name: m.name, email: m.email, password: DEMO_PASSWORD,
      role: 'modeler', city: m.city, registered: demoDate(-400 + i * 30),
      color: AVATAR_COLORS[i % AVATAR_COLORS.length], favorites: []
    });

    modelers.push({
      userId: modelerId, spec: m.spec, categoryId: m.cat, priceFrom: m.price,
      rating: 0, ordersDone: m.done, days: m.days, skills: m.skills, bio: m.bio
    });

    for (var w = 0; w < m.works.length; w++) {
      works.push({
        id: 'dw' + works.length, modelerId: modelerId, categoryId: m.cat,
        title: m.works[w][0], price: m.works[w][1],
        color: COVER_COLORS[works.length % COVER_COLORS.length]
      });
    }
  }

  for (i = 0; i < DEMO_CUSTOMERS.length; i++) {
    var c = DEMO_CUSTOMERS[i];
    var customerId = 'dc' + (i + 1);
    customerIds.push(customerId);

    users.push({
      id: customerId, name: c.name, email: c.email, password: DEMO_PASSWORD,
      role: 'customer', city: c.city, registered: demoDate(-300 + i * 40),
      color: AVATAR_COLORS[(i + 4) % AVATAR_COLORS.length], favorites: []
    });
  }

  for (i = 0; i < DEMO_ORDERS.length; i++) {
    var o = DEMO_ORDERS[i];
    var orderId = 'do' + (i + 1);
    var customer = customerIds[o.customer];
    var worker = o.modeler === undefined ? null : modelerIds[o.modeler];

    orders.push({
      id: orderId, customerId: customer, title: o.title, description: o.desc,
      categoryId: o.cat, budget: o.budget, deadline: demoDate(o.deadline),
      status: o.status, modelerId: worker, agreedPrice: o.agreed || null,
      createdAt: demoDate(o.created)
    });

    if (worker) {
      proposals.push({
        id: 'dp' + proposals.length, orderId: orderId, modelerId: worker,
        price: o.agreed, days: 10,
        message: 'Задача понятна, берусь. Готов начать сразу после подтверждения.',
        status: 'accepted', createdAt: demoDate(o.created + 1)
      });
    }

    for (var p = 0; o.proposals && p < o.proposals.length; p++) {
      var pr = o.proposals[p];
      proposals.push({
        id: 'dp' + proposals.length, orderId: orderId, modelerId: modelerIds[pr.modeler],
        price: pr.price, days: pr.days, message: pr.text,
        status: 'sent', createdAt: demoDate(o.created + 1)
      });
    }

    if (o.review) {
      reviews.push({
        id: 'dr' + reviews.length, orderId: orderId, authorId: customer, modelerId: worker,
        rating: o.review.rating, text: o.review.text, createdAt: demoDate(o.deadline + 1)
      });
    }

    for (var t = 0; o.chat && t < o.chat.length; t++) {
      messages.push({
        id: 'dmsg' + messages.length, orderId: orderId,
        authorId: o.chat[t][0] === 0 ? customer : worker,
        text: o.chat[t][1], createdAt: demoDate(o.created + t + 1)
      });
    }
  }

  for (i = 0; i < modelers.length; i++) {
    var mine = filterBy(reviews, 'modelerId', modelers[i].userId);
    var sum = 0;
    for (var r = 0; r < mine.length; r++) sum += mine[r].rating;
    modelers[i].rating = mine.length ? Math.round((sum / mine.length) * 10) / 10 : 0;
  }

  findUser(customerIds[0]).favorites = [modelerIds[0], modelerIds[6]];

  saveData();
}
