const API_KEY = "2849d82bfa304b10864fc7daffbd9a5b";
const url = "https://newsapi.org/v2/everything?q=";

// Add category keywords at the top of the file
const categoryKeywords = {
    india: [
        'India Politics', 'Indian Economy', 'Bollywood', 'Indian Cricket', 'Indian Technology',
        'Indian Startups', 'Indian Culture', 'Indian Education', 'Indian Defence', 'Indian Space',
        'Indian Sports', 'Indian Tourism', 'Indian Infrastructure', 'Indian Agriculture', 'Indian Healthcare'
    ],
    world: [
        'Global Politics', 'World Economy', 'Climate Change', 'International Relations', 'Global Technology',
        'Space Exploration', 'World Health', 'Global Markets', 'World Sports', 'Scientific Discoveries',
        'International Trade', 'Global Innovation', 'World Peace', 'Environmental News', 'World Leaders'
    ],
    technology: [
        'Artificial Intelligence', 'Blockchain', 'Cloud Computing', 'Cybersecurity', 'Machine Learning',
        'IoT', '5G Technology', 'Virtual Reality', 'Quantum Computing', 'Robotics',
        'Space Tech', 'Green Technology', 'Tech Startups', 'Digital Transformation', 'Software Development'
    ],
    business: [
        'Stock Market', 'Cryptocurrency', 'Startups', 'Financial Markets', 'Corporate News',
        'Banking Sector', 'E-commerce', 'Market Analysis', 'Business Strategy', 'Investment News',
        'Economic Policy', 'Real Estate', 'Business Leadership', 'Industry Trends', 'Mergers Acquisitions'
    ],
    sports: [
        'Cricket', 'Football', 'Tennis', 'Basketball', 'Formula 1',
        'Olympics', 'Athletics', 'Boxing', 'Hockey', 'Badminton',
        'Golf', 'Wrestling', 'Kabaddi', 'Sports Business', 'E-sports'
    ]
};

// Add this after categoryKeywords
const recommendedNews = {
    currentArticle: null,
    interests: new Set(),
    disinterests: new Set()
};

// Add this at the top
const newsState = {
    currentPage: 1,
    loading: false,
    articles: [],
    category: 'general',
    query: '',
    error: null
};

// Add at the top with other constants
const userPreferences = {
    categories: new Set(),
    hasSelected: false
};

function showRecommendation(articles) {
    const unseenArticles = articles.filter(article => 
        !recommendedNews.interests.has(article.url) && 
        !recommendedNews.disinterests.has(article.url) &&
        article.urlToImage
    );
    
    if (!unseenArticles.length) return;
    
    // Get two random articles for stacking
    const randomArticles = unseenArticles
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
    
    const colors = [
        'from-blue-500 to-purple-500',
        'from-purple-500 to-pink-500',
        'from-indigo-500 to-cyan-500',
        'from-cyan-500 to-emerald-500'
    ];
    
    const heroContent = document.querySelector('.hero-content-wrapper');
    heroContent.innerHTML = `
        <div class="max-w-6xl mx-auto relative">
            <!-- Back Card (Stacked) -->
            <div class="absolute inset-0 transform translate-y-8 translate-x-4 scale-95 opacity-50">
                <div class="recommendation-content rounded-3xl overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-primary/20">
                    <div class="grid md:grid-cols-2 gap-0 min-h-[600px]">
                        <div class="recommendation-header relative h-full">
                            <img src="${randomArticles[1].urlToImage}" 
                                 alt="News thumbnail" 
                                 class="w-full h-full object-cover filter grayscale opacity-50">
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Front Card (Active) -->
            <div class="relative z-10 transform transition-all duration-500 hover:-translate-y-2">
                <div class="recommendation-content rounded-3xl overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-primary/20">
                    <div class="grid md:grid-cols-2 gap-0 min-h-[600px]">
                        <div class="recommendation-header relative h-full">
                            <img src="${randomArticles[0].urlToImage}" 
                                 alt="News thumbnail" 
                                 class="w-full h-full object-cover">
                            <div class="absolute inset-0 bg-gradient-to-tr ${colors[0]} opacity-20"></div>
                        </div>
                        <div class="p-12 flex flex-col justify-center">
                            <div class="inline-flex px-4 py-2 rounded-full bg-gradient-to-r ${colors[0]} text-white mb-6 w-max">
                                <span class="text-sm font-medium">Featured News</span>
                            </div>
                            <h1 class="text-4xl font-bold mb-4 dark:text-white">
                                ${randomArticles[0].title}
                            </h1>
                            <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
                                ${randomArticles[0].description}
                            </p>
                            <div class="flex items-center justify-between mb-8">
                                <div class="flex-1">
                                    <p class="text-sm text-gray-400 dark:text-gray-500 flex items-center">
                                        <i class="fas fa-newspaper mr-2"></i>
                                        ${randomArticles[0].source.name}
                                    </p>
                                    <p class="text-sm text-gray-400 dark:text-gray-500 flex items-center mt-1">
                                        <i class="fas fa-clock mr-2"></i>
                                        ${new Date(randomArticles[0].publishedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div class="flex gap-4">
                                <button onclick="handleInterest(true)" 
                                        class="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r ${colors[0]} text-white hover:opacity-90 transition-all duration-300">
                                    <i class="fas fa-book-reader mr-2"></i>
                                    Read Full Story
                                </button>
                                <button onclick="handleInterest(false)" 
                                        class="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                                    <i class="fas fa-forward"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Show next recommendation after 7 seconds
    setTimeout(() => {
        showRecommendation(articles);
    }, 7000);
}

// Add after existing categoryKeywords
const subCategories = {
    india: [
        { label: 'Delhi News', query: 'Delhi news updates' },
        { label: 'Politics', query: 'Indian politics latest' },
        { label: 'Economy', query: 'Indian economy market' },
        { label: 'Entertainment', query: 'Bollywood entertainment' },
        { label: 'Crime', query: 'India crime news' },
        { label: 'Education', query: 'Indian education updates' }
    ],
    world: [
        { label: 'Asia', query: 'Asia latest news' },
        { label: 'Europe', query: 'European updates' },
        { label: 'Americas', query: 'Americas news' },
        { label: 'Middle East', query: 'Middle East updates' },
        { label: 'Africa', query: 'Africa latest news' }
    ],
    technology: [
        { label: 'AI & ML', query: 'Artificial Intelligence Machine Learning' },
        { label: 'Mobile', query: 'smartphone technology' },
        { label: 'Startups', query: 'tech startups india' },
        { label: 'Apps', query: 'new apps technology' },
        { label: 'Gadgets', query: 'latest gadgets' }
    ],
    business: [
        { label: 'Markets', query: 'stock market updates' },
        { label: 'Crypto', query: 'cryptocurrency news' },
        { label: 'Companies', query: 'company business news' },
        { label: 'Startups', query: 'business startups' },
        { label: 'Economy', query: 'economy updates' }
    ],
    sports: [
        { label: 'Cricket', query: 'cricket matches news' },
        { label: 'Football', query: 'football matches' },
        { label: 'Tennis', query: 'tennis tournaments' },
        { label: 'F1', query: 'Formula 1 racing' },
        { label: 'Kabaddi', query: 'kabaddi matches' }
    ]
};

// Add at the top of the file
const navKeywords = {
    india: ['India', 'Bharat', 'Incredible India', 'Desi News', 'Indian Updates'],
    world: ['World', 'Global', 'International', 'Planet', 'Worldwide'],
    technology: ['Tech', 'Innovation', 'Digital', 'Future', 'Gadgets'],
    business: ['Business', 'Finance', 'Market', 'Economy', 'Commerce'],
    sports: ['Sports', 'Games', 'Athletics', 'Matches', 'Play']
};

// Initialize Lenis
const lenis = new Lenis();

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Add scroll handler for geometric shapes
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroSection = document.querySelector('.hero-section');
    const maxScroll = heroSection.offsetHeight;
    const scrollState = Math.floor((scrolled / maxScroll) * 2);
    
    heroSection.setAttribute('data-scroll', Math.min(scrollState, 2));
});

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Add this function
function updateNavLabels() {
    Object.keys(navKeywords).forEach(category => {
        const keywords = navKeywords[category];
        const randomIndex = Math.floor(Math.random() * keywords.length);
        const buttons = document.querySelectorAll(`[data-category="${category}"]`);
        buttons.forEach(button => {
            button.textContent = keywords[randomIndex];
        });
    });
}

// Update fetchInitialNews function
async function fetchInitialNews() {
    try {
        const response = await fetch(`${url}top headlines&sortBy=relevancy&language=en&pageSize=20&apiKey=${API_KEY}`);
        const data = await response.json();
        if (data.status === "error") throw new Error(data.message);
        newsState.articles = data.articles;
        return data;
    } catch (error) {
        newsState.error = error.message;
        return null;
    }
}

// Add loading state function
function showLoadingState() {
    if (newsState.currentPage === 1) {
        const cardsContainer = document.getElementById("cards-container");
        cardsContainer.innerHTML = `
            <div class="col-span-full flex items-center justify-center py-20">
                <div class="loading-spinner"></div>
                <p class="ml-4 text-gray-500">Loading news...</p>
            </div>
        `;
    }
}

// Add error state function
function showErrorState(message) {
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = `
        <div class="col-span-full text-center py-20">
            <div class="mb-4 text-gray-400">
                <i class="fas fa-newspaper text-4xl"></i>
            </div>
            <p class="text-gray-500">${message}</p>
            <button onclick="retryFetch()" class="mt-4 px-6 py-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-all">
                Try Again
            </button>
        </div>
    `;
}

// Add retry function
function retryFetch() {
    if (newsState.query) {
        fetchNews(newsState.query, newsState.currentPage);
    } else {
        fetchInitialNews().then(data => {
            if (data?.articles) bindData(data.articles);
        });
    }
}

// Add new function to fetch initial news
async function fetchNews(query, page = 1) {
    if (newsState.loading) return;
    newsState.loading = true;
    newsState.query = query;
    
    try {
        showLoadingState();
        const searchUrl = `${url}${encodeURIComponent(query)}&sortBy=relevancy&language=en&pageSize=12&page=${page}&apiKey=${API_KEY}`;
        const res = await fetch(searchUrl);
        const data = await res.json();
        
        if (data.status === "error") throw new Error(data.message);

        if (data.articles?.length > 0) {
            if (page === 1) {
                newsState.articles = data.articles;
            } else {
                newsState.articles = [...newsState.articles, ...data.articles];
            }
            bindData(data.articles, page > 1);
        } else {
            throw new Error('No articles found');
        }
    } catch (error) {
        showErrorState(error.message);
    } finally {
        newsState.loading = false;
    }
}

// Add after initializeApp function
function showPreferencesModal() {
    const modal = document.createElement('div');
    modal.className = 'preferences-modal';
    modal.innerHTML = `
        <div class="preferences-content">
            <div class="flex flex-col items-center mb-6 relative">
                <div class="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-full blur-3xl"></div>
                <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-primary-light/20 to-primary/20 rounded-full blur-3xl"></div>
                
                <div class="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-xl mb-3 shadow-lg shadow-primary/20">
                    <i class="fas fa-newspaper text-xl text-white"></i>
                </div>
                
                <h2 class="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                    Personalize Your Feed
                </h2>
                <p class="text-gray-600 dark:text-gray-400 text-sm text-center">
                    Choose at least 3 categories
                </p>
            </div>
            
            <div class="preference-grid">
                ${Object.keys(categoryKeywords).map(category => `
                    <div class="preference-item group" data-category="${category}">
                        <div class="flex items-center mb-2">
                            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary-light/10 
                                        flex items-center justify-center mr-2 group-hover:scale-110 transition-transform">
                                <i class="fas ${getCategoryIcon(category)} text-sm text-primary"></i>
                            </div>
                            <div>
                                <h3 class="text-base font-semibold capitalize dark:text-white">${category}</h3>
                                <p class="text-xs text-primary-light opacity-75">${categoryKeywords[category].length} topics</p>
                            </div>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            ${getCategoryDescription(category)}
                        </p>
                    </div>
                `).join('')}
            </div>

            <div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <div class="flex items-center space-x-2">
                    <div class="flex -space-x-1">
                        ${Array.from({length: 3}, (_, i) => `
                            <div class="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 ${
                                'bg-gradient-to-br from-primary to-primary-light opacity-' + (100 - i * 25)
                            }"></div>
                        `).join('')}
                    </div>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                        <span id="selection-count" class="font-medium text-primary">0</span>/3
                    </span>
                </div>
                
                <button disabled 
                        id="preferences-submit"
                        class="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium
                               disabled:opacity-50 disabled:cursor-not-allowed
                               enabled:hover:shadow-lg enabled:hover:shadow-primary/20
                               transition-all duration-300 relative group">
                    <span class="relative z-10 flex items-center">
                        <span>Get Started</span>
                        <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                    </span>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 100);

    setupPreferencesHandlers(modal);
}

function getCategoryIcon(category) {
    const icons = {
        india: 'fa-map-marked-alt',
        world: 'fa-globe',
        technology: 'fa-microchip',
        business: 'fa-chart-line',
        sports: 'fa-running'
    };
    return icons[category] || 'fa-newspaper';
}

function setupPreferencesHandlers(modal) {
    const items = modal.querySelectorAll('.preference-item');
    const submitBtn = modal.querySelector('#preferences-submit');
    const selectionCount = modal.querySelector('#selection-count');

    items.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('selected');
            const category = item.dataset.category;
            
            if (item.classList.contains('selected')) {
                userPreferences.categories.add(category);
            } else {
                userPreferences.categories.delete(category);
            }

            selectionCount.textContent = userPreferences.categories.size;
            submitBtn.disabled = userPreferences.categories.size < 3;
        });
    });

    submitBtn.addEventListener('click', () => {
        userPreferences.hasSelected = true;
        localStorage.setItem('userPreferences', JSON.stringify({
            categories: Array.from(userPreferences.categories),
            hasSelected: true
        }));
        
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            fetchMixedNews();
        }, 300);
    });
}

function getCategoryDescription(category) {
    const descriptions = {
        india: 'Local news and updates from across India',
        world: 'Global news and international affairs',
        technology: 'Latest in tech, gadgets, and innovation',
        business: 'Market updates and company news',
        sports: 'Sports coverage and live updates'
    };
    return descriptions[category];
}

function fetchMixedNews() {
    const categories = Array.from(userPreferences.categories);
    const queries = categories.map(cat => getRandomKeyword(cat));
    
    Promise.all(queries.map(query => 
        fetch(`${url}${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=4&apiKey=${API_KEY}`)
            .then(res => res.json())
    ))
    .then(results => {
        const mixedArticles = results.flatMap(data => data.articles || [])
            .sort(() => Math.random() - 0.5)
            .slice(0, 12);
        
        if (mixedArticles.length > 0) {
            bindData(mixedArticles);
            // Update heading
            const mainHeading = document.getElementById('main-heading');
            if (mainHeading) {
                mainHeading.innerHTML = 'Your Personalized News Feed';
            }
        }
    })
    .catch(error => {
        console.error('Error fetching mixed news:', error);
        showErrorState('Failed to load personalized news');
    });
}

// Update the window load event listener
window.addEventListener("load", async () => {
    updateNavLabels();
    
    // Check if user has selected preferences
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
        const { categories, hasSelected } = JSON.parse(savedPreferences);
        userPreferences.categories = new Set(categories);
        userPreferences.hasSelected = hasSelected;
    }
    
    if (!userPreferences.hasSelected) {
        showPreferencesModal();
    }
    
    await initializeApp();
});

// Add initialization function
async function initializeApp() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    const initialNews = await fetchInitialNews();
    if (initialNews?.articles) {
        showRecommendation(initialNews.articles);
    }
    
    setupInfiniteScroll();
}

// Update infinite scroll
function setupInfiniteScroll() {
    const observer = new IntersectionObserver(entries => {
        const lastEntry = entries[0];
        if (lastEntry.isIntersecting && !newsState.loading) {
            newsState.currentPage++;
            fetchNews(newsState.query || 'general', newsState.currentPage);
        }
    }, { threshold: 0.5 });
    
    const sentinel = document.querySelector('#scroll-sentinel');
    if (sentinel) observer.observe(sentinel);
}

function reload() {
  window.location.reload();
}

// Add new functions for hero section
function handleHeroSearch() {
  const searchInput = document.getElementById("hero-search");
  const query = searchInput.value;
  if (!query) return;
  fetchNews(query);
  searchInput.value = "";
}

// Reading Time Calculator
function getReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Share functionality
function shareArticle(article) {
  if (navigator.share) {
    navigator.share({
      title: article.title,
      text: article.description,
      url: article.url
    });
  }
}

// Search History
function addToSearchHistory(query) {
  let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
  history = [query, ...history.slice(0, 4)]; // Keep last 5 searches
  localStorage.setItem('searchHistory', JSON.stringify(history));
}

// Updated handleSearch function
function handleSearch(query) {
    if (!query || query.trim().length === 0) return;
    
    const searchTerm = query.trim();
    currentQuery = searchTerm;
    page = 1;

    // Clear previous results
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = `
        <div class="col-span-full text-center py-10">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p class="text-primary-dark mt-4">Searching for "${searchTerm}"...</p>
        </div>
    `;

    // Fetch news
    fetch(`${url}${encodeURIComponent(searchTerm)}&sortBy=publishedAt&pageSize=12&apiKey=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === "error") {
                throw new Error(data.message);
            }
            if (data.articles && data.articles.length > 0) {
                cardsContainer.innerHTML = '';
                bindData(data.articles);
            } else {
                throw new Error('No articles found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            cardsContainer.innerHTML = `
                <div class="col-span-full text-center py-10">
                    <p class="text-gray-500">No results found for "${searchTerm}". Try different keywords.</p>
                </div>
            `;
        });

    // Clear search input
    document.getElementById("hero-search").value = "";
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Search button click
    const searchButton = document.querySelector('.hero-content button');
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const searchInput = document.getElementById("hero-search");
            handleSearch(searchInput.value);
        });
    }

    // Search input enter key
    const searchInput = document.getElementById("hero-search");
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch(e.target.value);
            }
        });
    }
});

// Update the bindData function to show recommendation
function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  articles.forEach((article) => {
    if (!article.urlToImage) return;
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });

  // Show recommendation after loading articles
  setTimeout(() => showRecommendation(articles), 5000);
}

function showNewsModal(article) {
    const similarArticles = findSimilarArticles(article, newsState.articles, 2);
    
    const modal = document.createElement('div');
    modal.className = 'news-modal';
    modal.innerHTML = `
        <div class="news-modal-content w-[95%] max-w-5xl">
            <div class="flex items-start gap-4">
                <!-- Main Article -->
                <div class="flex-1">
                    <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div class="relative h-56">
                            <img src="${article.urlToImage}" 
                                 alt="${article.title}"
                                 class="w-full h-full object-cover"
                            >
                            <button onclick="closeNewsModal(this)"
                                    class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all">
                                <i class="fas fa-times text-sm"></i>
                            </button>
                            <div class="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60"></div>
                            <div class="absolute bottom-0 inset-x-0 p-4">
                                <div class="flex items-center gap-2 mb-2">
                                    <span class="px-2 py-1 rounded-full bg-primary/20 backdrop-blur-sm text-white text-xs">
                                        ${article.source.name}
                                    </span>
                                    <span class="text-xs text-gray-200">
                                        ${new Date(article.publishedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="p-4">
                            <h1 class="text-base font-bold mb-2 text-gray-900 dark:text-white">
                                ${article.title}
                            </h1>
                            
                            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                ${article.description}
                            </p>
                            
                            <div class="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                                <a href="${article.url}" target="_blank" 
                                   class="text-primary hover:text-primary-dark text-sm font-medium">
                                   Read full article
                                </a>
                                <button onclick="shareArticle(${JSON.stringify(article)})"
                                        class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                                    <i class="fas fa-share-alt text-sm"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Related Articles -->
                <div class="w-72 space-y-3">
                    <h3 class="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-2">Related Stories</h3>
                    ${similarArticles.map(related => `
                        <div onclick="showNewsModal(${JSON.stringify(related)})"
                             class="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-colors">
                            <div class="relative h-24">
                                <img src="${related.urlToImage}" 
                                     alt="${related.title}"
                                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                >
                                <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                            </div>
                            <div class="p-3">
                                <h4 class="text-xs font-medium text-gray-900 dark:text-white group-hover:text-primary line-clamp-2 mb-1">
                                    ${related.title}
                                </h4>
                                <p class="text-xs text-gray-500 dark:text-gray-400">
                                    ${related.source.name}
                                </p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.classList.add('active'), 50);
}

function findSimilarArticles(article, allArticles, count = 3) {
    const keywords = article.title.toLowerCase().split(' ')
        .filter(word => word.length > 3);
    
    return allArticles
        .filter(a => a.urlToImage && a.url !== article.url)
        .map(a => ({
            article: a,
            relevance: keywords.filter(keyword => 
                a.title.toLowerCase().includes(keyword)
            ).length
        }))
        .sort((a, b) => b.relevance - a.relevance)
        .map(item => item.article)
        .slice(0, count);
}

function closeNewsModal(button) {
    const modal = button.closest('.news-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Remove modal after animation
    setTimeout(() => modal.remove(), 400);
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description;

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  newsSource.innerHTML = `${article.source.name} · ${date}`;

  // Update click handler to show modal instead of redirecting
  cardClone.querySelector('.card').style.cursor = 'pointer';
  cardClone.querySelector('.card').addEventListener("click", () => {
    showNewsModal(article);
  });

  // Add technology tags
  const tags = extractTechTags(article.title + " " + article.description);
  if (tags.length > 0) {
    const tagsContainer = document.createElement("div");
    tagsContainer.className = "flex flex-wrap gap-2 mt-3";
    tags.forEach((tag) => {
      const tagEl = document.createElement("span");
      tagEl.className = "tag";
      tagEl.textContent = tag;
      tagsContainer.appendChild(tagEl);
    });
    cardClone.querySelector(".card-content").appendChild(tagsContainer);
  }

  // Create button container with only share button
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex items-center justify-end mt-4';

  // Add share button with new design
  const shareBtn = document.createElement('button');
  shareBtn.className = 'inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200 transition-all transform hover:scale-110';
  shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
  shareBtn.onclick = (e) => {
    e.stopPropagation();
    shareArticle(article);
  };
  buttonContainer.appendChild(shareBtn);

  cardClone.querySelector('.card-content').appendChild(buttonContainer);
}

function extractTechTags(text) {
  // Empty array since we're removing tech tags
  return [];
}

let curSelectedNav = null;

// Add this function after the existing code
function getRandomKeyword(category) {
    const keywords = categoryKeywords[category];
    const randomIndex = Math.floor(Math.random() * keywords.length);
    return keywords[randomIndex];
}

// Update the onNavItemClick function
function onNavItemClick(id) {
    const query = getRandomKeyword(id);
    const categoryUrl = `${url}${encodeURIComponent(query)}&sortBy=relevancy&language=en&pageSize=12&apiKey=${API_KEY}`;

    // Show loading state with updated message
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = `
        <div class="col-span-full text-center py-10">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p class="text-primary-dark mt-4">Showing ${id.charAt(0).toUpperCase() + id.slice(1)} news about "${query}"...</p>
        </div>
    `;

    // Fetch category news
    fetch(categoryUrl)
        .then(res => res.json())
        .then(data => {
            if (data.articles && data.articles.length > 0) {
                bindData(data.articles);
            } else {
                throw new Error('No articles found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            cardsContainer.innerHTML = `
                <div class="col-span-full text-center py-10">
                    <p class="text-gray-500">Unable to load ${query} news. Please try again later.</p>
                </div>
            `;
        });

    // Update active state
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");

    // Add subcategories with updated button markup
    const subCategoriesContainer = document.getElementById('sub-categories');
    if (subCategoriesContainer) {
        subCategoriesContainer.innerHTML = subCategories[id].map(sub => `
            <button onclick="onSubCategoryClick('${sub.query}', '${sub.label}')"
                    data-label="${sub.label}"
                    class="sub-category-btn px-4 py-2 text-sm rounded-full border border-primary/20
                           hover:bg-primary/10 hover:border-primary transition-all duration-300">
                ${sub.label}
            </button>
        `).join('');
        subCategoriesContainer.style.display = 'flex';
    }

    // Update main heading
    const mainHeading = document.getElementById('main-heading');
    if (mainHeading) {
        mainHeading.innerHTML = `Showing ${id.charAt(0).toUpperCase() + id.slice(1)} news...`;
    }
}

// Fix onSubCategoryClick function
function onSubCategoryClick(query, label) {
    fetchNews(query);
    
    // Update active state using label
    document.querySelectorAll('.sub-category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-label') === label) {
            btn.classList.add('active');
        }
    });

    // Update the heading
    const mainHeading = document.getElementById('main-heading');
    if (mainHeading) {
        const category = document.querySelector('.nav-btn.active')?.textContent || '';
        mainHeading.innerHTML = `Showing ${category} news about "${label}"...`;
    }
}

function postNews() {
  // Open the news submission modal
  document.getElementById("news-modal").style.display = "block";
}

function toggleMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  mobileMenu.classList.toggle("hidden");
}

function scrollToContact() {
  // Open the contact form modal when clicking Contact Us
  document.getElementById("contact-modal").style.display = "block";
}

function closeContactModal() {
  // Close the contact form modal
  document.getElementById("contact-modal").style.display = "none";
}

// Close the modal when clicking outside of it
window.onclick = function (event) {
  const modal = document.getElementById("contact-modal");
  if (event.target === modal) {
    closeContactModal();
  }
};

// Handle contact form submission (optional, replace with your logic)
document
  .getElementById("contact-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
    // Get form data
    const name = event.target["contact-name"].value;
    const email = event.target["contact-email"].value;
    const message = event.target["contact-message"].value;

    // You can add your logic to send this data to your server here.
    console.log("Contact Submitted:", { name, email, message });
    closeContactModal(); // Close the modal after submission
  });

function closeModal() {
  // Close the news submission modal
  document.getElementById("news-modal").style.display = "none";
}

// Close the modal when clicking outside of it
window.onclick = function (event) {
  const modal = document.getElementById("news-modal");
  if (event.target === modal) {
    closeModal();
  }
};

// Handle form submission (optional, replace with your logic)
document
  .getElementById("news-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
    // Get form data
    const title = event.target["news-title"].value;
    const content = event.target["news-content"].value;
    const author = event.target["news-author"].value;
    const imageFile = event.target["news-image"].files[0];

    // You can add your logic to send this data to your server here.
    console.log("News Submitted:", { title, content, author, imageFile });
    closeModal(); // Close the modal after submission
  });

// Infinite Scroll
let page = 1;
let loading = false;
let currentQuery = "India";

window.addEventListener('scroll', () => {
  if (loading) return;
  
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500) {
    loading = true;
    page++;
    fetchNews(currentQuery, page).finally(() => {
      loading = false;
    });
  }
});

// Add scroll handler for geometric shapes
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroSection = document.querySelector('.hero-section');
    const maxScroll = heroSection.offsetHeight;
    const scrollState = Math.floor((scrolled / maxScroll) * 2);
    
    heroSection.setAttribute('data-scroll', Math.min(scrollState, 2));
});

// Theme Toggle
function toggleTheme(event) {
    // Set ripple origin
    if (event) {
        document.body.style.setProperty('--click-x', `${event.clientX}px`);
        document.body.style.setProperty('--click-y', `${event.clientY}px`);
        document.body.style.setProperty('--ripple-color', 
            document.body.classList.contains('dark-mode') 
                ? 'rgba(139, 92, 246, 0.2)' 
                : 'rgba(139, 92, 246, 0.1)'
        );
    }
    
    document.body.classList.add('theme-transition');
    
    requestAnimationFrame(() => {
        document.body.classList.toggle('dark-mode');
        
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update icons with fade rotation
        const moonIcon = document.querySelector('.fa-moon');
        const sunIcon = document.querySelector('.fa-sun');
        
        if (isDark) {
            moonIcon?.classList.add('hidden');
            sunIcon?.classList.remove('hidden');
            sunIcon?.classList.add('theme-icon-spin');
            setTimeout(() => sunIcon?.classList.remove('theme-icon-spin'), 700);
        } else {
            moonIcon?.classList.remove('hidden');
            sunIcon?.classList.add('hidden');
            moonIcon?.classList.add('theme-icon-spin');
            setTimeout(() => moonIcon?.classList.remove('theme-icon-spin'), 700);
        }

        // Remove transition class
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 1000);
    });
}

// Check theme on load with smooth transition
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        const moonIcon = document.querySelector('.fa-moon');
        const sunIcon = document.querySelector('.fa-sun');
        moonIcon?.classList.add('hidden');
        sunIcon?.classList.remove('hidden');
    }
});
