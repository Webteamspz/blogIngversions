import postsJson from "./blogPosts.json";

export type Block = { type: string; [key: string]: unknown };

export type TocItem = { label: string; anchor: string; icon?: string };

export type Section = {
  id: string;
  number: number;
  accent: string;
  heading: string;
  blocks: Block[];
};

export type StructuredPost = {
  slug: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonical: string;
  };
  meta: {
    category: string;
    categorySlug: string;
    date: string;
    readTime: string;
    coverImage: string;
    author: { name: string; avatar: string };
  };
  hero: {
    title: string;
    excerpt: string;
    badges: { label: string; color: string }[];
    highlights?: { icon: string; color: string; label: string }[];
    image?: { src: string; alt: string };
  };
  toc: {
    eyebrow: string;
    title: string;
    generateFromSections: boolean;
    items: TocItem[];
  };
  intro: Block[];
  body: { sections: Section[] };
  faq: { id: string; heading: string; items: { q: string; a: string }[] } | null;
  cta: {
    heading: string;
    text: string;
    buttonLabel: string;
    buttonLink: string;
  } | null;
};

export const structuredPosts = postsJson as unknown as StructuredPost[];

export const getStructuredPost = (slug: string): StructuredPost | null =>
  structuredPosts.find((post) => post.slug === slug) ?? null;

export const resolveToc = (post: StructuredPost): TocItem[] => {
  if (post.toc.items && post.toc.items.length > 0) return post.toc.items;
  const items: TocItem[] = post.body.sections.map((s) => ({
    label: s.heading,
    anchor: s.id,
  }));
  if (post.faq) items.push({ label: post.faq.heading, anchor: post.faq.id });
  return items;
};
