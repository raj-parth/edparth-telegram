/**
 * EDPARTH — OFFICIAL APPLICATION LOGIC
 */

(function () {
  'use strict';

  // State
  let channels = [];
  let currentCategory = 'All';
  let searchQuery = '';

  // DOM Elements
  const grid = document.getElementById('channelsGrid');
  const countEl = document.getElementById('channelsCount');
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');
  const filtersContainer = document.getElementById('categoryFilters');
  const toast = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMessage');
  const popup = document.getElementById('welcomePopup');
  const popupClose = document.getElementById('popupClose');
  const popupJoin = document.getElementById('popupJoin');

  function init() {
    channels = typeof EDPARTH_CHANNELS !== 'undefined' ? EDPARTH_CHANNELS : [];
    buildCategories();
    render();
    setupEvents();
    initPopup();
  }

  // 1. Build Category Filter Buttons with Count Badges
  function buildCategories() {
    if (!filtersContainer) return;

    // Count items per category
    const catCounts = { 'All': channels.length };
    channels.forEach(c => {
      const cat = c.category || 'General';
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    });

    const categories = Object.keys(catCounts);

    filtersContainer.innerHTML = categories.map(cat => {
      const isAll = cat === 'All';
      const label = isAll ? '✦ All Channels' : cat;
      const count = catCounts[cat] || 0;
      return `
        <button class="filter-btn ${currentCategory === cat ? 'active' : ''}" data-category="${escapeAttr(cat)}">
          <span>${escapeHtml(label)}</span>
          <span class="badge">${count}</span>
        </button>
      `;
    }).join('');

    filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filtersContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category');
        render();
      });
    });
  }

  // 2. Render Cards
  function render() {
    if (!grid) return;

    const q = searchQuery.toLowerCase().trim();

    const filtered = channels.filter(c => {
      const matchCat = currentCategory === 'All' || c.category === currentCategory;
      const matchQuery = !q ||
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.handle && c.handle.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q)) ||
        (Array.isArray(c.tags) && c.tags.some(t => t.toLowerCase().includes(q)));
      return matchCat && matchQuery;
    });

    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${channels.length} Channels`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 70px 20px; background: var(--bg-surface); border: 2px dashed var(--border-mid); border-radius: var(--radius-lg); box-shadow: var(--shadow-xs);">
          <div style="font-size: 2.8rem; margin-bottom: 14px;">🔍</div>
          <h3 style="font-family:'Big Shoulders Display',sans-serif; font-size:2rem; text-transform:uppercase; letter-spacing:0.04em; color:var(--mustard-yellow); margin-bottom:8px;">No channels found</h3>
          <p style="color:var(--text-secondary); font-size:0.96rem; max-width:420px; margin: 0 auto 20px;">
            We couldn't find any channels matching "${escapeHtml(searchQuery)}". Try checking your spelling or selecting another category.
          </p>
          <button id="btnResetSearch" style="padding: 12px 28px; background: var(--mustard-yellow); color:var(--midnight-navy); border:none; border-radius:var(--radius-full); font-family:'Plus Jakarta Sans',sans-serif; font-weight:800; cursor:pointer; font-size:0.92rem; box-shadow:0 4px 18px rgba(248,204,73,0.35);">
            Clear Search Filter
          </button>
        </div>
      `;

      const resetBtn = document.getElementById('btnResetSearch');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          if (searchClear) searchClear.classList.remove('visible');
          currentCategory = 'All';
          buildCategories();
          render();
        });
      }
      return;
    }

    grid.innerHTML = filtered.map((c, idx) => `
      <div class="channel-card ${escapeAttr(c.theme || '')}">
        <!-- Visual Cover Banner -->
        <div class="card-banner">
          <img
            src="${escapeAttr(c.image)}"
            alt="${escapeAttr(c.title)}"
            loading="lazy"
            onerror="this.onerror=null; this.src='${escapeAttr(c.fallbackImage || '')}';"
          />
          <span class="card-cat-pill">${escapeHtml(c.category || 'Educational')}</span>
          <span class="card-index-num">№ 0${idx + 1}</span>
        </div>

        <!-- Overlapping Avatar & Handle -->
        <div class="card-avatar-row">
          <div class="card-avatar">
            <img
              src="${escapeAttr(c.image)}"
              alt="${escapeAttr(c.title)}"
              loading="lazy"
              onerror="this.onerror=null; this.src='${escapeAttr(c.fallbackImage || '')}';"
            />
          </div>
          <span class="card-handle-pill">${escapeHtml(c.handle || '@EdParth')}</span>
        </div>

        <!-- Card Content Body -->
        <div class="card-body">
          <div class="card-title-row">
            <h3 class="card-title" title="${escapeAttr(c.title)}">${escapeHtml(c.title)}</h3>
            <svg class="verified-icon" viewBox="0 0 24 24" fill="currentColor" title="Verified Channel">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>

          <p class="card-desc">${escapeHtml(c.description || '')}</p>

          ${Array.isArray(c.tags) && c.tags.length ? `
            <div class="card-tags">
              ${c.tags.map(t => `<span class="card-tag">#${escapeHtml(t)}</span>`).join('')}
            </div>
          ` : ''}

          <div class="card-actions">
            <a href="${escapeAttr(c.joinLink)}" target="_blank" rel="noopener noreferrer" class="btn-card-join">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Join Channel
            </a>
            <button class="btn-card-copy" data-link="${escapeAttr(c.joinLink)}" title="Copy Link to Clipboard">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach copy button handlers
    grid.querySelectorAll('.btn-card-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const link = btn.getAttribute('data-link');
        copyLink(link, btn);
      });
    });
  }

  // 3. Copy Link with Visual Indicator
  function copyLink(text, btn) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      showToast('✓ Link copied to clipboard!');
      if (btn) {
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        setTimeout(() => {
          btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          `;
        }, 1800);
      }
    });
  }

  function showToast(msg) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  // 4. Setup Events
  function setupEvents() {
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        searchQuery = e.target.value;
        if (searchClear) {
          searchClear.classList.toggle('visible', searchQuery.length > 0);
        }
        render();
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchQuery = '';
          searchClear.classList.remove('visible');
          searchInput.focus();
          render();
        }
      });
    }

    const backToTop = document.getElementById('backToTopBtn');
    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Quick tag chips click
    document.querySelectorAll('.quick-tag-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const val = chip.getAttribute('data-search');
        if (searchInput && val) {
          searchInput.value = val;
          searchQuery = val;
          if (searchClear) searchClear.classList.add('visible');
          render();
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  // 5. Popup logic (Always opens https://t.me/EdParth)
  function initPopup() {
    if (!popup) return;

    const isDismissed = localStorage.getItem('edparth_popup_seen');
    if (!isDismissed) {
      setTimeout(() => {
        popup.classList.add('show');
      }, 2500);
    }

    function closePopup() {
      popup.classList.remove('show');
      localStorage.setItem('edparth_popup_seen', 'true');
    }

    if (popupClose) popupClose.addEventListener('click', closePopup);
    if (popupJoin) popupJoin.addEventListener('click', closePopup);
    popup.addEventListener('click', e => {
      if (e.target === popup) closePopup();
    });
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    return String(str || '').replace(/"/g, '&quot;');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
