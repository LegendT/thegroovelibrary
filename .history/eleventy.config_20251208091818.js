/**
 * Eleventy Configuration
 * @see https://www.11ty.dev/docs/config/
 */

import sitemap from "@quasibit/eleventy-plugin-sitemap";

export default function (eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/google6eb2953d13e5b8b.html");

  // Watch for changes in CSS and JS
  eleventyConfig.addWatchTarget("src/css/");
  eleventyConfig.addWatchTarget("src/js/");

  // Add filter to format numbers with locale string
  eleventyConfig.addFilter("toLocaleString", function(value) {
    if (typeof value === 'number') {
      return value.toLocaleString('en-US');
    }
    return value;
  });

  // Add filter to convert structured data to JSON-LD
  eleventyConfig.addFilter("toJSONLD", function(schemas) {
    if (!Array.isArray(schemas)) {
      schemas = [schemas];
    }
    return schemas
      .map(schema => {
        const jsonString = JSON.stringify(schema, null, 0);
        return `<script type="application/ld+json">${jsonString}</script>`;
      })
      .join('\n  ');
  });

  // Add sitemap plugin
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://thegroovelibrary.net",
    },
  });

  // Set custom directories
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
      layouts: "_layouts"
    },
    templateFormats: ["html", "njk", "md", "11ty.js"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}
