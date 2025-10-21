const app = (() => {
  // --- 1. STATE Management ---
  const DEFAULT_STATE = {
    partner1: 'Sarah',
    partner2: 'Michael',
    startDate: '2020-03-15',
    anniversaryDate: '2026-03-15',
    heroSubtitle: 'A love story written in the stars',
    loveQuote: 'In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.',
    theme: 'modern',
    stories: [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1529636849874-e6774cf19564?w=400&h=400&fit=crop&crop=face",
        title: "First Date",
        date: "March 15, 2020",
        description: "The magical evening when it all began. Every love story has a beginning, and ours started with a simple coffee that turned into hours of conversation."
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop&crop=face",
        title: "Travel Together",
        date: "July 22, 2021",
        description: "Exploring the world hand in hand. From mountain tops to ocean shores, we've discovered that the best adventures are the ones we share together."
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=400&fit=crop&crop=face",
        title: "Special Moments",
        date: "December 5, 2022",
        description: "Cherished memories forever in our hearts. The quiet moments, the laughter, the tears of joy - these are the treasures that make our love story unique."
      }
    ],
    countdownInterval: null
  };

  // State will be loaded from localStorage or default
  let STATE = {};

  // --- 2. DOM Elements Cache ---
  const ELEMENTS = {
    // Admin Inputs
    partner1: () => document.getElementById('partner1'),
    partner2: () => document.getElementById('partner2'),
    startDate: () => document.getElementById('startDate'),
    anniversaryDate: () => document.getElementById('anniversaryDate'),
    heroSubtitle: () => document.getElementById('heroSubtitle'),
    loveQuote: () => document.getElementById('loveQuote'),
    storyImageURL: () => document.getElementById('storyImageURL'),
    storyImageUpload: () => document.getElementById('storyImageUpload'),
    storyTitle: () => document.getElementById('storyTitle'),
    storyDate: () => document.getElementById('storyDate'),
    storyDescription: () => document.getElementById('storyDescription'),
    // Display Elements
    body: () => document.body,
    navbar: () => document.getElementById('navbar'),
    adminPanel: () => document.getElementById('adminPanel'),
    logoText: () => document.getElementById('logoText'),
    heroBadge: () => document.getElementById('heroBadge'),
    heroTitle: () => document.getElementById('heroTitle'),
    heroSubtitleText: () => document.getElementById('heroSubtitleText'),
    footerQuote: () => document.getElementById('footerQuote'),
    footerNames: () => document.getElementById('footerNames'),
    days: () => document.getElementById('days'),
    hours: () => document.getElementById('hours'),
    minutes: () => document.getElementById('minutes'),
    seconds: () => document.getElementById('seconds'),
    storiesScroll: () => document.getElementById('storiesScroll'),
    storyModal: () => document.getElementById('storyModal'),
  };

  // --- 3. Core Functions ---

  /**
   * Loads state from localStorage or sets to default.
   */
  function loadState() {
    const savedState = localStorage.getItem('loveStoryState');
    if (savedState) {
      STATE = JSON.parse(savedState);
      // Ensure the theme is correctly applied on load
      ELEMENTS.body().setAttribute('data-theme', STATE.theme || DEFAULT_STATE.theme);
    } else {
      STATE = JSON.parse(JSON.stringify(DEFAULT_STATE)); // Deep copy
    }
  }

  /**
   * Saves current state to localStorage.
   */
  function saveState() {
    localStorage.setItem('loveStoryState', JSON.stringify(STATE));
  }

  /**
   * Updates all display elements based on the current STATE.
   */
  function renderContent() {
    const p1 = STATE.partner1;
    const p2 = STATE.partner2;
    const startYear = new Date(STATE.startDate).getFullYear();

    // Update Text Content
    ELEMENTS.logoText().textContent = `${p1.charAt(0)} & ${p2.charAt(0)}`;
    ELEMENTS.heroBadge().textContent = `✨ Together Since ${startYear}`;
    ELEMENTS.heroTitle().textContent = `${p1} & ${p2}`;
    ELEMENTS.heroSubtitleText().textContent = STATE.heroSubtitle;
    ELEMENTS.footerQuote().textContent = STATE.loveQuote;
    ELEMENTS.footerNames().textContent = `${p1} & ${p2} — Together Since ${startYear}`;

    // Update Admin Inputs
    ELEMENTS.partner1().value = p1;
    ELEMENTS.partner2().value = p2;
    ELEMENTS.startDate().value = STATE.startDate;
    ELEMENTS.anniversaryDate().value = STATE.anniversaryDate;
    ELEMENTS.heroSubtitle().value = STATE.heroSubtitle;
    ELEMENTS.loveQuote().value = STATE.loveQuote;

    // Re-render Stories
    renderStories();

    // Restart countdown
    if (STATE.countdownInterval) {
      clearInterval(STATE.countdownInterval);
    }
    STATE.countdownInterval = setInterval(updateCountdown, 1000);

    // Update theme buttons
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === STATE.theme) {
            btn.classList.add('active');
        }
    });
  }

  /**
   * Calculates and updates the countdown clock.
   */
  function updateCountdown() {
    const targetDate = new Date(STATE.anniversaryDate).getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 0) {
      // Anniversary passed, set to next year
      ELEMENTS.days().textContent = '🎉';
      ELEMENTS.hours().textContent = '🎉';
      ELEMENTS.minutes().textContent = '🎉';
      ELEMENTS.seconds().textContent = '🎉';
      // Auto-update to the next anniversary date (simple logic)
      const currentYear = new Date().getFullYear();
      const nextAnniversary = new Date(STATE.anniversaryDate);
      nextAnniversary.setFullYear(currentYear + 1);
      STATE.anniversaryDate = nextAnniversary.toISOString().split('T')[0];
      // Save the new date
      saveState();
      // Wait for the next renderContent to apply the new date
      return;
    }

    ELEMENTS.days().textContent = days < 1000 ? days : days.toLocaleString();
    ELEMENTS.hours().textContent = hours.toString().padStart(2, '0');
    ELEMENTS.minutes().textContent = minutes.toString().padStart(2, '0');
    ELEMENTS.seconds().textContent = seconds.toString().padStart(2, '0');
  }

  /**
   * Renders the stories list dynamically.
   */
  function renderStories() {
    const container = ELEMENTS.storiesScroll();
    // Get the first child (the "Add Memory" button)
    const addStoryBtn = container.querySelector('.add-story');
    // Clear all existing generated stories
    const existingStories = container.querySelectorAll('.story-item:not(.add-story)');
    existingStories.forEach(el => el.remove());
    
    // Sort stories by date descending
    STATE.stories.sort((a, b) => new Date(a.date) - new Date(b.date));

    STATE.stories.forEach(story => {
      const storyEl = document.createElement('div');
      storyEl.classList.add('story-item');
      storyEl.setAttribute('role', 'listitem');
      storyEl.setAttribute('tabindex', '0');
      storyEl.setAttribute('onclick', `app.openStoryModal(${story.id})`);
      storyEl.setAttribute('onkeypress', `app.handleStoryKeypress(event, ${story.id})`);

      storyEl.innerHTML = `
        <div class="story-avatar">
          <img class="story-image" src="${story.image}" alt="${story.title}" loading="lazy">
        </div>
        <div class="story-title">${story.title}</div>
        <div class="story-date">${new Date(story.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
      `;
      // Insert the new story *after* the Add Memory button
      container.insertBefore(storyEl, addStoryBtn.nextSibling);
    });
  }

  // --- 4. Public API (Business Logic) ---

  /**
   * Toggles the Admin Panel visibility.
   */
  function toggleAdmin() {
    ELEMENTS.adminPanel().classList.toggle('open');
  }

  /**
   * Opens the story upload area within the admin panel.
   */
  function openStoryUpload() {
    toggleAdmin(); // Open the admin panel
    // Optionally scroll to the stories section in the panel
    const storySection = document.querySelector('.admin-section:nth-child(4)');
    if (storySection) {
        ELEMENTS.adminPanel().scrollTop = storySection.offsetTop;
    }
  }

  /**
   * Changes the color theme.
   * @param {string} themeName 
   */
  function changeTheme(themeName) {
    ELEMENTS.body().setAttribute('data-theme', themeName);
    STATE.theme = themeName;
    saveState();
    renderContent(); // Re-render to update admin buttons
  }

  /**
   * Opens a specific story in the modal.
   * @param {number} id 
   */
  function openStoryModal(id) {
    const story = STATE.stories.find(s => s.id === id);
    if (!story) return;

    document.getElementById('storyModalImage').src = story.image;
    document.getElementById('storyModalImage').alt = story.title;
    document.getElementById('storyModalTitle').textContent = story.title;
    document.getElementById('storyModalDate').textContent = new Date(story.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('storyModalDescription').textContent = story.description;

    ELEMENTS.storyModal().classList.add('open');
  }

  /**
   * Closes the story modal.
   */
  function closeStoryModal() {
    ELEMENTS.storyModal().classList.remove('open');
  }

  /**
   * Scrolls the stories container left or right.
   * @param {number} direction - 1 for right, -1 for left
   */
  function scrollStories(direction) {
    const scrollAmount = 300; // Pixels to scroll
    ELEMENTS.storiesScroll().scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }

  /**
   * Handles keyboard input for story item accessibility.
   * @param {Event} event 
   * @param {number} id 
   */
  function handleStoryKeypress(event, id) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (id) {
            openStoryModal(id);
        } else {
            openStoryUpload();
        }
    }
  }

  /**
   * Adds a new story from the admin panel inputs.
   */
  function addStory() {
    const title = ELEMENTS.storyTitle().value.trim();
    const date = ELEMENTS.storyDate().value;
    const description = ELEMENTS.storyDescription().value.trim();
    let imageUrl = ELEMENTS.storyImageURL().value.trim();
    const imageFile = ELEMENTS.storyImageUpload().files[0];

    if (!title || !date || !description || (!imageUrl && !imageFile)) {
      alert("Please fill out all story fields and provide an image URL or upload a file.");
      return;
    }

    const processStory = (imgUrl) => {
        const newStory = {
            id: Date.now(), // Use timestamp for a unique ID
            image: imgUrl || imageUrl,
            title: title,
            date: date,
            description: description
        };
        STATE.stories.push(newStory);
        saveState();
        renderContent();
        
        // Reset form fields
        ELEMENTS.storyImageURL().value = '';
        ELEMENTS.storyImageUpload().value = '';
        ELEMENTS.storyTitle().value = '';
        ELEMENTS.storyDate().value = '';
        ELEMENTS.storyDescription().value = '';
        alert("Story added successfully! 🎉");
    };

    if (imageFile) {
        // Convert file to a data URL (for simple client-side persistence)
        const reader = new FileReader();
        reader.onload = (e) => processStory(e.target.result);
        reader.readAsDataURL(imageFile);
    } else {
        processStory();
    }
  }

  /**
   * Reads admin inputs and updates the STATE.
   */
  function updateStateFromAdmin() {
    STATE.partner1 = ELEMENTS.partner1().value.trim() || DEFAULT_STATE.partner1;
    STATE.partner2 = ELEMENTS.partner2().value.trim() || DEFAULT_STATE.partner2;
    STATE.startDate = ELEMENTS.startDate().value || DEFAULT_STATE.startDate;
    STATE.anniversaryDate = ELEMENTS.anniversaryDate().value || DEFAULT_STATE.anniversaryDate;
    STATE.heroSubtitle = ELEMENTS.heroSubtitle().value.trim() || DEFAULT_STATE.heroSubtitle;
    STATE.loveQuote = ELEMENTS.loveQuote().value.trim() || DEFAULT_STATE.loveQuote;

    saveState();
    renderContent();
  }

  /**
   * Resets the application state to the default and reloads.
   */
  function resetToDefault() {
    if (confirm("Are you sure you want to reset all customizations to the default template? This cannot be undone.")) {
      localStorage.removeItem('loveStoryState');
      window.location.reload();
    }
  }

  /**
   * Enables the user to download the final HTML page (Client Deliverable).
   * NOTE: For a true business, you might deliver a complete zip with the
   * final HTML/CSS/JS with the admin panel removed or secured.
   */
  function exportHTML() {
    // Clone the document to modify it without affecting the current page
    const clonedDoc = document.cloneNode(true);
    
    // Remove admin panel and admin toggle button
    const adminPanel = clonedDoc.querySelector('.admin-panel');
    const adminToggle = clonedDoc.querySelector('.admin-toggle');
    const watermark = clonedDoc.querySelector('.watermark');
    
    if (adminPanel) adminPanel.remove();
    if (adminToggle) adminToggle.remove();
    if (watermark) watermark.remove();
    
    // Remove admin-related JavaScript functions (optional - keep minimal functionality)
    const scripts = clonedDoc.querySelectorAll('script');
    scripts.forEach(script => {
      if (script.src.includes('app.js')) {
        script.remove();
      }
    });
    
    // Add inline script for countdown only (no admin features)
    const inlineScript = clonedDoc.createElement('script');
    inlineScript.textContent = `
      // Countdown functionality only
      const anniversaryDate = '${STATE.anniversaryDate}';
      
      function updateCountdown() {
        const targetDate = new Date(anniversaryDate).getTime();
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance < 0) {
          document.getElementById('days').textContent = '🎉';
          document.getElementById('hours').textContent = '🎉';
          document.getElementById('minutes').textContent = '🎉';
          document.getElementById('seconds').textContent = '🎉';
          return;
        }

        document.getElementById('days').textContent = days < 1000 ? days : days.toLocaleString();
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
      }

      setInterval(updateCountdown, 1000);
      updateCountdown();

      // Sticky nav
      window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });

      // Story modal
      window.openStoryModal = function(id) {
        const stories = ${JSON.stringify(STATE.stories)};
        const story = stories.find(s => s.id === id);
        if (!story) return;

        document.getElementById('storyModalImage').src = story.image;
        document.getElementById('storyModalImage').alt = story.title;
        document.getElementById('storyModalTitle').textContent = story.title;
        document.getElementById('storyModalDate').textContent = new Date(story.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('storyModalDescription').textContent = story.description;
        document.getElementById('storyModal').classList.add('open');
      };

      window.closeStoryModal = function() {
        document.getElementById('storyModal').classList.remove('open');
      };

      // Particles
      const particleContainer = document.getElementById('particles');
      if (particleContainer) {
        for (let i = 0; i < 50; i++) {
          const particle = document.createElement('div');
          particle.classList.add('particle');
          particle.style.left = Math.random() * 100 + 'vw';
          particle.style.animationDelay = Math.random() * 6 + 's';
          particle.style.opacity = '0';
          particleContainer.appendChild(particle);
        }
      }
    `;
    clonedDoc.body.appendChild(inlineScript);
    
    // Remove onclick/onkeypress attributes that reference app object
    const elementsWithApp = clonedDoc.querySelectorAll('[onclick*="app."], [onkeypress*="app."]');
    elementsWithApp.forEach(el => {
      const onclick = el.getAttribute('onclick');
      const onkeypress = el.getAttribute('onkeypress');
      
      if (onclick) {
        el.setAttribute('onclick', onclick.replace('app.', ''));
      }
      if (onkeypress) {
        el.setAttribute('onkeypress', onkeypress.replace('app.', ''));
      }
    });
    
    // Remove "Add Memory" button
    const addStoryBtn = clonedDoc.querySelector('.add-story');
    if (addStoryBtn) addStoryBtn.remove();
    
    const htmlContent = clonedDoc.documentElement.outerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `LoveStory_${STATE.partner1}_${STATE.partner2}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert("✅ Client-ready HTML downloaded! The file includes all current content without the admin panel.");
  }

  /**
   * Simulates generating a share link (requires a real hosting/backend setup).
   */
  function shareLink() {
    const link = window.location.href;
    navigator.clipboard.writeText(link)
      .then(() => alert(`Share Link Copied! (Simulated link: ${link}) \n\nNOTE: In a real business, this would generate a unique, non-editable public link for the client.`))
      .catch(err => console.error('Could not copy link: ', err));
  }

  // --- 5. Initialization & Event Listeners ---

  function init() {
    loadState();
    renderContent();

    // Event listeners for admin inputs
    ['partner1', 'partner2', 'startDate', 'anniversaryDate', 'heroSubtitle', 'loveQuote'].forEach(id => {
      ELEMENTS[id]().addEventListener('change', updateStateFromAdmin);
    });

    // Sticky Nav functionality
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        ELEMENTS.navbar().classList.add('scrolled');
      } else {
        ELEMENTS.navbar().classList.remove('scrolled');
      }
    });

    // Particle Generation (Background effect)
    const particleContainer = document.getElementById('particles');
    if (particleContainer) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.animationDelay = `${Math.random() * 6}s`;
        particle.style.opacity = '0';
        particleContainer.appendChild(particle);
      }
    }
  }

  // Initialize the app when the DOM is ready
  document.addEventListener('DOMContentLoaded', init);

  // Expose public functions
  return {
    toggleAdmin,
    changeTheme,
    openStoryModal,
    closeStoryModal,
    scrollStories,
    handleStoryKeypress,
    addStory,
    openStoryUpload,
    exportHTML,
    shareLink,
    resetToDefault
  };
})();