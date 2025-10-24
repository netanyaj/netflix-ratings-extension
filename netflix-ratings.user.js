// ==UserScript==
// @name         Netflix IMDb & Rotten Tomatoes Ratings
// @namespace    https://github.com/netanyj/netflix-ratings-extension
// @version      1.0
// @description  Show IMDb and Rotten Tomatoes ratings on Netflix thumbnails
// @author       netanyaj
// @match        https://www.netflix.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      www.omdbapi.com
// @homepageURL  https://github.com/netanyj/netflix-ratings-extension
// @supportURL   https://github.com/netanyj/netflix-ratings-extension/issues
// @downloadURL  https://raw.githubusercontent.com/netanyj/netflix-ratings-extension/main/netflix-ratings.user.js
// @updateURL    https://raw.githubusercontent.com/netanyj/netflix-ratings-extension/main/netflix-ratings.user.js
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // OMDb API key
    // You can store an API key via the Tampermonkey/Violentmonkey menu: "Set OMDB API Key"
    // If not set, set OMDB_API_KEY to the literal string '<YOUR_OMDB_API_KEY>' below.
    let OMDB_API_KEY = '';
    try {
        // Read saved key (if running under a userscript manager that provides GM_getValue)
        if (typeof GM_getValue === 'function') {
            OMDB_API_KEY = GM_getValue('omdb_api_key', '');
        }
    } catch (e) {
        // ignore
    }

    // Fallback placeholder — replace this if you prefer editing the file directly
    if (!OMDB_API_KEY) {
        OMDB_API_KEY = '<YOUR_OMDB_API_KEY>';
    }

    // Provide a menu command to set the API key (makes it easy when installed from GitHub)
    try {
        if (typeof GM_registerMenuCommand === 'function') {
            GM_registerMenuCommand('Set OMDB API Key', () => {
                try {
                    const key = prompt('Enter OMDb API Key (get one at https://www.omdbapi.com/apikey.aspx)');
                    if (key) {
                        if (typeof GM_setValue === 'function') GM_setValue('omdb_api_key', key);
                        OMDB_API_KEY = key;
                        alert('OMDB API key saved. Reload the page to apply.');
                    }
                } catch (err) {
                    console.error('Failed to save OMDB API key', err);
                }
            });
        }
    } catch (e) {
        // ignore
    }

    // Cache to avoid repeated API calls
    const ratingsCache = {};

    // Style for rating badges
    const style = document.createElement('style');
    style.textContent = `
        .ratings-badge {
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 10;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .rating-item {
            background: rgba(0, 0, 0, 0.85);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 4px;
            backdrop-filter: blur(4px);
        }

        .rating-imdb {
            color: #f5c518;
        }

        .rating-rt {
            color: #fa320a;
        }

        .rating-na {
            color: #837c7c;
        }

        .rating-loading {
            color: #999;
            font-size: 10px;
        }
    `;
    document.head.appendChild(style);

    // Extract title from Netflix elements
    function extractTitle(element) {
        // Try multiple selectors as Netflix's DOM structure varies
        const titleElement = element.querySelector('.fallback-text, .slider-refocus span, [class*="title"]');
        if (titleElement) {
            return titleElement.textContent.trim();
        }

        // Try aria-label as fallback
        const ariaLabel = element.getAttribute('aria-label');
        if (ariaLabel) {
            return ariaLabel.trim();
        }

        return null;
    }

    // Fetch ratings from OMDb API
    async function fetchRatings(title) {
        if (ratingsCache[title]) {
            return ratingsCache[title];
        }

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);

                        if (data.Response === 'True') {
                            const ratings = {
                                imdb: data.imdbRating !== 'N/A' ? data.imdbRating : null,
                                rottenTomatoes: null
                            };

                            // Extract Rotten Tomatoes from Ratings array
                            if (data.Ratings) {
                                const rtRating = data.Ratings.find(r => r.Source === 'Rotten Tomatoes');
                                if (rtRating) {
                                    ratings.rottenTomatoes = rtRating.Value;
                                }
                            }

                            ratingsCache[title] = ratings;
                            resolve(ratings);
                        } else {
                            ratingsCache[title] = null;
                            resolve(null);
                        }
                    } catch (e) {
                        console.error('Error parsing OMDb response:', e);
                        resolve(null);
                    }
                },
                onerror: function() {
                    resolve(null);
                }
            });
        });
    }

    // Create rating badge element
    function createRatingBadge(imdb, rottenTomatoes, naFlag) {
        const badge = document.createElement('div');
        badge.className = 'ratings-badge';

        if (imdb) {
            const imdbDiv = document.createElement('div');
            imdbDiv.className = 'rating-item rating-imdb';
            imdbDiv.innerHTML = `⭐ ${imdb}`;
            badge.appendChild(imdbDiv);
        }

        if (rottenTomatoes) {
            const rtDiv = document.createElement('div');
            rtDiv.className = 'rating-item rating-rt';
            rtDiv.innerHTML = `🍅 ${rottenTomatoes}`;
            badge.appendChild(rtDiv);
        }

        if (naFlag) {
            const naDiv = document.createElement('div');
            naDiv.className = 'rating-item rating-na';
            naDiv.innerHTML = `⛔️ N/A`;
            badge.appendChild(naDiv);
        }

        return badge;
    }

    // Add ratings to a Netflix thumbnail
    async function addRatingsToThumbnail(thumbnail) {
        // Check if already processed
        if (thumbnail.dataset.ratingsProcessed) {
            return;
        }
        thumbnail.dataset.ratingsProcessed = 'true';

        const title = extractTitle(thumbnail);
        if (!title) {
            return;
        }

        // Find the container for positioning
        const container = thumbnail.querySelector('.slider-refocus, .title-card-container, [class*="boxart-container"]');
        if (!container) {
            return;
        }

        // Make container relative for absolute positioning
        container.style.position = 'relative';

        // Add loading indicator
        const loadingBadge = document.createElement('div');
        loadingBadge.className = 'ratings-badge';
        loadingBadge.innerHTML = '<div class="rating-item rating-loading">⏳</div>';
        container.appendChild(loadingBadge);

        // Fetch ratings
        const ratings = await fetchRatings(title);

        // Remove loading indicator
        loadingBadge.remove();

        // Add actual ratings if found
        if (ratings && (ratings.imdb || ratings.rottenTomatoes)) {
            const badge = createRatingBadge(ratings.imdb, ratings.rottenTomatoes);
            container.appendChild(badge);
        } else {
            const badge = createRatingBadge(null,null,1);
            container.appendChild(badge);
        }
    }

    // Process all visible thumbnails
    function processVisibleThumbnails() {
        // Netflix uses various selectors for thumbnails
        const thumbnails = document.querySelectorAll('[class*="slider-item"], [class*="title-card"]');

        thumbnails.forEach(thumbnail => {
            addRatingsToThumbnail(thumbnail);
        });
    }

    // Initial processing
    setTimeout(processVisibleThumbnails, 2000);

    // Watch for new content (infinite scroll, navigation)
    const observer = new MutationObserver((mutations) => {
        processVisibleThumbnails();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Re-process on scroll (for lazy-loaded content)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(processVisibleThumbnails, 500);
    });

    console.log('Netflix Ratings Extension loaded! 🎬');
})();
