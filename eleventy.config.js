/**
 * Eleventy Configuration
 * @see https://www.11ty.dev/docs/config/
 */

export default function (eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");

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
