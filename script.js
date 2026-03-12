const data = window.RECIPE_NOTEBOOK_DATA;

if (!data || !Array.isArray(data.categories) || !Array.isArray(data.recipes)) {
  throw new Error("recipe-data.js is missing or invalid. Run python3 scripts/build_recipe_data.py.");
}

const categories = data.categories;
const recipes = data.recipes;

const state = {
  activeCategory: "all",
  activeRecipeId: recipes[0]?.id ?? null,
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

function buildPdfMarkup() {
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

  return `${cover}${toc}${pages}`;
}

function setExportBusy(isBusy) {
  exportButtons.forEach((button) => {
    button.disabled = isBusy;
    button.textContent = isBusy ? "正在生成 PDF..." : button.id === "heroExportButton" ? "导出目录版 PDF" : "一键导出 PDF";
  });
}

async function exportPdf() {
  if (typeof window.html2pdf !== "function") {
    window.alert("PDF 导出组件未加载完成，请刷新页面后重试。");
    return;
  }

  const now = new Date();
  const filename = `recipe-notebook-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}.pdf`;

  const exportRoot = document.createElement("div");
  exportRoot.className = "pdf-export-root print-root";
  exportRoot.setAttribute("aria-hidden", "true");
  exportRoot.innerHTML = buildPdfMarkup();
  document.body.appendChild(exportRoot);

  setExportBusy(true);

  try {
    await window.html2pdf()
      .set({
        filename,
        margin: 0,
        image: { type: "jpeg", quality: 0.96 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#f7f1e8",
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: {
          mode: ["css", "legacy"],
        },
      })
      .from(exportRoot)
      .save();
  } catch (error) {
    window.alert("PDF 生成失败，请刷新页面后重试。");
  } finally {
    setExportBusy(false);
    exportRoot.remove();
  }
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
