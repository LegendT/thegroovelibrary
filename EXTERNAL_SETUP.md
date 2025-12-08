# External Setup Guide for The Groove Library

This guide covers all manual configuration tasks that need to be completed outside the codebase to maximize SEO, social media visibility, and LLM/AI discovery for The Groove Library.

**Prerequisites**: Your site must be deployed to Netlify and accessible at `https://thegroovelibrary.net`

---

## Table of Contents

1. [Google Search Console](#1-google-search-console)
2. [Analytics Setup](#2-analytics-setup)
3. [Social Media Validation](#3-social-media-validation)
4. [Structured Data Validation](#4-structured-data-validation)
5. [Performance Monitoring](#5-performance-monitoring)
6. [LLM/AI Discovery Optimization](#6-llmai-discovery-optimization)
7. [Ongoing Monitoring](#7-ongoing-monitoring)

---

## 1. Google Search Console

**Purpose**: Submit your sitemap, monitor search performance, and track crawl errors.

### Setup Steps

#### 1.1 Create Account and Verify Domain

1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Click "Add Property"
3. Choose **"URL prefix"** method: `https://thegroovelibrary.net`
4. Verify ownership using one of these methods:

   **Option A: HTML File Upload (Recommended)**
   - Download the verification HTML file
   - Place it in `/Users/anthonygeorge/Projects/thegroovelibrary/src/` directory
   - Add passthrough copy to `eleventy.config.js`:
     ```javascript
     eleventyConfig.addPassthroughCopy("src/google*.html");
     ```
   - Build and deploy: `npm run build && git add . && git commit -m "Add Google verification" && git push`
   - Click "Verify" in Search Console

   **Option B: HTML Meta Tag**
   - Copy the meta tag provided
   - Add to `src/_layouts/base.njk` in the `<head>` section
   - Deploy and verify

   **Option C: DNS TXT Record**
   - Add the TXT record to your domain DNS settings (requires domain registrar access)

#### 1.2 Submit Sitemap

1. In Google Search Console, go to **Sitemaps** (left sidebar)
2. Enter: `https://thegroovelibrary.net/sitemap.xml`
3. Click **Submit**
4. Wait 24-48 hours for initial crawl

**Expected Result**:
- All pages discovered
- No errors in sitemap
- Coverage report shows indexed pages

#### 1.3 Monitor Performance

**Weekly Tasks**:
- Check **Performance** tab for search impressions, clicks, CTR
- Review **Coverage** for indexing errors
- Check **Core Web Vitals** for performance issues

**Monthly Tasks**:
- Analyze top search queries
- Identify pages with high impressions but low CTR (optimize meta descriptions)
- Check for crawl errors and fix broken links

---

## 2. Analytics Setup

**Choose ONE analytics solution** based on your privacy and feature requirements.

### Option A: Privacy-Focused Analytics (Recommended)

#### Plausible Analytics

**Why**: No cookies, GDPR compliant, simple dashboard, ethical analytics

**Setup Steps**:
1. Sign up at [Plausible.io](https://plausible.io/)
2. Add your domain: `thegroovelibrary.net`
3. Copy the script snippet provided (looks like):
   ```html
   <script defer data-domain="thegroovelibrary.net" src="https://plausible.io/js/script.js"></script>
   ```
4. Add to `src/_layouts/base.njk` before `</head>`:
   ```html
   {# Analytics - Plausible #}
   <script defer data-domain="thegroovelibrary.net" src="https://plausible.io/js/script.js"></script>
   ```
5. Update CSP in `netlify.toml`:
   ```toml
   script-src 'self' 'unsafe-inline' https://kit.fontawesome.com https://cdn.jsdelivr.net https://plausible.io;
   connect-src 'self' https://api.mixcloud.com https://ka-f.fontawesome.com https://plausible.io;
   ```
6. Build, commit, and deploy

**Pricing**: $9/month for 10k monthly pageviews

#### Fathom Analytics

**Why**: Similar to Plausible, privacy-first, beautiful dashboard

**Setup Steps**:
1. Sign up at [usefathom.com](https://usefathom.com/)
2. Add site and copy tracking code
3. Add script to `base.njk` before `</head>`
4. Update CSP to allow Fathom domains
5. Deploy

**Pricing**: $14/month for 10k monthly pageviews

### Option B: Google Analytics 4 (GA4)

**Why**: Free, powerful features, industry standard (but more invasive tracking)

**Setup Steps**:

#### 2.1 Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon, bottom left)
3. Create **Account**: "The Groove Library"
4. Create **Property**: "The Groove Library"
   - Property name: The Groove Library
   - Reporting time zone: Your timezone
   - Currency: USD
5. Click **Next** → Choose industry category: "Arts & Entertainment"
6. Business objectives: Select "Examine user behavior"
7. Click **Create**

#### 2.2 Set Up Data Stream

1. Choose platform: **Web**
2. Website URL: `https://thegroovelibrary.net`
3. Stream name: "The Groove Library - Production"
4. Click **Create stream**
5. Copy your **Measurement ID** (looks like `G-XXXXXXXXXX`)

#### 2.3 Add Tracking Code

1. Copy the Google tag code provided
2. Add to `src/_layouts/base.njk` in `<head>` section:
   ```html
   {# Google Analytics 4 #}
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```
3. Update CSP in `netlify.toml`:
   ```toml
   script-src 'self' 'unsafe-inline' https://kit.fontawesome.com https://cdn.jsdelivr.net https://www.googletagmanager.com;
   connect-src 'self' https://api.mixcloud.com https://ka-f.fontawesome.com https://www.google-analytics.com;
   ```

#### 2.4 Configure Enhanced Measurement (Optional)

In GA4 Data Stream settings, enable:
- [x] Page views (auto-enabled)
- [x] Scrolls
- [x] Outbound clicks
- [x] Site search (if you add search later)
- [x] Video engagement (for Mixcloud embeds)
- [x] File downloads

#### 2.5 Verify Installation

1. Visit your site: `https://thegroovelibrary.net`
2. In GA4, go to **Reports** → **Realtime**
3. You should see your visit appear within 30 seconds

**Expected Result**: Real-time data shows your visit, page views tracked

---

## 3. Social Media Validation

**Purpose**: Ensure your Open Graph images and metadata display correctly on social platforms.

### 3.1 Facebook / Meta

**Tool**: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

**Steps**:
1. Enter URL: `https://thegroovelibrary.net`
2. Click **Debug**
3. Review preview:
   - Title should be: "Home | The Groove Library"
   - Description should show site description
   - Image should show: `/assets/og-default.jpg` (1200x630px)
4. Click **Scrape Again** if you make changes
5. Test other pages:
   - `https://thegroovelibrary.net/easton-chop-up/`

**Expected Issues**:
- "Could not retrieve data" → Check that site is deployed and accessible
- Wrong image → Clear cache with "Scrape Again"
- Missing properties → Check OG meta tags in `base.njk`

**Fix Issues**: If image doesn't show:
- Verify image exists at `https://thegroovelibrary.net/assets/og-default.jpg`
- Check image dimensions (should be 1200x630px)
- Ensure CSP allows image domains

### 3.2 Twitter / X

**Tool**: [Twitter Card Validator](https://cards-dev.twitter.com/validator)

**Steps**:
1. Enter URL: `https://thegroovelibrary.net`
2. Click **Preview card**
3. Verify:
   - Card type: "summary_large_image"
   - Image displays correctly
   - Title and description are correct

**Note**: Twitter falls back to OG tags if Twitter Card tags aren't present (which is fine for your setup).

### 3.3 LinkedIn

**Tool**: [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

**Steps**:
1. Enter URL: `https://thegroovelibrary.net`
2. Click **Inspect**
3. Review preview
4. Click **Clear Cache** if you need to refresh after changes

### 3.4 WhatsApp / iMessage

**No official validator**, but you can test by:
1. Send link to yourself via WhatsApp or iMessage
2. Verify preview shows correct image and text
3. If wrong, update OG tags and wait 24-48 hours for cache to clear

---

## 4. Structured Data Validation

**Purpose**: Ensure Schema.org JSON-LD structured data is valid and eligible for rich results.

### 4.1 Google Rich Results Test

**Tool**: [Google Rich Results Test](https://search.google.com/test/rich-results)

**Steps**:
1. Enter URL: `https://thegroovelibrary.net`
2. Click **Test URL**
3. Wait for results
4. Review detected structured data:
   - WebSite
   - Organization
   - CollectionPage
   - BreadcrumbList (if present)

**Expected Result**:
- "Page is eligible for rich results"
- No errors or warnings
- All schemas detected

**Common Issues**:
- "Missing required field" → Check schema in `structuredData.js`
- "Invalid URL format" → Ensure all URLs are absolute (include `https://`)
- "Image too small" → OG images should be at least 1200x630px

### 4.2 Schema Markup Validator

**Tool**: [Schema.org Validator](https://validator.schema.org/)

**Steps**:
1. Enter URL: `https://thegroovelibrary.net`
2. Click **Run Test**
3. Review detected schemas
4. Check for errors or warnings

**Alternative**: Use the "Fetch URL" tab and paste your site URL for automatic detection.

### 4.3 Test Individual Pages

Validate each major page type:
- Homepage: `https://thegroovelibrary.net/`
- Playlist page: `https://thegroovelibrary.net/easton-chop-up/`
- 404 page: `https://thegroovelibrary.net/404.html`

**Expected Schemas per Page**:

| Page | Expected Schemas |
|------|------------------|
| Homepage | WebSite, Organization, CollectionPage |
| Playlist Page | Organization, MusicPlaylist, BreadcrumbList, CollectionPage |
| 404 Page | WebSite (fallback) |

---

## 5. Performance Monitoring

**Purpose**: Track Core Web Vitals and identify performance bottlenecks.

### 5.1 PageSpeed Insights

**Tool**: [PageSpeed Insights](https://pagespeed.web.dev/)

**Steps**:
1. Enter URL: `https://thegroovelibrary.net`
2. Click **Analyze**
3. Review scores for:
   - **Performance** (target: 90+)
   - **Accessibility** (target: 100)
   - **Best Practices** (target: 100)
   - **SEO** (target: 100)

**Core Web Vitals to Monitor**:
- **LCP** (Largest Contentful Paint): < 2.5s
- **INP** (Interaction to Next Paint): < 200ms
- **CLS** (Cumulative Layout Shift): < 0.1

**Common Issues & Fixes**:

| Issue | Fix |
|-------|-----|
| Slow LCP | Add image optimization, use CDN |
| High CLS | Add width/height to images, avoid layout shifts |
| Low Performance | Minimize JS, defer non-critical CSS |
| Accessibility issues | Check with WAVE or axe DevTools |

### 5.2 WebPageTest

**Tool**: [WebPageTest](https://www.webpagetest.org/)

**Steps**:
1. Enter URL: `https://thegroovelibrary.net`
2. Choose test location: "Dulles, VA" (US East Coast)
3. Choose device: "Desktop" or "Mobile"
4. Click **Start Test**
5. Review waterfall, filmstrip, and recommendations

**Advanced Options**:
- Test from multiple locations (London, Tokyo, Sydney) to check global CDN performance
- Compare before/after optimization changes

### 5.3 Lighthouse CI (Optional)

**Purpose**: Automate Lighthouse testing on every deploy.

**Setup**:
1. Install Lighthouse CI:
   ```bash
   npm install -g @lhci/cli
   ```
2. Configure in `lighthouserc.js`:
   ```javascript
   module.exports = {
     ci: {
       collect: {
         url: ['https://thegroovelibrary.net/'],
       },
       assert: {
         preset: 'lighthouse:recommended',
       },
     },
   };
   ```
3. Add to Netlify build:
   - Add to `netlify.toml` under `[build]`:
     ```toml
     [build]
       command = "npm run build && lhci autorun"
     ```

---

## 6. LLM/AI Discovery Optimization

**Purpose**: Ensure AI assistants like ChatGPT, Claude, and Perplexity can discover and reference your content.

### 6.1 Verify robots.txt is Accessible

**Manual Check**:
1. Visit: `https://thegroovelibrary.net/robots.txt`
2. Verify you see:
   ```
   # Allow all major search engines
   User-agent: *
   Allow: /

   # Explicitly allow LLM/AI crawlers
   User-agent: GPTBot
   Allow: /

   User-agent: ClaudeBot
   Allow: /
   ...

   Sitemap: https://thegroovelibrary.net/sitemap.xml
   ```

**Expected Result**: File loads without errors, all AI crawlers are allowed.

### 6.2 Monitor AI Referrals (Future)

**Note**: Currently, most analytics tools don't track LLM referrals explicitly, but you can:

1. Check for referrals from:
   - `chat.openai.com`
   - `claude.ai`
   - `perplexity.ai`
   - Direct traffic spikes correlated with AI mentions

2. In Google Analytics (if using):
   - Go to **Acquisition** → **All Traffic** → **Referrals**
   - Look for chat/AI domains

3. In Plausible/Fathom:
   - Check **Sources** tab for referral domains

### 6.3 Create ai.txt or llms.txt (Optional)

**Purpose**: Declare AI training policies and content licensing.

**File**: `/Users/anthonygeorge/Projects/thegroovelibrary/src/ai.txt`

**Example Content**:
```
# AI Training and Scraping Policy for The Groove Library
# Contact: legendarytone@gmail.com

# Allow AI crawlers to access content for:
# - Answering user questions about music and mixes
# - Recommending content based on user preferences
# - Providing information about artists and tracks

User-agent: *
Allow: /

# Attribution required for direct content reproduction
# Our content is curated from Mixcloud and should credit:
# - The Groove Library (thegroovelibrary.net)
# - Original Mixcloud creators

# For licensing or partnership inquiries:
Contact: legendarytone@gmail.com
```

**Implementation**:
1. Create file: `src/ai.txt`
2. Add passthrough in `eleventy.config.js`:
   ```javascript
   eleventyConfig.addPassthroughCopy("src/ai.txt");
   ```
3. Build and deploy

**Note**: This is an emerging standard and not universally adopted yet.

### 6.4 Test LLM Discovery

**Manual Testing**:

1. Ask ChatGPT or Claude:
   - "What is The Groove Library?"
   - "Tell me about Easton Chop Up mixes"
   - "Recommend music from thegroovelibrary.net"

2. Check if they:
   - Recognize your site
   - Provide accurate information
   - Include citations/links

**Expected Result** (may take weeks/months):
- AI can reference your site
- Accurate descriptions of content
- Recommendations based on genre/mood

---

## 7. Ongoing Monitoring

**Purpose**: Maintain SEO health and track improvements over time.

### 7.1 Weekly Tasks (15 minutes)

- [ ] Check Google Search Console for:
  - New crawl errors
  - Coverage issues
  - Security issues
- [ ] Review analytics dashboard:
  - Traffic trends
  - Top pages
  - Referral sources
- [ ] Check site uptime (Netlify status)

### 7.2 Monthly Tasks (1 hour)

- [ ] **Search Console Performance Review**:
  - Top search queries
  - Average position changes
  - Click-through rate optimization opportunities
- [ ] **Analytics Deep Dive**:
  - User behavior flow
  - Bounce rate analysis
  - Top exit pages
- [ ] **Social Media Check**:
  - Re-validate OG images if content changed
  - Check social media shares (if trackable)
- [ ] **Core Web Vitals**:
  - Run PageSpeed Insights
  - Compare to previous month
  - Identify performance regressions

### 7.3 Quarterly Tasks (2-3 hours)

- [ ] **SEO Audit**:
  - Review all pages in Search Console
  - Check for broken links (use [Screaming Frog](https://www.screamingfrog.co.uk/seo-spider/) or similar)
  - Update meta descriptions for low-CTR pages
- [ ] **Accessibility Audit**:
  - Run [WAVE](https://wave.webaim.org/) on all pages
  - Test with screen reader (VoiceOver, NVDA)
  - Check keyboard navigation
- [ ] **Dependency Updates**:
  - Run `npm outdated`
  - Update packages: `npm update`
  - Test thoroughly before deploying
- [ ] **Structured Data Review**:
  - Re-validate with Google Rich Results Test
  - Check for new schema opportunities

### 7.4 Key Metrics to Track

**Traffic Growth**:
- Total pageviews (month-over-month)
- Unique visitors
- Sessions per user

**SEO Performance**:
- Average search position (Google Search Console)
- Total impressions
- Click-through rate (CTR)
- Indexed pages count

**Engagement**:
- Bounce rate
- Average session duration
- Pages per session
- Top landing pages

**Technical Health**:
- Core Web Vitals scores (LCP, INP, CLS)
- Lighthouse Performance score
- Accessibility score
- Crawl errors count

---

## 8. Quick Reference Checklist

**Initial Setup** (One-Time):
- [ ] Google Search Console verified
- [ ] Sitemap submitted to Search Console
- [ ] Analytics installed (Plausible/Fathom/GA4)
- [ ] Facebook Sharing Debugger validated
- [ ] Twitter Card Validator validated
- [ ] LinkedIn Post Inspector validated
- [ ] Google Rich Results Test validated
- [ ] Schema.org Validator validated
- [ ] PageSpeed Insights baseline established

**Weekly**:
- [ ] Check Search Console for errors
- [ ] Review analytics dashboard

**Monthly**:
- [ ] Search Console performance review
- [ ] Analytics deep dive
- [ ] Social media validation
- [ ] Core Web Vitals check

**Quarterly**:
- [ ] SEO audit
- [ ] Accessibility audit
- [ ] Dependency updates
- [ ] Structured data review

---

## 9. Expected Timeline & Impact

### First Week
- **Setup**: Complete all initial setup tasks
- **Impact**: Minimal (indexing begins)

### First Month
- **Indexing**: Google begins crawling sitemap
- **Analytics**: Baseline traffic established
- **Impact**: 10-20% organic traffic increase from sitemap submission

### 3 Months
- **Search Rankings**: Position improvements for target keywords
- **AI Discovery**: Possible LLM references begin
- **Social Shares**: OG images improve CTR by 2-3x
- **Impact**: 30-40% organic traffic increase

### 6 Months
- **Established Presence**: Consistent rankings, regular AI mentions
- **Referral Growth**: Social and AI referrals increase
- **Impact**: 40-60% organic traffic increase

---

## 10. Troubleshooting

### Issue: Google Search Console Not Indexing Pages

**Symptoms**: Pages not appearing in Coverage report

**Fixes**:
1. Check `robots.txt` allows Googlebot: `https://thegroovelibrary.net/robots.txt`
2. Verify sitemap is accessible: `https://thegroovelibrary.net/sitemap.xml`
3. Request indexing manually:
   - Go to URL Inspection tool
   - Enter page URL
   - Click "Request Indexing"
4. Wait 1-2 weeks for crawl

### Issue: OG Images Not Showing on Social Media

**Symptoms**: Wrong or no image in social previews

**Fixes**:
1. Verify image URL is absolute: `https://thegroovelibrary.net/assets/og-default.jpg`
2. Check image is accessible (visit URL directly)
3. Validate image dimensions: 1200x630px minimum
4. Clear social platform cache:
   - Facebook: Use Sharing Debugger "Scrape Again"
   - Twitter: No cache control (wait 7 days)
   - LinkedIn: Use Post Inspector "Clear Cache"

### Issue: Structured Data Errors

**Symptoms**: Google Rich Results Test shows errors

**Fixes**:
1. Validate JSON-LD syntax at [jsonlint.com](https://jsonlint.com/)
2. Check required fields in `structuredData.js`
3. Ensure all URLs are absolute (include `https://`)
4. Test locally: View page source and copy JSON-LD to validator

### Issue: Analytics Not Tracking

**Symptoms**: No data in analytics dashboard

**Fixes**:
1. Check script is in `<head>` of `base.njk`
2. Verify CSP allows analytics domain
3. Test with browser dev tools:
   - Open Network tab
   - Visit your site
   - Look for analytics requests (plausible.io, google-analytics.com, etc.)
4. Disable browser ad blockers during testing

### Issue: Low Core Web Vitals Scores

**Symptoms**: Poor LCP, INP, or CLS scores

**Fixes**:
- **LCP** (Largest Contentful Paint):
  - Optimize images (use WebP, compress)
  - Add preconnect hints (already done)
  - Reduce server response time
- **INP** (Interaction to Next Paint):
  - Minimize JavaScript execution
  - Defer non-critical scripts
  - Use `async` or `defer` attributes
- **CLS** (Cumulative Layout Shift):
  - Add `width` and `height` to all images (already done in mix-player)
  - Avoid injecting content above existing content
  - Reserve space for embeds and ads

---

## 11. Contact & Support

**Questions or Issues?**
- Email: legendarytone@gmail.com
- Site: https://thegroovelibrary.net

**Helpful Resources**:
- [Google Search Central](https://developers.google.com/search)
- [Open Graph Protocol](https://ogp.me/)
- [Schema.org Documentation](https://schema.org/)
- [Web.dev](https://web.dev/) - Performance and SEO guides
- [MDN Web Docs](https://developer.mozilla.org/) - Web standards reference

---

**Document Version**: 1.0
**Last Updated**: December 2024
**Maintained By**: Anthony George
