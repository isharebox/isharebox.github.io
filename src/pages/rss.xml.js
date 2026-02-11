// src/pages/rss.xml.js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog'); // or your collection name
  
  return rss({
    title: 'Urodele Project',
    description: 'Digital garden for thoughts, notes, and fragments',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.slug}/`, // adjust path as needed
    })),
    customData: `<language>en-us</language>`,
  });
}
