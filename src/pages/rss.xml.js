// src/pages/rss.xml.js
import rss from '@astrojs/rss';

// 提取纯文本
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
    // 使用相对路径，更可靠
    const files = import.meta.glob('../content/posts/*.json', { eager: true });
    const fileKeys = Object.keys(files);
    
    if (fileKeys.length === 0) {
      return new Response(
        `No posts found. Checked: ../content/posts/*.json`, 
        { status: 500 }
      );
    }

    const posts = fileKeys
      .map((path) => {
        const data = files[path].default;
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

    const feed = await rss({
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

    return new Response(feed.body, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });

  } catch (error) {
    return new Response(
      `RSS Error: ${error.message}\n\nStack: ${error.stack}`, 
      { status: 500 }
    );
  }
}
