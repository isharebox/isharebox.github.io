import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  
  const feed = await rss({
    title: 'isharebox',
    description: 'Digital garden for thoughts, notes, and fragments',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/posts/${post.slug}/`,
    })),
    customData: `<language>zh-cn</language>`,
  });

  return new Response(feed.body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
