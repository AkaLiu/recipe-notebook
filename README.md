# Recipe Notebook

静态菜谱网页，适合直接部署到 GitHub Pages。

## 功能

- 11 个菜系分类入口
- 每道菜包含配图、配料用量、制作步骤、厨房提示
- 首页 liked 区域，支持本地持久化收藏
- 一键导出带目录的 PDF 打印页

## 本地预览

可直接用任意静态服务器预览，例如：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 部署到 GitHub Pages

### 方式 1：直接发布根目录

1. 把本项目推到 GitHub 仓库。
2. 进入仓库 `Settings > Pages`。
3. `Build and deployment` 选择 `Deploy from a branch`。
4. Branch 选择 `main`，Folder 选择 `/ (root)`。
5. 保存后等待发布。

### 推荐方式：发布 `main` 分支根目录

这是纯静态站点，不需要构建流程。把 Pages 的 Source 设成 `Deploy from a branch`，Branch 选 `main`，Folder 选 `/ (root)` 即可。
