import rss from '@astrojs/rss';

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
    // 关键修复：路径必须以 /src/ 开头
    const files = import.meta.glob('/src/content/posts/*.json', { eager: true });
    const fileKeys = Object.keys(files);
    
    if (fileKeys.length === 0) {
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?><error>No posts found. Files checked: /src/content/posts/*.json</error>`, 
        { 
          status: 200,
          headers: { 'Content-Type': 'application/xml' }
        }
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
      `<?xml version="1.0" encoding="UTF-8"?><error>${error.message}</error>`, 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/xml' }
      }
    );
  }
}
