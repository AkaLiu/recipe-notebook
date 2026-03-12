# Recipe Notebook

静态菜谱网页，适合直接部署到 GitHub Pages。

## 功能

- 11 个菜系分类入口
- 每道菜包含配图、配料用量、制作步骤、厨房提示
- 首页 liked 区域，支持本地持久化收藏
- 一键导出带目录的 PDF 打印页
- 菜谱内容支持从 Markdown 一键生成菜单数据

## 本地预览

可直接用任意静态服务器预览，例如：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 用 Markdown 加新菜

### 1. 复制模板

模板文件在 [content/recipe-template.md](/Users/liutianyu/Workspace/Recipe/content/recipe-template.md#L1)。

必填 frontmatter 字段：

- `id`
- `title`
- `category`
- `time`
- `servings`
- `difficulty`
- `season`
- `blurb`
- `note`
- `palette`

支持的 `category`：

- `lu`
- `chuan`
- `yue-min`
- `huaiyang`
- `hui-xiang`
- `yungui`
- `italy-france`
- `nanyang`
- `silk-road`
- `desserts`
- `drinks`

正文结构固定：

- `## Ingredients` 下每行写成 `- 食材 | 用量`
- `## Steps` 下每行写成 `1. 步骤内容`

### 2. 把 Markdown 放进菜谱目录并重建

如果你的新文件已经写好了，比如在桌面上有 `new-recipe.md`，直接执行：

```bash
python3 scripts/add_recipe.py ~/Desktop/new-recipe.md
```

这个命令会：

- 把 Markdown 复制到 `content/recipes/`
- 自动重建 [recipe-data.js](/Users/liutianyu/Workspace/Recipe/recipe-data.js#L1)

### 3. 只重建数据

如果你已经手动把文件放进 `content/recipes/`，只需要执行：

```bash
python3 scripts/build_recipe_data.py
```

### 4. 生成后的前端数据文件

页面直接读取 [recipe-data.js](/Users/liutianyu/Workspace/Recipe/recipe-data.js#L1)，不要手改这个文件。
真正的内容源文件在 [content/recipes](/Users/liutianyu/Workspace/Recipe/content/recipes)。

## 部署到 GitHub Pages

### 方式 1：直接发布根目录

1. 把本项目推到 GitHub 仓库。
2. 进入仓库 `Settings > Pages`。
3. `Build and deployment` 选择 `Deploy from a branch`。
4. Branch 选择 `main`，Folder 选择 `/ (root)`。
5. 保存后等待发布。

### 推荐方式：发布 `main` 分支根目录

这是纯静态站点，不需要构建流程。把 Pages 的 Source 设成 `Deploy from a branch`，Branch 选 `main`，Folder 选 `/ (root)` 即可。
