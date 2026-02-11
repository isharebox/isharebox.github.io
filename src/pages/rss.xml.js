import rss from '@astrojs/rss';
import fs from 'fs';
import path from 'path';

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
    // 尝试多个可能的路径
    const possiblePaths = [
      path.join(process.cwd(), 'src', 'content', 'posts'),
      path.join(process.cwd(), 'dist', 'src', 'content', 'posts'),
      '/src/content/posts',
      './src/content/posts',
    ];
    
    let postsDir = null;
    let files = [];
    
    for (const dir of possiblePaths) {
      try {
        if (fs.existsSync(dir)) {
          const dirFiles = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
          if (dirFiles.length > 0) {
            postsDir = dir;
            files = dirFiles;
            break;
          }
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!postsDir || files.length === 0) {
      // 列出当前目录结构用于调试
      let debugInfo = '';
      try {
        debugInfo = `CWD: ${process.cwd()}\n`;
        debugInfo += `Contents: ${fs.readdirSync(process.cwd()).join(', ')}\n`;
        if (fs.existsSync('./src')) {
          debugInfo += `src: ${fs.readdirSync('./src').join(', ')}\n`;
        }
      } catch (e) {
        debugInfo = `Error listing: ${e.message}`;
      }
      
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
        <error>
          <message>No JSON files found</message>
          <debug>${debugInfo}</debug>
          <checked>${possiblePaths.join(', ')}</checked>
        </error>`, 
        { 
          status: 200,
          headers: { 'Content-Type': 'application/xml' }
        }
      );
    }

    const posts = files
      .map((file) => {
        const filePath = path.join(postsDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const slug = file.replace('.json', '');
        
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
      `<?xml version="1.0" encoding="UTF-8"?><error>${error.message}\n${error.stack}</error>`, 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/xml' }
      }
    );
  }
}
