import { notFound } from "next/navigation";
import Link from "next/link";
import "./ArticleDetail.css";

import ArticleTracker from "./ArticleTracker";
import GetStartedBtn from "./GetStartedBtn"; 

const articles: Record<
  string,
  {
    title: string;
    category: string;
    categorySlug: string;
    date: string;
    readTime: string;
    content: string;
  }
> = {
  "checkout-conversion-34-percent": {
    title: "How We Increased Checkout Conversion by 34% for a Shopify Store",
    category: "CRO",
    categorySlug: "cro",
    date: "April 10, 2026",
    readTime: "8 min read",
    content: `
## The Problem

Our client, a mid-size Shopify store selling premium skincare products, was struggling with a 68% checkout abandonment rate. Despite steady traffic, revenue wasn't scaling.

## Our Approach

We implemented a systematic conversion optimization process:

### 1. Analysis Phase
- Heatmap analysis revealed users dropping at the shipping calculation step
- Session recordings showed confusion around coupon code application
- Mobile users had particular trouble with form fields

### 2. Hypothesis Generation

Based on the data, we prioritized:
- Simplify checkout flow (reduce steps from 5 to 3)
- Add progress indicator
- Show shipping costs earlier in the journey
- Improve mobile form UX

### 3. A/B Testing

**Test 1: Checkout Steps**
- Control: 5-step checkout
- Variant: 3-step accordion checkout
- Result: +12% conversion (95% confidence)

**Test 2: Shipping Calculator**
- Control: Calculate at payment step
- Variant: Show estimate in cart
- Result: +8% conversion

**Test 3: Mobile Forms**
- Control: Standard inputs
- Variant: Large touch targets, autofill, single column
- Result: +14% mobile conversion

## The Results

Checkout conversion increased from 2.1% to 2.8% (+34%). Mobile conversion jumped by +50%.

## Want Similar Results?

We specialize in Shopify CRO. Get in touch to discuss your store's potential.
    `,
  },
  "shopify-theme-customizations-boost-sales": {
    title: "5 Shopify Theme Customizations That Boost Sales",
    category: "Shopify Development",
    categorySlug: "shopify",
    date: "April 8, 2026",
    readTime: "6 min read",
    content: `
## Beyond the Default Theme

Your Shopify theme is your digital storefront. Here are 5 customizations that directly impact revenue.

### 1. Sticky Add-to-Cart on Mobile

Users shouldn't have to scroll to add products. A sticky "Add to Cart" button that follows the user increases conversions by 8-12%.

### 2. Quick View for Collections

Let customers preview products without leaving the collection page. Reduces clicks-to-purchase by 40%.

### 3. Trust Badges Near Checkout

Payment icons, security badges, and guarantees reduce anxiety. Place them:
- Below the "Add to Cart" button
- In the cart drawer
- Above checkout button

### 4. Product Page Tabs

Organize information without long scrolling:
- Description
- Specifications
- Reviews
- Shipping & Returns

### 5. Cross-Sell in Cart

"Don't forget these" section with complementary products. Average +15% AOV.

## Implementation

All of these can be done in a custom theme without apps. Need help? Contact us.
    `,
  },
  "ab-testing-mistakes-cost-money": {
    title: "A/B Testing Mistakes That Cost You Money",
    category: "A/B Testing",
    categorySlug: "ab-testing",
    date: "April 5, 2026",
    readTime: "5 min read",
    content: `
## We See These Every Week

After running 200+ A/B tests for clients, here are the mistakes that waste time and money.

### Mistake 1: Testing Without Hypotheses

"This button should be blue" isn't a hypothesis.

**Good hypothesis:** "Changing the CTA to blue will increase clicks because it matches our brand trust signals and stands out against the white background."

### Mistake 2: Stopping Tests Too Early

Day 3: "Wow, +30% conversion!"
Day 14: "Oh, it's actually +3%"

You need statistical significance AND enough sample size. Use a calculator. Wait for 95%+ confidence.

### Mistake 3: Testing Too Many Variables

Control: Original
Variant: New headline + new button + new layout

Which change caused the lift? You won't know.

Test one change at a time.

### Mistake 4: Ignoring Mobile

70% of traffic is mobile on many stores. If you only test desktop, you're optimizing 30% of your business.

### Mistake 5: Not Documenting Learnings

"What did we learn from the 47 tests last year?"

If you can't answer that, you're wasting institutional knowledge.

## The Right Way

1. Start with analytics (find the problem)
2. Form a hypothesis (why will this help?)
3. Design the test (one variable)
4. Run until significance (be patient)
5. Document everything
    `,
  },
  "cro-fundamentals-where-to-start": {
    title: "CRO Fundamentals: Where to Start",
    category: "CRO",
    categorySlug: "cro",
    date: "April 3, 2026",
    readTime: "7 min read",
    content: `
## Conversion Rate Optimization Isn't Magic

It's a systematic process. Here's where to start.

### Step 1: Establish Baselines

Before changing anything, know your numbers:
- Overall conversion rate
- Conversion by traffic source
- Mobile vs desktop conversion
- Product page to cart rate
- Cart to checkout rate
- Checkout completion rate

Google Analytics + Shopify Analytics = baseline data.

### Step 2: Find Leaks

Where are you losing people?

**High traffic, low conversion pages:**
- Analyze with heatmaps (Hotjar, Clarity)
- Watch session recordings
- Review bounce rate by page

### Step 3: Prioritize by Impact

ICE scoring:
- **I**mpact (1-10): How much will this help?
- **C**onfidence (1-10): How sure are we?
- **E**ffort (1-10): How hard is it? (lower = easier)

Score = I × C / E

### Step 4: Build a Test Roadmap

Month 1: Quick wins (trust badges, button colors)
Month 2: UX improvements (checkout flow, mobile forms)
Month 3: Major changes (site search, navigation)

### Step 5: Test, Learn, Repeat

Every test teaches something. Even "failed" tests provide insights.
    `,
  },
  "headless-shopify-storefront": {
    title: "Building a Headless Shopify Storefront",
    category: "Shopify Development",
    categorySlug: "shopify",
    date: "March 28, 2026",
    readTime: "10 min read",
    content: `
## What is Headless?

Traditional Shopify: Theme controls everything (frontend + backend tied together)

Headless Shopify: Shopify handles backend (inventory, checkout, payments), custom frontend talks to it via API

## When to Go Headless

**Good candidates:**
- High traffic (100k+ monthly visitors)
- Complex frontend requirements (animations, personalization)
- Multi-channel (web, app, kiosk all from same backend)
- Need sub-200ms page loads

**Stay with theme if:**
- Under 50k visitors
- Standard store needs
- Limited dev resources
- Quick launch required

## Our Recommended Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 |
| Styling | Tailwind CSS |
| Data Layer | Shopify Storefront API |
| Deployment | Vercel |
| Cart | Shopify Cart API |

## Key Benefits

### Performance
- Lighthouse scores 95+ (vs 50-70 for themes)
- Sub-second page loads
- Better Core Web Vitals

### Flexibility
- Any frontend framework
- Custom animations
- A/B testing without apps

### Developer Experience
- Git-based workflow
- Modern tooling
- Type-safe development

## Trade-offs

- Higher upfront cost ($15k-50k vs $2k-10k for theme)
- Need developer for changes
- Longer initial build time
    `,
  },
  "statistical-significance-ab-testing": {
    title: "Statistical Significance in A/B Testing",
    category: "A/B Testing",
    categorySlug: "ab-testing",
    date: "March 25, 2026",
    readTime: "6 min read",
    content: `
## The Math Behind Good Decisions

You ran a test. Variant B has 15% higher conversion. Do you ship it?

Not until you understand statistical significance.

### What is Statistical Significance?

It's the probability that your result isn't due to random chance.

95% significance = 95% confident the result is real, not luck

### How to Calculate

Don't do it by hand. Use tools:
- Optimizely's Stats Engine
- VWO's calculator
- AB Testguide calculator

Input:
- Control conversion rate
- Variant conversion rate
- Sample size (control + variant)

Output:
- Significance level
- Confidence interval

### When to Trust Your Results

**Minimum requirements:**
- 95%+ confidence
- At least 100 conversions per variant
- Test ran for 7+ days (accounts for weekly patterns)

**Don't trust:**
- Tests stopped at 90% significance
- Fewer than 50 conversions
- Tests running less than 3 days

### Common Errors

**Type I Error (False Positive)**
- You think there's an effect, but there isn't
- Happens when you peek at results too early

**Type II Error (False Negative)**
- There's an effect, but you miss it
- Happens with small sample sizes

## Key Takeaway

In A/B testing, patience is a feature. Wait for significance.
    `,
  },
  "mobile-checkout-optimization": {
    title: "Mobile Checkout Optimization: 7 Quick Wins",
    category: "CRO",
    categorySlug: "cro",
    date: "March 22, 2026",
    readTime: "4 min read",
    content: `
## Mobile Commerce is Growing

60%+ of Shopify traffic is mobile. But mobile converts at half the rate of desktop.

Here's how to close that gap.

### 1. Single-Column Forms

Two-column forms on mobile require horizontal scrolling or pinch-zoom. Single column = easier to complete.

### 2. Large Touch Targets

Minimum 44x44 pixels for buttons. 48x48 is better.

Your "Add to Cart" button should be thumb-friendly.

### 3. Autofill Everything

Enable:
- autocomplete="given-name"
- autocomplete="email"
- autocomplete="tel"
- autocomplete="shipping street-address"

Browsers will fill these automatically.

### 4. Show Password Toggle

Typing on mobile is error-prone. Let users see what they typed.

### 5. Progress Indicator

"How many steps left?" Answer this question clearly.

### 6. Express Checkout First

Apple Pay, Google Pay, Shop Pay before manual checkout. 1-click > 5 clicks.

### 7. Error Messages Inline

Don't make users scroll to find "Invalid email". Show it next to the field.

## Impact of These Changes

We've seen mobile conversion improve by 30-50% with these optimizations alone.

## Need Mobile Optimization?

We specialize in mobile-first Shopify development.
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const plainTextContent = article.content
    .replace(
      /## |### |`|\*\*|\*|\[|\]/g,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();

  const description =
    plainTextContent.slice(0, 160);

  const heroImages: Record<string, string> = {
    cro: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",

    "ab-testing":
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",

    shopify:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
  };

  const heroImage =
    heroImages[article.categorySlug];

  return {
    title: `${article.title} | Ingversions Blog`,
    description,
    keywords: [
      article.category.toLowerCase(),
      "Shopify",
      "CRO",
      "A/B testing",
    ],
    openGraph: {
      type: "article",
      url: `https://blog.ingversionsdigital.com/${slug}`,
      title: article.title,
      description,
      images: [
        {
          url: heroImage,
          width: 800,
          height: 400,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [heroImage],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) notFound();

  const categoryColors: Record<string, string> = {
    CRO: "badge-cro",
    "A/B Testing": "badge-ab",
    "Shopify Development":
      "badge-shopify",
  };

  const heroImages: Record<string, string> = {
    cro: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",

    "ab-testing":
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",

    shopify:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
  };

  const heroImage =
    heroImages[article.categorySlug];

  return (
    <main className="article-main">

      {/* GTM Pageview */}
      <ArticleTracker
        title={article.title}
      />

      <article className="article-container">

        {/* Back Button */}
        <div className="back-link-wrapper">
          <Link
            href="/"
            className="back-link"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Hero Image */}
        <div className="article-hero-wrapper">
          <img
            src={heroImage}
            alt={article.title}
            className="article-hero-img"
          />
        </div>

        <div className="article-content-wrapper">

          {/* Badge */}
          <div className="badge-container">
            <span
              className={`article-badge ${categoryColors[article.category]}`}
            >
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="article-title">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="article-meta">
            <span>{article.date}</span>
            <span className="meta-dot">•</span>
            <span>{article.readTime}</span>
          </div>

          {/* Content */}
          <div className="article-body">
            {article.content
              .split("\n")
              .map((paragraph, i) => {

                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={i} className="article-h2">
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }

                if (paragraph.startsWith("### ")) {
                  return (
                    <h3 key={i} className="article-h3">
                      {paragraph.replace("### ", "")}
                    </h3>
                  );
                }

                if (paragraph.startsWith("- ")) {
                  return (
                    <li key={i} className="article-li">
                      {paragraph.replace("- ", "")}
                    </li>
                  );
                }

                if (paragraph.trim() === "") {
                  return null;
                }

                return (
                  <p key={i} className="article-p">
                    {paragraph}
                  </p>
                );
              })}
          </div>

          {/* CTA Box */}
          <div className="article-cta-box">
            <h3 className="cta-heading">
              Want results like these?
            </h3>
            <p className="cta-text">
              We help Shopify stores optimize their conversion rates.
            </p>

            {/* YAHAN NAYA COMPONENT USE HUA HAI JISME SEPARATE EVENT HAI */}
            <GetStartedBtn />

          </div>
        </div>
      </article>
    </main>
  );
}