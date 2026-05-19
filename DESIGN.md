# Blog Design Concept
## ingversionsdigital.com

**Designer:** Aria 🎼  
**Date:** 2026-04-10  
**Audience:** Non-tech founders  
**Style:** Clean, modern, professional

---

## Color Palette

### Primary Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Dark Header | `#0a0a0a` | Header background, footer background |
| Primary Blue | `#0070f3` | CTAs, links, accents, buttons |
| White | `#ffffff` | Text on dark backgrounds |
| Light Gray | `#f5f5f5` | Section backgrounds, card backgrounds |

### Secondary Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Dark Gray | `#1a1a1a` | Card backgrounds on light sections |
| Medium Gray | `#666666` | Secondary text, meta info |
| Border Gray | `#e0e0e0` | Dividers, card borders |
| Hover Blue | `#0056cc` | Button hover states |

### Typography Colors
- Headings: `#0a0a0a` (on light), `#ffffff` (on dark)
- Body text: `#333333` (on light), `#e0e0e0` (on dark)
- Links: `#0070f3` (with hover: `#0056cc`)

---

## Layout Structure

### Container System
```
Max-width: 1260px
Padding: 0 15px (mobile: 0 20px)
Centered with auto margins
```

### Section Breakdown

#### 1. Header (Sticky)
- **Height:** 70px
- **Background:** `#0a0a0a`
- **Elements:**
  - Logo (left) - "ingversions" text, white
  - Navigation (center) - Home, Services, Blog, Contact
  - CTA Button (right) - "Get Started" in `#0070f3`

#### 2. Hero Section
- **Height:** 400px (desktop), 300px (mobile)
- **Background:** Gradient from `#0a0a0a` to `#1a1a1a`
- **Content:**
  - Headline: "Insights for Founders Who Build"
  - Subheadline: "Practical advice on technology, growth, and scaling your business"
  - Search bar: Full-width, rounded, with search icon
  - Topic tags: Horizontal scroll (Strategy, Tech, Growth, Leadership)

#### 3. Featured Articles (3-Column Grid)
- **Background:** `#f5f5f5`
- **Grid:** 3 columns (desktop), 2 columns (tablet), 1 column (mobile)
- **Card Design:**
  - Image: 16:9 aspect ratio, 400px wide
  - Category tag: Top left, `#0070f3` background, white text
  - Title: Bold, 24px, 2 lines max
  - Excerpt: 16px, 3 lines max, medium gray
  - Meta: Author name, date, read time (12px)
  - Hover: Subtle lift, shadow increase

#### 4. Article Categories
- **Background:** White
- **Layout:** 4-column grid of category cards
- **Each card:**
  - Icon (32px)
  - Category name
  - Article count
  - Hover: Blue border, slight lift

#### 5. Newsletter CTA
- **Background:** `#0a0a0a`
- **Content:**
  - Headline: "Get Weekly Insights"
  - Subtext: "Join 5,000+ founders receiving our weekly newsletter"
  - Email input: Full-width, white background
  - Subscribe button: `#0070f3`, full width
  - Social proof: "Trusted by founders at..." (logos)

#### 6. Footer
- **Background:** `#0a0a0a`
- **Columns:** 4 columns
  - Company (About, Careers, Contact)
  - Resources (Blog, Guides, Case Studies)
  - Legal (Privacy, Terms, Cookies)
  - Social (LinkedIn, Twitter, Email)

---

## Visual Hierarchy

### Typography Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 (Hero) | 48px | 700 | 1.2 |
| H2 (Section) | 36px | 600 | 1.3 |
| H3 (Card Title) | 24px | 600 | 1.4 |
| Body | 16px | 400 | 1.6 |
| Small/Meta | 14px | 400 | 1.5 |
| Caption | 12px | 400 | 1.4 |

### Hierarchy Flow
1. **Primary:** Hero headline, CTA buttons, article titles
2. **Secondary:** Section headings, category names, newsletter CTA
3. **Tertiary:** Meta information, excerpts, social links

---

## Key UX Elements

### 1. Navigation
- Sticky header for easy access
- Active state indication
- Mobile hamburger menu with full-screen overlay
- Smooth scroll to sections

### 2. Article Cards
- Clear visual hierarchy (image → tag → title → excerpt → meta)
- Hover states for interactivity feedback
- Consistent spacing and alignment
- "Read time" badge for quick scanning

### 3. Search Functionality
- Prominent placement in hero
- Real-time suggestions
- Filter by category, date, author

### 4. Newsletter CTA
- High contrast (dark background)
- Clear value proposition
- Single-field form (email only)
- Success state with confirmation message

### 5. Mobile Responsiveness
- Stack columns on mobile
- Touch-friendly tap targets (44px minimum)
- Readable text sizes (16px minimum)
- Optimized images for mobile

---

## Mobile Responsive Breakpoints

### Desktop (1260px+)
- 3-column article grid
- Full navigation visible
- Hero: 400px height

### Tablet (768px - 1260px)
- 2-column article grid
- Condensed navigation
- Hero: 350px height

### Mobile (< 768px)
- 1-column article grid
- Hamburger menu
- Hero: 300px height
- Full-width cards
- Bottom navigation for quick access

---

## Call-to-Action Placement

### Primary CTAs
1. **Header:** "Get Started" (top right)
2. **Hero:** "Browse Articles" (below search)
3. **Newsletter:** "Subscribe" (email form button)
4. **Article Cards:** "Read More" (card bottom)

### Secondary CTAs
1. **Category cards:** "View All" (hover state)
2. **Footer:** "Contact Us" (footer column)
3. **Article page:** "Related Articles" (sidebar)

### CTA Design Principles
- High contrast (`#0070f3` on white/dark)
- Rounded corners (8px)
- Subtle hover lift (2px)
- Clear, action-oriented copy
- Consistent placement across pages

---

## Accessibility Considerations

- Color contrast ratio: 4.5:1 minimum for text
- Focus states on all interactive elements
- Alt text for all images
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly

---

## Design Notes

### What Makes This Work for Non-Tech Founders
1. **Simple language** - No jargon in headlines
2. **Clear value** - Each article shows what you'll learn
3. **Quick scanning** - Read times, categories, excerpts
4. **Trust signals** - Author bios, social proof
5. **Actionable content** - Practical, not theoretical

### Visual Polish
- Subtle shadows for depth
- Smooth transitions (200ms)
- Consistent spacing (8px grid system)
- Professional imagery
- Clean typography with good hierarchy

### Performance Considerations
- Lazy load images
- Optimize image sizes
- Minimal external dependencies
- Fast load times (< 2s)

---

## Next Steps

1. Create high-fidelity mockups in Figma/Sketch
2. Design article detail page
3. Create category page templates
4. Design mobile-specific interactions
5. Build component library

---

*Design created by Aria 🎼 for ingversionsdigital.com*