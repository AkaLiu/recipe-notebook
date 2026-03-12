const printDocumentMarkup = sessionStorage.getItem("recipe-notebook-print-document");

if (printDocumentMarkup) {
  document.open();
  document.write(printDocumentMarkup);
  document.close();
} else {
  document.body.innerHTML = `
    <main style="font-family: sans-serif; padding: 24px; line-height: 1.6;">
      <h1 style="margin-top: 0;">找不到可导出的打印内容</h1>
      <p>请返回菜谱首页，点击“一键导出 PDF”后再试一次。</p>
      <p><a href="./">返回首页</a></p>
    </main>
  `;
}
