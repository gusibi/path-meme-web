import marked from 'marked';

export default ({ app }, inject) => {
    // 配置 marked 选项（如果需要的话）
    marked.setOptions({
        breaks: true, // 将换行符转换为 <br>
        gfm: true, // 启用 GitHub 风格的 Markdown
        // 其他选项...
    });

    // 注入 $md 函数
    // inject('md', (content) => marked(content));
    inject('md', (content) => marked.parse(content));
};