const categories = [
  { id: "all", label: "全部", region: "All cuisines" },
  { id: "lu", label: "鲁", region: "山东菜" },
  { id: "chuan", label: "川", region: "川菜（四川/重庆）" },
  { id: "yue-min", label: "粤闽", region: "粤菜/闽菜" },
  { id: "huaiyang", label: "淮扬", region: "淮扬菜" },
  { id: "hui-xiang", label: "徽湘", region: "徽菜/湘菜" },
  { id: "yungui", label: "云贵", region: "云南/贵州菜" },
  { id: "italy-france", label: "意法", region: "意大利/法国菜" },
  { id: "nanyang", label: "南洋", region: "东南亚菜" },
  { id: "silk-road", label: "Silk-Road", region: "丝路风味" },
  { id: "desserts", label: "Desserts", region: "甜点" },
  { id: "drinks", label: "Drinks", region: "饮品" },
];

const recipes = [
  {
    id: "tangcu-carp",
    title: "糖醋鲤鱼",
    category: "lu",
    categoryLabel: "鲁 · 山东菜",
    blurb: "外壳酥脆、酱汁酸甜透亮，适合周末家宴作为桌面主菜。",
    time: "45 min",
    servings: "3-4 人份",
    difficulty: "中等",
    season: "春 / 秋",
    note: "炸鱼前一定把表面水分擦干，酱汁最后下锅时要保持沸腾，才能挂出明亮的汁衣。",
    palette: ["#d07e49", "#f4ceb0", "#9e5c3b"],
    ingredients: [
      ["鲤鱼", "1 条（约 900g）"],
      ["番茄酱", "30g"],
      ["白糖", "35g"],
      ["香醋", "30ml"],
      ["料酒", "15ml"],
      ["姜末", "10g"],
      ["蒜末", "10g"],
      ["玉米淀粉", "50g"],
      ["清水", "80ml"],
      ["盐", "4g"],
    ],
    steps: [
      "鲤鱼去鳞去腮洗净，两侧各划斜刀，加入盐和料酒，静置 15 分钟入味。",
      "鱼身擦干后均匀裹上玉米淀粉，重点压进刀口，让炸制后纹路张开。",
      "油温升到 175°C，拎住鱼尾先定型再整体下锅，炸至表面金黄酥脆后捞出复炸 30 秒。",
      "另起锅，下少量油炒香姜蒜，加入番茄酱、白糖、香醋和清水，小火熬至冒大泡。",
      "把糖醋汁均匀浇在炸好的鱼身上，趁热上桌。"
    ],
  },
  {
    id: "mapo-tofu",
    title: "麻婆豆腐",
    category: "chuan",
    categoryLabel: "川 · 川菜（四川/重庆）",
    blurb: "豆腐软嫩、肉末酥香，豆瓣与花椒的麻辣层次是关键。",
    time: "25 min",
    servings: "2-3 人份",
    difficulty: "简单",
    season: "四季",
    note: "起锅前最后一勺花椒粉决定香气，别太早放，才能保持明显麻感。",
    palette: ["#bf4b37", "#f1c6b4", "#7f3126"],
    ingredients: [
      ["北豆腐", "400g"],
      ["牛肉末", "120g"],
      ["郫县豆瓣", "25g"],
      ["豆豉", "8g"],
      ["蒜末", "12g"],
      ["花椒粉", "4g"],
      ["辣椒面", "6g"],
      ["生抽", "10ml"],
      ["淀粉水", "40ml"],
      ["葱花", "10g"],
    ],
    steps: [
      "豆腐切 2cm 小块，放入加盐热水中焯 1 分钟，捞出备用。",
      "热锅凉油，下牛肉末炒至酥香出油，再下郫县豆瓣、豆豉和蒜末炒出红油。",
      "倒入 250ml 清水，加入豆腐、生抽和辣椒面，中火轻推煮 3 分钟。",
      "分两次勾入淀粉水，让汤汁包裹豆腐但不厚重。",
      "出锅前撒一半花椒粉和葱花，装盘后再补一层花椒粉提香。"
    ],
  },
  {
    id: "soy-sauce-chicken",
    title: "豉油鸡",
    category: "yue-min",
    categoryLabel: "粤闽 · 粤菜/闽菜",
    blurb: "酱油甜香渗进鸡肉纤维，切块后适合配白米饭或拌面。",
    time: "55 min",
    servings: "4 人份",
    difficulty: "中等",
    season: "四季",
    note: "关火后让鸡继续在卤汁中浸 10 分钟，颜色和味道都会更均匀。",
    palette: ["#8f5b38", "#e7d0a9", "#5f3b1f"],
    ingredients: [
      ["三黄鸡", "1 只（约 1.2kg）"],
      ["生抽", "90ml"],
      ["老抽", "20ml"],
      ["冰糖", "25g"],
      ["姜片", "20g"],
      ["葱结", "2 个"],
      ["八角", "2 个"],
      ["清水", "500ml"],
      ["麻油", "8ml"],
      ["白胡椒", "2g"],
    ],
    steps: [
      "锅中放入生抽、老抽、冰糖、姜片、葱结、八角和清水，煮开后转小火 5 分钟。",
      "把整鸡放入锅中，用勺反复把卤汁淋在鸡身表面，让外皮先均匀上色。",
      "盖盖小火焖 18 分钟，中途翻面 2 次，确保鸡腿根部熟透。",
      "关火焖 10 分钟后捞出，表面刷麻油，静置放凉至可切块。",
      "切件装盘，淋少量原汁，撒白胡椒即可。"
    ],
  },
  {
    id: "lion-head",
    title: "清炖狮子头",
    category: "huaiyang",
    categoryLabel: "淮扬 · 淮扬菜",
    blurb: "肉丸软嫩蓬松，汤底清润，适合作为一锅端上桌的家宴菜。",
    time: "90 min",
    servings: "4 人份",
    difficulty: "中等",
    season: "秋 / 冬",
    note: "肉馅要顺一个方向搅上劲，最后轻轻摔打几次，狮子头口感才会松而不散。",
    palette: ["#b18769", "#f0ddc7", "#7c604f"],
    ingredients: [
      ["猪前腿肉", "500g"],
      ["荸荠", "80g"],
      ["鸡蛋", "1 个"],
      ["葱姜水", "80ml"],
      ["生抽", "15ml"],
      ["白菜叶", "6 片"],
      ["高汤", "900ml"],
      ["盐", "5g"],
      ["白胡椒", "2g"],
      ["淀粉", "15g"],
    ],
    steps: [
      "猪肉切成细丁，荸荠拍碎切末，加入鸡蛋、生抽、盐、胡椒和淀粉拌匀。",
      "分次加入葱姜水，沿一个方向搅打到肉馅起黏性，再摔打几下帮助成型。",
      "双手抹油，把肉馅团成 4 个大丸子，放入七成热油中快速定型后捞出。",
      "砂锅底部铺白菜叶，放入狮子头，注入高汤，大火烧开后转小火炖 1 小时。",
      "出锅前根据咸度补盐，连锅上桌。"
    ],
  },
  {
    id: "duojiao-fish-head",
    title: "剁椒鱼头",
    category: "hui-xiang",
    categoryLabel: "徽湘 · 徽菜/湘菜",
    blurb: "红剁椒铺满鱼头表面，蒸出来酸辣开胃，汤汁拌面也很好。",
    time: "35 min",
    servings: "3 人份",
    difficulty: "简单",
    season: "四季",
    note: "鱼头腌制时先用少量盐和料酒去腥，剁椒已经有咸度，蒸前不要再重手加盐。",
    palette: ["#c23f43", "#f2bdb9", "#7d2228"],
    ingredients: [
      ["花鲢鱼头", "1 个（约 800g）"],
      ["红剁椒", "120g"],
      ["黄剁椒", "40g"],
      ["姜末", "15g"],
      ["蒜末", "15g"],
      ["料酒", "15ml"],
      ["蒸鱼豉油", "20ml"],
      ["糖", "6g"],
      ["葱花", "12g"],
      ["热油", "20ml"],
    ],
    steps: [
      "鱼头洗净从背部劈开，抹少量料酒，腌 10 分钟后摆入深盘。",
      "剁椒与姜末、蒜末、糖和蒸鱼豉油拌匀，均匀铺在鱼头表面。",
      "蒸锅水开后放入鱼头，大火蒸 12 到 15 分钟。",
      "出锅后撒葱花，淋上刚烧热的油激香。",
      "把蒸出的汤汁回淋一遍，立即上桌。"
    ],
  },
  {
    id: "sour-soup-beef",
    title: "酸汤牛肉",
    category: "yungui",
    categoryLabel: "云贵 · 云南/贵州菜",
    blurb: "酸汤清亮、番茄感明显，配蔬菜和米饭都很舒服。",
    time: "40 min",
    servings: "3 人份",
    difficulty: "简单",
    season: "夏 / 秋",
    note: "牛肉下锅后不要久煮，颜色刚变就关火，口感会更嫩。",
    palette: ["#c56f46", "#f1d6b7", "#7d5034"],
    ingredients: [
      ["牛里脊", "300g"],
      ["番茄", "2 个"],
      ["贵州酸汤酱", "45g"],
      ["金针菇", "150g"],
      ["豆腐", "200g"],
      ["姜片", "10g"],
      ["蒜片", "10g"],
      ["白胡椒", "2g"],
      ["清水", "900ml"],
      ["香菜", "10g"],
    ],
    steps: [
      "牛里脊逆纹切薄片，加少量盐和淀粉抓匀，静置 10 分钟。",
      "锅中少油炒香姜蒜和番茄，压出汁水后加入酸汤酱继续翻炒。",
      "倒入清水煮开，下金针菇和豆腐，中火煮 6 分钟。",
      "转小火，把牛肉片一片片滑入汤中，变色后立即关火。",
      "撒白胡椒和香菜，连汤盛出。"
    ],
  },
  {
    id: "tomato-basil-risotto",
    title: "番茄罗勒烩饭",
    category: "italy-france",
    categoryLabel: "意法 · 意大利/法国菜",
    blurb: "米芯保留轻微嚼感，番茄酸甜和奶酪咸香平衡得很适合做正餐。",
    time: "38 min",
    servings: "2 人份",
    difficulty: "中等",
    season: "夏",
    note: "高汤分次加入，每次都让米饭吸收到八成再补下一勺，口感会更顺滑。",
    palette: ["#ba5d4d", "#f5d0ba", "#87614e"],
    ingredients: [
      ["意大利 Arborio 米", "180g"],
      ["番茄", "3 个"],
      ["洋葱碎", "60g"],
      ["蒜末", "8g"],
      ["白葡萄酒", "40ml"],
      ["热高汤", "700ml"],
      ["黄油", "20g"],
      ["帕玛森奶酪", "35g"],
      ["新鲜罗勒", "12g"],
      ["橄榄油", "15ml"],
    ],
    steps: [
      "番茄烫皮切丁，锅中下橄榄油炒香洋葱和蒜末，再加入番茄煮出汁。",
      "倒入生米翻炒 1 分钟，让米粒均匀裹上油脂。",
      "加入白葡萄酒挥发酒精后，开始分次加入热高汤，每次 1 勺。",
      "边搅拌边煮 18 到 20 分钟，直到米芯略有嚼感。",
      "关火后拌入黄油、奶酪和撕碎的罗勒，静置 1 分钟再盛盘。"
    ],
  },
  {
    id: "tom-yum-shrimp",
    title: "冬阴功鲜虾汤",
    category: "nanyang",
    categoryLabel: "南洋 · 东南亚菜",
    blurb: "酸、辣、鲜、香四个方向同时成立，适合做开胃汤或一锅面底。",
    time: "30 min",
    servings: "2-3 人份",
    difficulty: "简单",
    season: "夏 / 冬",
    note: "椰奶不宜久煮，出锅前加入更能保留柔和奶香和汤体的层次。",
    palette: ["#d98a4f", "#f4dcc2", "#8a5332"],
    ingredients: [
      ["鲜虾", "10 只"],
      ["冬阴功酱", "35g"],
      ["香茅", "2 根"],
      ["南姜", "20g"],
      ["柠檬叶", "4 片"],
      ["草菇", "120g"],
      ["小番茄", "8 个"],
      ["鱼露", "18ml"],
      ["椰奶", "120ml"],
      ["青柠汁", "20ml"],
    ],
    steps: [
      "鲜虾去虾线留壳，香茅拍松切段，南姜切片。",
      "锅中加入 900ml 清水，放入香茅、南姜、柠檬叶和冬阴功酱，煮 8 分钟。",
      "下草菇、小番茄和鲜虾，中火煮到虾变红。",
      "加入鱼露和椰奶，小火加热 1 分钟，不要滚沸。",
      "关火后挤入青柠汁，尝味后再调整酸辣度。"
    ],
  },
  {
    id: "cumin-lamb-rack",
    title: "孜然羊排",
    category: "silk-road",
    categoryLabel: "Silk-Road · 丝路风味",
    blurb: "外层辛香干爽，内部保持肉汁，适合作为聚餐时的手抓主菜。",
    time: "50 min",
    servings: "3 人份",
    difficulty: "中等",
    season: "秋 / 冬",
    note: "羊排提前腌 30 分钟以上更入味，最后高火收香能让孜然气息更立体。",
    palette: ["#a15d38", "#ebcfaf", "#6d4227"],
    ingredients: [
      ["羊排", "700g"],
      ["孜然粒", "12g"],
      ["辣椒粉", "6g"],
      ["洋葱", "1/2 个"],
      ["蒜末", "12g"],
      ["生抽", "20ml"],
      ["盐", "5g"],
      ["黑胡椒", "3g"],
      ["食用油", "20ml"],
      ["香菜", "8g"],
    ],
    steps: [
      "羊排切段，加入洋葱丝、蒜末、生抽、盐和黑胡椒抓匀，腌 30 分钟。",
      "平底锅烧热后加少量油，把羊排两面煎至上色。",
      "转中小火加盖焖 8 分钟，让内部成熟。",
      "开盖撒入孜然粒和辣椒粉，大火快速翻炒 1 分钟，让香料裹满表面。",
      "装盘后撒香菜，趁热食用。"
    ],
  },
  {
    id: "caramel-pudding",
    title: "焦糖布丁",
    category: "desserts",
    categoryLabel: "Desserts · 甜点",
    blurb: "奶蛋香干净，焦糖苦甜轻微回甘，做完冷藏后最适合当饭后甜点。",
    time: "80 min",
    servings: "4 杯",
    difficulty: "简单",
    season: "四季",
    note: "过筛后的布丁液会更细腻，烘烤时用热水浴避免表面蜂窝。",
    palette: ["#c59358", "#f4e0ba", "#8d6335"],
    ingredients: [
      ["细砂糖", "70g"],
      ["清水", "25ml"],
      ["全蛋", "2 个"],
      ["蛋黄", "2 个"],
      ["牛奶", "360ml"],
      ["淡奶油", "120ml"],
      ["香草精", "4ml"],
      ["盐", "1g"],
    ],
    steps: [
      "先做焦糖：糖和水放入小锅中，小火熬至琥珀色后立刻倒入布丁杯底部。",
      "牛奶和淡奶油加热到边缘冒小泡，离火加入香草精。",
      "全蛋、蛋黄和少量盐打散，慢慢倒入热奶液中，边倒边搅拌。",
      "将布丁液过筛后倒入模具，放入深烤盘并注入热水至模具 1/2 高。",
      "150°C 烤 35 到 40 分钟，放凉后冷藏 4 小时以上再脱模。"
    ],
  },
  {
    id: "osmanthus-plum-soda",
    title: "桂花乌梅气泡饮",
    category: "drinks",
    categoryLabel: "Drinks · 饮品",
    blurb: "酸梅底带桂花香，加入气泡水后层次轻盈，适合夏天整壶准备。",
    time: "15 min",
    servings: "2 杯",
    difficulty: "简单",
    season: "夏",
    note: "乌梅汁先冰镇，最后再加气泡水，气泡更细密也更清爽。",
    palette: ["#7a4351", "#efd7cc", "#57303c"],
    ingredients: [
      ["乌梅汁", "240ml"],
      ["气泡水", "300ml"],
      ["桂花糖浆", "20ml"],
      ["柠檬片", "4 片"],
      ["冰块", "适量"],
      ["桂花", "少许"],
      ["薄荷叶", "4 片"],
    ],
    steps: [
      "杯中先放入冰块和柠檬片，沿杯壁倒入冰镇乌梅汁。",
      "加入桂花糖浆，用长勺轻轻搅匀。",
      "最后缓慢倒入气泡水，保持明显分层。",
      "表面撒少许桂花和薄荷叶即可。"
    ],
  },
];

const state = {
  activeCategory: "all",
  activeRecipeId: recipes[0].id,
  likes: new Set(loadLikes()),
};

const recipeCount = document.getElementById("recipeCount");
const likedCount = document.getElementById("likedCount");
const likedGrid = document.getElementById("likedGrid");
const categoryFilters = document.getElementById("categoryFilters");
const spotlightCard = document.getElementById("spotlightCard");
const recipeGrid = document.getElementById("recipeGrid");
const recipeSheet = document.getElementById("recipeSheet");
const emptyLikedTemplate = document.getElementById("emptyLikedTemplate");
const exportButtons = [
  document.getElementById("exportPdfButton"),
  document.getElementById("heroExportButton"),
].filter(Boolean);

function loadLikes() {
  try {
    const raw = localStorage.getItem("recipe-notebook-likes");
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function saveLikes() {
  try {
    localStorage.setItem("recipe-notebook-likes", JSON.stringify([...state.likes]));
  } catch (error) {
    // Ignore storage failures so the UI still works in restricted contexts.
  }
}

function getRecipeById(id) {
  return recipes.find((recipe) => recipe.id === id) || recipes[0];
}

function getCategoryById(id) {
  return categories.find((category) => category.id === id) || categories[0];
}

function createRecipeImage(recipe) {
  const [primary, secondary, accent] = recipe.palette;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${secondary}"/>
          <stop offset="100%" stop-color="${primary}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="560" rx="44" fill="url(#bg)"/>
      <circle cx="596" cy="126" r="92" fill="rgba(255,255,255,0.14)"/>
      <circle cx="156" cy="428" r="120" fill="rgba(255,250,240,0.14)"/>
      <ellipse cx="402" cy="290" rx="220" ry="152" fill="#fff7ee"/>
      <ellipse cx="402" cy="296" rx="172" ry="112" fill="${accent}" opacity="0.92"/>
      <ellipse cx="402" cy="296" rx="146" ry="92" fill="${primary}" opacity="0.3"/>
      <path d="M322 234c40 12 73 30 126 26 42-3 73-17 97-31-12 44-20 60-48 88-28 30-61 44-96 44-38 0-69-14-96-40-29-27-40-46-52-87Z" fill="rgba(255,248,238,0.78)"/>
      <g fill="rgba(255,248,238,0.86)">
        <circle cx="348" cy="250" r="18"/>
        <circle cx="450" cy="246" r="14"/>
        <circle cx="486" cy="318" r="16"/>
        <circle cx="322" cy="316" r="12"/>
      </g>
      <rect x="56" y="52" width="252" height="76" rx="22" fill="rgba(255,248,238,0.78)"/>
      <text x="82" y="98" fill="${accent}" font-size="30" font-family="'IBM Plex Mono', monospace">${recipe.categoryLabel}</text>
      <text x="60" y="496" fill="#fff8ef" font-size="56" font-family="'Newsreader', serif">${recipe.title}</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function filteredRecipes() {
  if (state.activeCategory === "all") {
    return recipes;
  }
  return recipes.filter((recipe) => recipe.category === state.activeCategory);
}

function likedRecipes() {
  return recipes.filter((recipe) => state.likes.has(recipe.id));
}

function ensureActiveRecipe() {
  const available = filteredRecipes();
  if (!available.some((recipe) => recipe.id === state.activeRecipeId)) {
    state.activeRecipeId = available[0]?.id || recipes[0].id;
  }
}

function toggleLike(recipeId) {
  if (state.likes.has(recipeId)) {
    state.likes.delete(recipeId);
  } else {
    state.likes.add(recipeId);
  }
  saveLikes();
  render();
}

function setActiveRecipe(recipeId, shouldScroll = false) {
  state.activeRecipeId = recipeId;
  renderSpotlight();
  renderSheet();
  renderRecipeGrid();
  if (shouldScroll) {
    document.getElementById("details")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function renderCounts() {
  recipeCount.textContent = String(recipes.length);
  likedCount.textContent = String(state.likes.size);
}

function renderFilters() {
  categoryFilters.innerHTML = "";
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-chip${category.id === state.activeCategory ? " is-active" : ""}`;
    button.textContent = `${category.label} · ${category.region}`;
    button.setAttribute("aria-pressed", String(category.id === state.activeCategory));
    button.addEventListener("click", () => {
      state.activeCategory = category.id;
      ensureActiveRecipe();
      render();
    });
    categoryFilters.appendChild(button);
  });
}

function renderLiked() {
  const liked = likedRecipes();
  likedGrid.innerHTML = "";

  if (!liked.length) {
    likedGrid.appendChild(emptyLikedTemplate.content.cloneNode(true));
    return;
  }

  liked.forEach((recipe) => {
    const article = document.createElement("article");
    article.className = "liked-card";
    article.innerHTML = `
      <img src="${createRecipeImage(recipe)}" alt="${recipe.title} 配图" />
      <div class="liked-card__body">
        <span class="recipe-card__category">${recipe.categoryLabel}</span>
        <h3>${recipe.title}</h3>
        <p>${recipe.blurb}</p>
        <div class="liked-card__meta">
          <span>${recipe.time}</span>
          <span>${recipe.servings}</span>
          <span>${recipe.difficulty}</span>
        </div>
        <div class="recipe-card__actions">
          <button class="recipe-card__button" type="button" data-open="${recipe.id}">查看完整做法</button>
          <button class="recipe-card__like is-liked" type="button" aria-label="取消喜欢 ${recipe.title}" data-like="${recipe.id}">♥</button>
        </div>
      </div>
    `;
    likedGrid.appendChild(article);
  });
}

function renderSpotlight() {
  const recipe = getRecipeById(state.activeRecipeId);
  spotlightCard.className = "spotlight";
  spotlightCard.innerHTML = `
    <img src="${createRecipeImage(recipe)}" alt="${recipe.title} 配图" />
    <div class="spotlight__body">
      <span class="recipe-card__category">${recipe.categoryLabel}</span>
      <div class="spotlight__title-row">
        <div>
          <h3>${recipe.title}</h3>
          <p>${recipe.blurb}</p>
        </div>
        <button
          class="spotlight__like${state.likes.has(recipe.id) ? " is-liked" : ""}"
          type="button"
          aria-label="${state.likes.has(recipe.id) ? "取消喜欢" : "喜欢"} ${recipe.title}"
          data-like="${recipe.id}"
        >
          ♥
        </button>
      </div>
      <div class="spotlight__meta">
        <span>时长 ${recipe.time}</span>
        <span>分量 ${recipe.servings}</span>
        <span>难度 ${recipe.difficulty}</span>
      </div>
      <div class="spotlight__tags">
        <span class="tag">适合 ${recipe.season}</span>
        <span class="tag">步骤 ${recipe.steps.length} 步</span>
        <span class="tag">配料 ${recipe.ingredients.length} 项</span>
      </div>
      <div class="spotlight__actions">
        <a class="spotlight__action" href="#details" data-open="${recipe.id}">打开详细步骤</a>
      </div>
    </div>
  `;
}

function renderRecipeGrid() {
  const active = getRecipeById(state.activeRecipeId);
  recipeGrid.innerHTML = "";

  filteredRecipes().forEach((recipe) => {
    const article = document.createElement("article");
    article.className = "recipe-card";
    article.innerHTML = `
      <div class="recipe-card__image">
        <img src="${createRecipeImage(recipe)}" alt="${recipe.title} 配图" />
        <div class="recipe-card__pin">
          <span class="pin-tag">${recipe.season}</span>
          <span class="pin-tag">${recipe.ingredients.length} 项配料</span>
          <span class="pin-tag">${recipe.steps.length} 步</span>
        </div>
      </div>
      <div class="recipe-card__body">
        <div class="recipe-card__header">
          <div>
            <span class="recipe-card__category">${recipe.categoryLabel}</span>
            <h3>${recipe.title}</h3>
          </div>
          <button
            class="recipe-card__like${state.likes.has(recipe.id) ? " is-liked" : ""}"
            type="button"
            aria-label="${state.likes.has(recipe.id) ? "取消喜欢" : "喜欢"} ${recipe.title}"
            data-like="${recipe.id}"
          >
            ♥
          </button>
        </div>
        <p>${recipe.blurb}</p>
        <div class="recipe-card__meta">
          <span>时长 ${recipe.time}</span>
          <span>${recipe.servings}</span>
          <span>${recipe.difficulty}</span>
        </div>
        <div class="recipe-card__tags">
          <span class="tag">当前${active.id === recipe.id ? "已选中" : "可查看详情"}</span>
          <span class="tag">适合${recipe.season}</span>
        </div>
        <div class="recipe-card__actions">
          <button class="recipe-card__button" type="button" data-open="${recipe.id}">
            查看制作过程
          </button>
        </div>
      </div>
    `;
    recipeGrid.appendChild(article);
  });
}

function renderSheet() {
  const recipe = getRecipeById(state.activeRecipeId);
  recipeSheet.innerHTML = `
    <div class="sheet__header">
      <div class="sheet__title">
        <span class="recipe-card__category">${recipe.categoryLabel}</span>
        <div class="sheet__title-row">
          <div>
            <h3>${recipe.title}</h3>
            <p class="sheet__intro">${recipe.blurb}</p>
          </div>
          <button
            class="sheet__like${state.likes.has(recipe.id) ? " is-liked" : ""}"
            type="button"
            aria-label="${state.likes.has(recipe.id) ? "取消喜欢" : "喜欢"} ${recipe.title}"
            data-like="${recipe.id}"
          >
            ♥
          </button>
        </div>
        <div class="sheet__meta">
          <span>时长 ${recipe.time}</span>
          <span>分量 ${recipe.servings}</span>
          <span>难度 ${recipe.difficulty}</span>
          <span>适合 ${recipe.season}</span>
        </div>
        <div class="sheet__tags">
          <span class="tag">用量完整</span>
          <span class="tag">步骤清晰</span>
          <span class="tag">首页可收藏</span>
        </div>
      </div>
      <div class="sheet__visual">
        <img src="${createRecipeImage(recipe)}" alt="${recipe.title} 配图" />
      </div>
    </div>
    <div class="sheet__grid">
      <section class="sheet__panel">
        <h4>配料与用量</h4>
        <ul class="ingredients-list">
          ${recipe.ingredients
            .map(
              ([name, amount]) =>
                `<li><strong>${name}</strong><span>${amount}</span></li>`
            )
            .join("")}
        </ul>
      </section>
      <section class="sheet__panel">
        <h4>制作过程</h4>
        <ol class="step-list">
          ${recipe.steps
            .map(
              (step, index) => `
                <li>
                  <span class="step-index">${String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>步骤 ${index + 1}</strong>
                    <p>${step}</p>
                  </div>
                </li>`
            )
            .join("")}
        </ol>
      </section>
    </div>
    <section class="sheet__panel sheet__note">
      <h4>厨房提示</h4>
      <p>${recipe.note}</p>
    </section>
  `;
}

function chunkRecipes(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function buildPrintDocument() {
  const styleUrl = new URL("styles.css", window.location.href).href;
  const groups = chunkRecipes(recipes, 2);
  const now = new Date();
  const exportDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;

  const cover = `
    <section class="print-page print-cover">
      <div class="print-cover__panel">
        <p class="print-kicker">Recipe Notebook Export</p>
        <h1>家庭菜谱册 PDF</h1>
        <p class="print-page__lede">
          这份导出文档包含目录、11 个菜系索引，以及每道菜的配料用量、制作步骤与厨房提示。版式与首页保持同一套纸本菜谱风格。
        </p>
      </div>
      <div class="print-page__footer">Exported on ${exportDate}</div>
    </section>
  `;

  const toc = `
    <section class="print-page">
      <div class="print-section">
        <p class="print-kicker">Table of contents</p>
        <h2>目录</h2>
        <ol class="print-toc">
          ${recipes
            .map(
              (recipe, index) => `
                <li>
                  <span>${String(index + 1).padStart(2, "0")} · ${recipe.title}</span>
                  <span>${recipe.categoryLabel}</span>
                </li>`
            )
            .join("")}
        </ol>
      </div>
    </section>
  `;

  const pages = groups
    .map(
      (group) => `
        <section class="print-page">
          <div class="print-section">
            <p class="print-kicker">Recipes</p>
            <h2>菜谱详情</h2>
            ${group
              .map(
                (recipe) => `
                  <article class="print-recipe">
                    <div>
                      <img src="${createRecipeImage(recipe)}" alt="${recipe.title} 配图" />
                      <p class="recipe-card__category">${recipe.categoryLabel}</p>
                      <h3>${recipe.title}</h3>
                      <p>${recipe.blurb}</p>
                      <div class="print-meta">
                        <span>${recipe.time}</span>
                        <span>${recipe.servings}</span>
                        <span>${recipe.difficulty}</span>
                        <span>${recipe.season}</span>
                      </div>
                    </div>
                    <div class="print-column">
                      <h4>配料与用量</h4>
                      <ul>
                        ${recipe.ingredients
                          .map(([name, amount]) => `<li><strong>${name}</strong> · ${amount}</li>`)
                          .join("")}
                      </ul>
                      <h4 style="margin-top:8mm;">制作过程</h4>
                      <ol>
                        ${recipe.steps.map((step) => `<li>${step}</li>`).join("")}
                      </ol>
                      <h4 style="margin-top:8mm;">厨房提示</h4>
                      <p>${recipe.note}</p>
                    </div>
                  </article>`
              )
              .join("")}
          </div>
        </section>`
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Recipe Notebook PDF Export</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,400;500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="${styleUrl}" />
      </head>
      <body class="print-root">
        ${cover}
        ${toc}
        ${pages}
        <script>
          window.addEventListener("load", () => {
            setTimeout(() => window.print(), 300);
          });
        </script>
      </body>
    </html>`;
}

function exportPdf() {
  const printWindow = window.open("", "_blank", "noopener,noreferrer");
  if (!printWindow) {
    window.alert("浏览器拦截了弹窗，请允许打开新窗口后重试导出。");
    return;
  }
  printWindow.document.open();
  printWindow.document.write(buildPrintDocument());
  printWindow.document.close();
}

function attachEvents() {
  document.addEventListener("click", (event) => {
    const likeButton = event.target.closest("[data-like]");
    if (likeButton) {
      toggleLike(likeButton.getAttribute("data-like"));
      return;
    }

    const openButton = event.target.closest("[data-open]");
    if (openButton) {
      setActiveRecipe(openButton.getAttribute("data-open"), true);
    }
  });

  exportButtons.forEach((button) => {
    button.addEventListener("click", exportPdf);
  });
}

function render() {
  renderCounts();
  renderFilters();
  renderLiked();
  renderSpotlight();
  renderRecipeGrid();
  renderSheet();
}

attachEvents();
render();
