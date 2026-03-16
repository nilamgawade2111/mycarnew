/**
 * Tyres Page - Filter and UI Functionality
 * MyCar Website
 *
 * Handles:
 * - Category and brand filtering
 * - Mobile navigation toggle
 * - Filter status updates
 * - Graceful degradation when JS is disabled
 */

(function() {
    'use strict';

    // DOM Elements
    const categoryFilter = document.getElementById('category-filter');
    const brandFilter = document.getElementById('brand-filter');
    const resetButton = document.getElementById('reset-filters');
    const clearFiltersLink = document.getElementById('clear-filters-link');
    const filterStatus = document.getElementById('filter-status');
    const noResultsMessage = document.getElementById('no-results');
    const categoriesGrid = document.getElementById('categories-grid');
    const brandsGrid = document.getElementById('brands-grid');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    // State
    let currentCategory = 'all';
    let currentBrand = 'all';

    /**
     * Initialize the page functionality
     */
    function init() {
        if (!categoryFilter || !brandFilter) {
            console.warn('Filter elements not found');
            return;
        }

        // Bind event listeners
        categoryFilter.addEventListener('change', handleCategoryChange);
        brandFilter.addEventListener('change', handleBrandChange);

        if (resetButton) {
            resetButton.addEventListener('click', resetFilters);
        }

        if (clearFiltersLink) {
            clearFiltersLink.addEventListener('click', resetFilters);
        }

        // Mobile navigation
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', toggleMobileNav);

            // Close mobile nav when clicking outside
            document.addEventListener('click', function(event) {
                if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                    closeMobileNav();
                }
            });

            // Close mobile nav on escape key
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    closeMobileNav();
                }
            });
        }

        // Initial filter state
        updateFilterStatus();
    }

    /**
     * Handle category filter change
     */
    function handleCategoryChange(event) {
        currentCategory = event.target.value;
        applyFilters();
    }

    /**
     * Handle brand filter change
     */
    function handleBrandChange(event) {
        currentBrand = event.target.value;
        applyFilters();
    }

    /**
     * Apply current filters to the page content
     */
    function applyFilters() {
        const categoryCards = categoriesGrid ? categoriesGrid.querySelectorAll('.category-card') : [];
        const brandCards = brandsGrid ? brandsGrid.querySelectorAll('.brand-card') : [];

        let visibleCategories = 0;
        let visibleBrands = 0;

        // Filter category cards
        categoryCards.forEach(function(card) {
            const cardCategory = card.getAttribute('data-category');
            const shouldShow = currentCategory === 'all' || cardCategory === currentCategory;

            if (shouldShow) {
                card.classList.remove('hidden');
                visibleCategories++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Filter brand cards
        brandCards.forEach(function(card) {
            const cardBrand = card.getAttribute('data-brand');
            const shouldShow = currentBrand === 'all' || cardBrand === currentBrand;

            if (shouldShow) {
                card.classList.remove('hidden');
                visibleBrands++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Show/hide sections based on filter selections
        const categoriesSection = document.querySelector('.categories-section');
        const brandsSection = document.querySelector('.brands-section');

        if (categoriesSection) {
            // Hide categories section if a specific brand is selected but no specific category
            // Actually, let's show categories when filtered to show relevant options
            categoriesSection.style.display = visibleCategories > 0 ? '' : 'none';
        }

        if (brandsSection) {
            brandsSection.style.display = visibleBrands > 0 ? '' : 'none';
        }

        // Update no results message
        const hasResults = visibleCategories > 0 || visibleBrands > 0;
        updateNoResultsMessage(!hasResults);

        // Update filter status
        updateFilterStatus(visibleCategories, visibleBrands);
    }

    /**
     * Reset all filters to default state
     */
    function resetFilters() {
        currentCategory = 'all';
        currentBrand = 'all';

        if (categoryFilter) {
            categoryFilter.value = 'all';
        }

        if (brandFilter) {
            brandFilter.value = 'all';
        }

        applyFilters();

        // Focus the category filter for accessibility
        if (categoryFilter) {
            categoryFilter.focus();
        }
    }

    /**
     * Update the filter status message
     */
    function updateFilterStatus(visibleCategories, visibleBrands) {
        if (!filterStatus) return;

        const hasActiveFilters = currentCategory !== 'all' || currentBrand !== 'all';

        if (!hasActiveFilters) {
            filterStatus.textContent = '';
            return;
        }

        const parts = [];

        if (currentCategory !== 'all') {
            const categoryText = categoryFilter.options[categoryFilter.selectedIndex].text;
            parts.push('Category: ' + categoryText);
        }

        if (currentBrand !== 'all') {
            const brandText = brandFilter.options[brandFilter.selectedIndex].text;
            parts.push('Brand: ' + brandText);
        }

        const totalResults = (visibleCategories || 0) + (visibleBrands || 0);
        filterStatus.textContent = 'Showing ' + totalResults + ' result' + (totalResults !== 1 ? 's' : '') + ' for ' + parts.join(', ');
    }

    /**
     * Show or hide the no results message
     */
    function updateNoResultsMessage(show) {
        if (!noResultsMessage) return;

        if (show) {
            noResultsMessage.hidden = false;
            noResultsMessage.setAttribute('aria-hidden', 'false');
        } else {
            noResultsMessage.hidden = true;
            noResultsMessage.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * Toggle mobile navigation menu
     */
    function toggleMobileNav() {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';

        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');

        if (!isExpanded) {
            // Focus first menu item when opening
            const firstLink = navMenu.querySelector('.nav-link');
            if (firstLink) {
                firstLink.focus();
            }
        }
    }

    /**
     * Close mobile navigation menu
     */
    function closeMobileNav() {
        if (navToggle && navMenu) {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
