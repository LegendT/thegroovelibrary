/**
 * Lazy Player - Click-to-load Mixcloud iframes
 * Improves initial page load performance by deferring iframe loading
 * until user interaction.
 */

document.addEventListener('DOMContentLoaded', () => {
  const lazyPlayers = document.querySelectorAll('.mix-player__iframe-wrapper[data-src]');

  lazyPlayers.forEach((wrapper) => {
    const placeholder = wrapper.querySelector('.mix-player__placeholder');

    if (!placeholder) return;

    placeholder.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      const src = wrapper.dataset.src;

      // Set iframe attributes
      iframe.className = 'mix-player__iframe';
      iframe.width = '100%';
      iframe.height = '120';
      iframe.src = src;
      iframe.frameBorder = '0';
      iframe.allow = 'autoplay; encrypted-media';
      iframe.title = wrapper.dataset.title || 'Mixcloud player';
      iframe.setAttribute('aria-label', wrapper.dataset.ariaLabel || 'Audio player');

      // Replace placeholder with iframe
      wrapper.innerHTML = '';
      wrapper.appendChild(iframe);

      // Remove data-src to prevent re-initialization
      delete wrapper.dataset.src;
    });
  });
});
