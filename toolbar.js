(function () {
    'use strict';

    const search_tool = {
        platformsInfo: [
            { icon: 'icons/bing.png', name: 'bing', domain: 'bing.com', url: 'https://www.bing.com/search?q=' },
            { icon: 'icons/google.png', name: 'google', domain: 'google.com', url: 'https://www.google.com/search?q=' },
            { icon: 'icons/bilibili.png', name: 'bilibili', domain: 'bilibili.com', url: 'https://search.bilibili.com/all?keyword=' },
            { icon: 'icons/youtube.png', name: 'youtube', domain: 'youtube.com', url: 'https://www.youtube.com/results?search_query=' }
        ],
        searchBoxSelector: {
            'www.google.com': 'textarea[name="q"], input[name="q"]',
            'www.google.com.hk': 'textarea[name="q"], input[name="q"]',
            'www.bing.com': 'textarea[name="q"], input[name="q"]',
            'www.bilibili.com': 'input.nav-search-input',
            'search.bilibili.com': 'input.search-input-el',
            'www.youtube.com': 'input[name="search_query"]'
        },

        root: null,
        panelBtn: null,

        init() {
            if (!search_tool.searchBoxSelector[window.location.hostname]) 
                return;
            
            this.createUI();
        },
        
        createUI() {
            const root = document.createElement('div');
            root.className = 'search-toolbar-ext-root';
            root.classList.add('collapsed');
            this.root = root;

            const platformsContainer = document.createElement('div');
            platformsContainer.className = 'search-toolbar-engines';
            this.platformsInfo.forEach(platform => {
                const btn = document.createElement('button');
                btn.className = 'search-toolbar-engine';
                btn.innerHTML = `<img src="${chrome.runtime.getURL(platform.icon)}" class="engine-icon ${platform.name}"><span>${platform.name}</span>`;
                btn.addEventListener('click', () => this.searchOnEngine(platform), { passive: true });
                platformsContainer.appendChild(btn);
            });

            const panelBtn = document.createElement('button');
            panelBtn.className = 'search-toolbar-collapse-button';
            panelBtn.classList.add('collapsed');
            panelBtn.innerHTML = '▲';
            panelBtn.addEventListener('click', ()=>this.togglePanel(), { passive: true });
            this.panelBtn = panelBtn;

            root.appendChild(panelBtn);
            root.appendChild(platformsContainer);
            document.documentElement.appendChild(root);
        },

        searchOnEngine(platform) {
            try{
                const selector = this.searchBoxSelector[window.location.hostname]
                const searchText = document.querySelector(selector).value.trim()
                if (!searchText || window.location.hostname.includes(platform.domain)) 
                    return;
                const url = platform.url + encodeURIComponent(searchText);
                window.open(url, '_blank', 'noopener,noreferrer');
                this.togglePanel()
            } catch (error) {
                console.error('执行搜索时发生错误:', error);
                return;
            }

        },

        togglePanel() {
            if (!this.panelBtn || !this.root) {
                console.log('root 或 panelBtn 未找到')
                return
            }
            this.root.classList.toggle('collapsed');
            this.panelBtn.classList.toggle('collapsed');
            this.panelBtn.innerHTML = this.panelBtn.classList.contains('collapsed') ? '▲' : '▼';
        },
    }
    
    search_tool.init();
    document.addEventListener('fullscreenchange', () => {
        if (!search_tool.root) return;
        search_tool.root.style.display = document.fullscreenElement ? 'none' : '';
    });
    
})();