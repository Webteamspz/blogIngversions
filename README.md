# Ingversions Blog

A minimal, clean blog built with Next.js and Tailwind CSS.

## Tech Stack

- **Next.js 16** + App Router
- **Tailwind CSS (CDN)** - Simple, guaranteed to work without complex config
- **TypeScript** - Type-safe development

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

Deployed to Vercel: https://ingversions-blog.vercel.app

## Structure

```
ingversions-blog/
├── app/
│   ├── layout.tsx        # Root layout with Tailwind CDN
│   ├── page.tsx          # Home page (hero, featured posts, CTA)
│   ├── blog/page.tsx     # Blog listing page (8 articles)
│   └── components/
│       ├── Header.tsx    # Navigation header
│       └── Footer.tsx    # Footer with links
└── package.json
```

## Key Features

- ✅ Tailwind CDN for simple, reliable styling
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Minimal, clean code structure
- ✅ Production-ready build
- ✅ Vercel deployment ready
