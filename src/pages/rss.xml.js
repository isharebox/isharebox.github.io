// src/pages/rss.xml.js
import rss from '@astrojs/rss';

// 提取纯文本的辅助函数
function extractText(content, maxLength = 200) {
  if (!content || !Array.isArray(content)) return '';
  
  let text = '';
  const traverse = (nodes) => {
    for (const node of nodes) {
      if (text.length >= maxLength) return;
      if (node.type === 'text') {
        text += node.text || '';
      }
      if (node.content) {
        traverse(node.content);
      }
    }
  };
  
  traverse(content);
  return text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');
}

export async function GET(context) {
  try {
    // 使用 Astro 的 glob 导入，更可靠
    const files = import.meta.glob('/src/content/posts/*.json', { eager: true });
    
    console.log('Found files:', Object.keys(files)); // 调试日志
    
    const posts = Object.entries(files)
      .map(([path, module]) => {
        const data = module.default;
        const slug = path.split('/').pop().replace('.json', '');
        
        return {
          title: data.__ud_title || '无标题',
          description: extractText(data.content),
          pubDate: new Date(data.__ud_create_time),
          slug: slug,
          draft: data.__ud_draft || false,
          tags: data.__ud_tags || [],
        };
      })
      .filter(post => !post.draft)
      .sort((a, b) => b.pubDate - a.pubDate);

    console.log('Processed posts:', posts.length); // 调试日志

    return rss({
      title: 'Urodele',
      description: '一念空灭，无处可逃；心无放逸，众善不失',
      site: context.site,
      items: posts.map((post) => ({
        title: post.title,
        description: post.description,
        pubDate: post.pubDate,
        link: `/post/${post.slug}/`,
        categories: post.tags,
      })),
      customData: `<language>zh-cn</language>`,
    });
    
  } catch (error) {
    console.error('RSS generation error:', error);
    
    // 返回包含错误信息的 RSS，方便调试
    return rss({
      title: 'Urodele',
      description: `Error: ${error.message}`,
      site: context.site,
      items: [{
        title: 'Debug Error',
        description: error.message,
        pubDate: new Date(),
        link: '/',
      }],
      customData: `<language>zh-cn</language>`,
    });
  }
}
