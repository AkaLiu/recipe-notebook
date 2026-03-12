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

const PDF_PAGE_WIDTH = 595.28;
const PDF_PAGE_HEIGHT = 841.89;
const PDF_MARGIN = 42;
const PDF_CONTENT_WIDTH = PDF_PAGE_WIDTH - PDF_MARGIN * 2;
const PDF_META_GAP = 12;
const PDF_COLUMN_GAP = 22;
const PDF_COLUMN_WIDTH = (PDF_CONTENT_WIDTH - PDF_COLUMN_GAP) / 2;
let recipePdfAssetsPromise = null;

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

function hexToRgbObject(hex) {
  const normalized = hex.replace("#", "");
  const value = parseInt(normalized, 16);
  return {
    r: ((value >> 16) & 255) / 255,
    g: ((value >> 8) & 255) / 255,
    b: (value & 255) / 255,
  };
}

function pdfColor(PDFLib, hex) {
  const { r, g, b } = hexToRgbObject(hex);
  return PDFLib.rgb(r, g, b);
}

function wrapPdfText(text, font, size, maxWidth) {
  const lines = [];
  const paragraphs = String(text).split("\n");

  paragraphs.forEach((paragraph, paragraphIndex) => {
    if (!paragraph) {
      lines.push("");
      return;
    }

    let current = "";
    for (const char of paragraph) {
      const candidate = current + char;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth || !current) {
        current = candidate;
      } else {
        lines.push(current);
        current = char;
      }
    }
    if (current) {
      lines.push(current);
    }

    if (paragraphIndex < paragraphs.length - 1) {
      lines.push("");
    }
  });

  return lines;
}

function drawWrappedText(page, text, options) {
  const {
    font,
    size,
    x,
    y,
    width,
    lineHeight,
    color,
  } = options;
  const lines = wrapPdfText(text, font, size, width);
  let cursorY = y;

  lines.forEach((line) => {
    if (line) {
      page.drawText(line, {
        x,
        y: cursorY - size,
        size,
        font,
        color,
      });
    }
    cursorY -= lineHeight;
  });

  return cursorY;
}

function drawSectionTitle(page, PDFLib, text, x, y, width, font) {
  page.drawText(text, {
    x,
    y: y - 12,
    size: 12,
    font,
    color: pdfColor(PDFLib, "#8f3d4e"),
  });
  page.drawLine({
    start: { x, y: y - 18 },
    end: { x: x + width, y: y - 18 },
    thickness: 1,
    color: pdfColor(PDFLib, "#d8cab8"),
  });
  return y - 28;
}

function drawBanner(page, PDFLib, recipe, font, topY) {
  const primary = pdfColor(PDFLib, recipe.palette[0]);
  const secondary = pdfColor(PDFLib, recipe.palette[1]);
  const accent = pdfColor(PDFLib, recipe.palette[2]);
  const bannerHeight = 132;
  const bannerY = topY - bannerHeight;

  page.drawRectangle({
    x: PDF_MARGIN,
    y: bannerY,
    width: PDF_CONTENT_WIDTH,
    height: bannerHeight,
    color: secondary,
  });
  page.drawRectangle({
    x: PDF_MARGIN,
    y: bannerY + 18,
    width: PDF_CONTENT_WIDTH,
    height: bannerHeight - 18,
    color: primary,
    opacity: 0.88,
  });
  page.drawCircle({
    x: PDF_PAGE_WIDTH - 110,
    y: bannerY + 98,
    size: 34,
    color: PDFLib.rgb(1, 1, 1),
    opacity: 0.15,
  });
  page.drawCircle({
    x: PDF_MARGIN + 66,
    y: bannerY + 36,
    size: 42,
    color: PDFLib.rgb(1, 1, 1),
    opacity: 0.12,
  });
  page.drawRectangle({
    x: PDF_MARGIN + 18,
    y: bannerY + bannerHeight - 36,
    width: 182,
    height: 24,
    color: PDFLib.rgb(1, 1, 1),
    opacity: 0.82,
  });
  page.drawText(recipe.categoryLabel, {
    x: PDF_MARGIN + 28,
    y: bannerY + bannerHeight - 28,
    size: 11,
    font,
    color: accent,
  });
  page.drawText(recipe.title, {
    x: PDF_MARGIN + 24,
    y: bannerY + 44,
    size: 22,
    font,
    color: PDFLib.rgb(1, 1, 1),
  });
  return bannerY - 18;
}

function drawMetaRow(page, PDFLib, recipe, font, y) {
  const metaItems = [
    `时长 ${recipe.time}`,
    `分量 ${recipe.servings}`,
    `难度 ${recipe.difficulty}`,
    `适合 ${recipe.season}`,
  ];
  let cursorX = PDF_MARGIN;
  const boxHeight = 22;

  metaItems.forEach((item) => {
    const textWidth = font.widthOfTextAtSize(item, 10, {});
    const width = textWidth + 18;
    page.drawRectangle({
      x: cursorX,
      y: y - boxHeight,
      width,
      height: boxHeight,
      color: PDFLib.rgb(1, 1, 1),
      borderColor: pdfColor(PDFLib, "#dccdbd"),
      borderWidth: 1,
    });
    page.drawText(item, {
      x: cursorX + 9,
      y: y - 15,
      size: 10,
      font,
      color: pdfColor(PDFLib, "#6c6058"),
    });
    cursorX += width + PDF_META_GAP;
  });

  return y - 34;
}

function loadRecipePdfAssets() {
  if (!recipePdfAssetsPromise) {
    recipePdfAssetsPromise = (async () => {
      const fontResponse = await fetch("./vendor/NotoSansSC-wght.ttf?v=20260312e");
      if (!fontResponse.ok) {
        throw new Error("Failed to load Noto Sans SC font.");
      }
      return {
        PDFLib: window.PDFLib,
        fontkit: window.fontkit,
        fontBytes: await fontResponse.arrayBuffer(),
      };
    })();
  }

  return recipePdfAssetsPromise;
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

function setExportBusy(isBusy) {
  exportButtons.forEach((button) => {
    button.disabled = isBusy;
    button.textContent = isBusy ? "正在生成 PDF..." : button.id === "heroExportButton" ? "下载目录版 PDF" : "下载 PDF 文件";
  });
}

function createExportOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "pdf-export-overlay";
  overlay.innerHTML = `
    <div class="pdf-export-overlay__panel">
      <strong>正在生成 PDF 文件</strong>
      <span>文档页数较多，首次生成可能需要几秒。</span>
    </div>
  `;
  return overlay;
}

async function exportPdf() {
  if (!window.PDFLib || !window.fontkit) {
    window.alert("PDF 导出组件未加载完成，请刷新页面后重试。");
    return;
  }

  const now = new Date();
  const filename = `recipe-notebook-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}.pdf`;

  const exportOverlay = createExportOverlay();
  document.body.appendChild(exportOverlay);

  setExportBusy(true);

  try {
    const { PDFLib, fontkit, fontBytes } = await loadRecipePdfAssets();
    const pdfDoc = await PDFLib.PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const font = await pdfDoc.embedFont(fontBytes, { subset: false });

    const coverPage = pdfDoc.addPage([PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT]);
    coverPage.drawRectangle({
      x: 0,
      y: 0,
      width: PDF_PAGE_WIDTH,
      height: PDF_PAGE_HEIGHT,
      color: pdfColor(PDFLib, "#f7f1e8"),
    });
    coverPage.drawRectangle({
      x: PDF_MARGIN,
      y: 160,
      width: PDF_CONTENT_WIDTH,
      height: PDF_PAGE_HEIGHT - 320,
      color: pdfColor(PDFLib, "#b85b45"),
    });
    coverPage.drawText("Recipe Notebook", {
      x: PDF_MARGIN + 28,
      y: PDF_PAGE_HEIGHT - 240,
      size: 30,
      font,
      color: PDFLib.rgb(1, 1, 1),
    });
    coverPage.drawText("家庭菜谱册 PDF", {
      x: PDF_MARGIN + 28,
      y: PDF_PAGE_HEIGHT - 286,
      size: 22,
      font,
      color: PDFLib.rgb(1, 1, 1),
    });
    coverPage.drawText("包含目录、全部菜谱、配料用量、步骤与厨房提示", {
      x: PDF_MARGIN + 28,
      y: PDF_PAGE_HEIGHT - 330,
      size: 13,
      font,
      color: PDFLib.rgb(1, 1, 1),
    });

    const tocPage = pdfDoc.addPage([PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT]);
    tocPage.drawRectangle({
      x: 0,
      y: 0,
      width: PDF_PAGE_WIDTH,
      height: PDF_PAGE_HEIGHT,
      color: pdfColor(PDFLib, "#f7f1e8"),
    });
    let tocY = PDF_PAGE_HEIGHT - PDF_MARGIN;
    tocPage.drawText("目录", {
      x: PDF_MARGIN,
      y: tocY - 24,
      size: 24,
      font,
      color: pdfColor(PDFLib, "#2d241f"),
    });
    tocY -= 54;
    recipes.forEach((recipe, index) => {
      tocPage.drawText(`${String(index + 1).padStart(2, "0")} · ${recipe.title}`, {
        x: PDF_MARGIN,
        y: tocY - 12,
        size: 12,
        font,
        color: pdfColor(PDFLib, "#2d241f"),
      });
      tocPage.drawText(recipe.categoryLabel, {
        x: PDF_PAGE_WIDTH - PDF_MARGIN - 170,
        y: tocY - 12,
        size: 10,
        font,
        color: pdfColor(PDFLib, "#6c6058"),
      });
      tocPage.drawLine({
        start: { x: PDF_MARGIN, y: tocY - 18 },
        end: { x: PDF_PAGE_WIDTH - PDF_MARGIN, y: tocY - 18 },
        thickness: 0.8,
        color: pdfColor(PDFLib, "#d8cab8"),
      });
      tocY -= 32;
    });

    recipes.forEach((recipe, recipeIndex) => {
      const page = pdfDoc.addPage([PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT]);
      page.drawRectangle({
        x: 0,
        y: 0,
        width: PDF_PAGE_WIDTH,
        height: PDF_PAGE_HEIGHT,
        color: pdfColor(PDFLib, "#f7f1e8"),
      });

      let cursorY = PDF_PAGE_HEIGHT - PDF_MARGIN;
      cursorY = drawBanner(page, PDFLib, recipe, font, cursorY);
      cursorY = drawMetaRow(page, PDFLib, recipe, font, cursorY);
      cursorY = drawWrappedText(page, recipe.blurb, {
        font,
        size: 12,
        x: PDF_MARGIN,
        y: cursorY,
        width: PDF_CONTENT_WIDTH,
        lineHeight: 18,
        color: pdfColor(PDFLib, "#6c6058"),
      }) - 10;

      let leftY = drawSectionTitle(page, PDFLib, "配料与用量", PDF_MARGIN, cursorY, PDF_COLUMN_WIDTH, font);
      recipe.ingredients.forEach(([name, amount]) => {
        page.drawText(name, {
          x: PDF_MARGIN,
          y: leftY - 11,
          size: 10.5,
          font,
          color: pdfColor(PDFLib, "#2d241f"),
        });
        page.drawText(amount, {
          x: PDF_MARGIN + PDF_COLUMN_WIDTH - Math.min(font.widthOfTextAtSize(amount, 10.5), PDF_COLUMN_WIDTH - 8),
          y: leftY - 11,
          size: 10.5,
          font,
          color: pdfColor(PDFLib, "#6c6058"),
        });
        page.drawLine({
          start: { x: PDF_MARGIN, y: leftY - 16 },
          end: { x: PDF_MARGIN + PDF_COLUMN_WIDTH, y: leftY - 16 },
          thickness: 0.6,
          color: pdfColor(PDFLib, "#e1d6ca"),
        });
        leftY -= 24;
      });

      const rightX = PDF_MARGIN + PDF_COLUMN_WIDTH + PDF_COLUMN_GAP;
      let rightY = drawSectionTitle(page, PDFLib, "制作过程", rightX, cursorY, PDF_COLUMN_WIDTH, font);
      recipe.steps.forEach((step, index) => {
        page.drawText(`${index + 1}.`, {
          x: rightX,
          y: rightY - 11,
          size: 10.5,
          font,
          color: pdfColor(PDFLib, "#8f3d4e"),
        });
        rightY = drawWrappedText(page, step, {
          font,
          size: 10.5,
          x: rightX + 18,
          y: rightY,
          width: PDF_COLUMN_WIDTH - 18,
          lineHeight: 15,
          color: pdfColor(PDFLib, "#2d241f"),
        }) - 8;
      });

      const noteTopY = Math.min(leftY, rightY) - 6;
      page.drawRectangle({
        x: PDF_MARGIN,
        y: noteTopY - 78,
        width: PDF_CONTENT_WIDTH,
        height: 78,
        color: PDFLib.rgb(1, 1, 1),
        borderColor: pdfColor(PDFLib, "#d8cab8"),
        borderWidth: 1,
      });
      page.drawText("厨房提示", {
        x: PDF_MARGIN + 16,
        y: noteTopY - 20,
        size: 12,
        font,
        color: pdfColor(PDFLib, "#8f3d4e"),
      });
      drawWrappedText(page, recipe.note, {
        font,
        size: 10.5,
        x: PDF_MARGIN + 16,
        y: noteTopY - 34,
        width: PDF_CONTENT_WIDTH - 32,
        lineHeight: 15,
        color: pdfColor(PDFLib, "#6c6058"),
      });

      page.drawText(`Recipe Notebook · ${String(recipeIndex + 1).padStart(2, "0")}`, {
        x: PDF_MARGIN,
        y: 24,
        size: 9,
        font,
        color: pdfColor(PDFLib, "#8b7b70"),
      });
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const downloadUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = filename;
    downloadLink.click();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  } catch (error) {
    window.alert("PDF 生成失败，请刷新页面后重试。");
  } finally {
    setExportBusy(false);
    exportOverlay.remove();
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
