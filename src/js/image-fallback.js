/**
 * Image Fallback Handler
 *
 * Handles broken images by showing a placeholder with the logo
 */

document.addEventListener('DOMContentLoaded', () => {
  // Handle image load errors
  const images = document.querySelectorAll('.mix-player__image');

  images.forEach(img => {
    img.addEventListener('error', function() {
      // Don't retry if already tried
      if (this.dataset.fallback === 'true') return;

      this.dataset.fallback = 'true';

      // Add a class to style the broken image
      const cover = this.closest('.mix-player__cover');
      if (cover) {
        cover.classList.add('mix-player__cover--fallback');
      }

      // Hide the broken image
      this.style.display = 'none';
    });
  });
});
