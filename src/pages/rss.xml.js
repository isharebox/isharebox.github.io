// src/pages/rss.xml.js
import rss from '@astrojs/rss';
import fs from 'fs';
import path from 'path';

// 从 JSON content 提取纯文本
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
    const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.json'));
    
    const posts = files
      .map(file => {
        const filePath = path.join(postsDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        return {
          title: data.__ud_title || '无标题',
          description: extractText(data.content),
          pubDate: new Date(data.__ud_create_time),
          slug: file.replace('.json', ''),
          draft: data.__ud_draft || false,
          tags: data.__ud_tags || [],
        };
      })
      .filter(post => !post.draft)
      .sort((a, b) => b.pubDate - a.pubDate);

    return rss({
      title: 'isharebox',
      description: 'Digital garden for thoughts, notes, and fragments',
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
    
    // 出错时返回空 RSS 而不是崩溃
    return rss({
      title: 'isharebox',
      description: 'Digital garden for thoughts, notes, and fragments',
      site: context.site,
      items: [],
      customData: `<language>zh-cn</language>`,
    });
  }
}
