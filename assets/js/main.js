// Navigation functions
function toggleSection(button) {
  const section = button.closest('.nav-section');
  section.classList.toggle('expanded');
}

function toggleAllSections(expand) {
  const sections = document.querySelectorAll('.nav-section');
  sections.forEach(section => {
    if (expand) {
      section.classList.add('expanded');
    } else {
      section.classList.remove('expanded');
    }
  });
}

function toggleMobileMenu() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('open');
}

// Search functionality
function initMenuSearch() {
  const searchInput = document.getElementById('menu-search');
  const searchResults = document.getElementById('search-results');
  const searchClear = document.getElementById('search-clear');
  
  if (!searchInput || !searchResults || !window.menuData) return;
  
  // Flatten menu data for easier searching
  const flatMenu = [];
  window.menuData.forEach(section => {
    section.items.forEach(item => {
      flatMenu.push({
        title: item.title,
        url: item.url,
        icon: item.icon,
        section: section.section,
        sectionIcon: section.sectionIcon
      });
    });
  });
  
  // Search function
  function performSearch(query) {
    query = query.toLowerCase().trim();
    
    if (!query) {
      searchResults.style.display = 'none';
      searchResults.innerHTML = '';
      searchClear.style.display = 'none';
      return;
    }
    
    searchClear.style.display = 'flex';
    
    // Filter results
    const results = flatMenu.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.section.toLowerCase().includes(query)
    );
    
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
      searchResults.style.display = 'block';
      return;
    }
    
    // Group results by section
    const grouped = {};
    results.forEach(item => {
      if (!grouped[item.section]) {
        grouped[item.section] = [];
      }
      grouped[item.section].push(item);
    });
    
    // Build HTML
    let html = '';
    for (const [sectionName, items] of Object.entries(grouped)) {
      html += `<div class="search-result-section">${escapeHtml(sectionName)}</div>`;
      items.forEach(item => {
        const highlightedTitle = highlightMatch(item.title, query);
        html += `
          <a href="${item.url}" class="search-result-item">
            <span class="result-icon"><i data-lucide="${item.icon}"></i></span>
            <span class="result-title">${highlightedTitle}</span>
          </a>
        `;
      });
    }
    
    searchResults.innerHTML = html;
    searchResults.style.display = 'block';
    
    // Re-initialize Lucide icons for new elements
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
  
  // Highlight matching text
  function highlightMatch(text, query) {
    const escaped = escapeHtml(text);
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return escaped.replace(regex, '<mark>$1</mark>');
  }
  
  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Escape regex special characters
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  // Event listeners
  searchInput.addEventListener('input', function(e) {
    performSearch(e.target.value);
  });
  
  searchClear.addEventListener('click', function() {
    searchInput.value = '';
    searchResults.style.display = 'none';
    searchResults.innerHTML = '';
    searchClear.style.display = 'none';
    searchInput.focus();
  });
  
  // Close results when clicking outside
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.style.display = 'none';
    }
  });
  
  // Show results again when focusing input with existing query
  searchInput.addEventListener('focus', function() {
    if (searchInput.value.trim()) {
      performSearch(searchInput.value);
    }
  });
  
  // Keyboard navigation
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      searchInput.blur();
      searchResults.style.display = 'none';
    }
  });
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
  const sidebar = document.querySelector('.sidebar');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  
  if (window.innerWidth <= 768 && 
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) && 
      !menuBtn.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

// Expand section containing active link on page load and initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Initialize menu search
  initMenuSearch();
  
  // Expand section containing active link
  const activeLink = document.querySelector('.nav-link.active');
  if (activeLink) {
    const section = activeLink.closest('.nav-section');
    if (section) {
      section.classList.add('expanded');
    }
  }
});
