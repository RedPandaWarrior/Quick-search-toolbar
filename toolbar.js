(function () {
    'use strict';

    const toolbar = {
        engineInfo: [
            { icon: '🔍', name: 'Google', domain: 'google.com', url: 'https://www.google.com/search?q=' },
            { icon: '🅱️', name: 'Bing', domain: 'bing.com', url: 'https://www.bing.com/search?q=' },
            { icon: '📺', name: 'Bilibili', domain: 'bilibili.com', url: 'https://search.bilibili.com/all?keyword=' },
            { icon: '▶️', name: 'YouTube', domain: 'youtube.com', url: 'https://www.youtube.com/results?search_query=' }
        ],
        inputEleSelector: {
            'www.google.com': 'textarea[name="q"], input[name="q"]',
            'www.google.com.hk': 'textarea[name="q"], input[name="q"]',
            'www.bing.com': 'textarea[name="q"], input[name="q"]',
            'www.bilibili.com': 'input.nav-search-input',
            'search.bilibili.com': 'input.search-input-el',
            'www.youtube.com': 'input[name="search_query"]'
        },

        rootElement: null,
        targetEngine: null,
        searchContent: '',
        inputEle: null,
        isPanelCollapsed: false,
        openBtn: null,

        searchOnEngine() {
            const engine = this.targetEngine;
            if (!engine || !this.searchContent || isCurrentEngine(engine.domain)) 
                return;

            this.isPanelCollapsed = true
            this.applyCollapseState(this.isPanelCollapsed);

            const url = engine.url + encodeURIComponent(this.searchContent);
            window.open(url, '_blank', 'noopener,noreferrer');
            
        },

        applyCollapseState(isCollapsed) {
            if (!this.rootElement || !this.openBtn)
                return;

            if (isCollapsed) {
                this.rootElement.classList.add('collapsed');
                this.openBtn.classList.add('collapsed');
                this.openBtn.innerHTML = '▲';
            } else {
                this.rootElement.classList.remove('collapsed');
                this.openBtn.classList.remove('collapsed');
                this.openBtn.innerHTML = '▼';
            }
        }
    };

    function init() {
        if (!toolbar.inputEleSelector[window.location.hostname]) 
            return;

        createUI();
        toolbar.isPanelCollapsed = true
        toolbar.applyCollapseState(toolbar.isPanelCollapsed);

        const input = getInputElement();
        if (!input) return;
        
        toolbar.inputEle = input;
        toolbar.searchContent = input.value.trim();
        input.addEventListener('input', debounce(updateSearchContent,150), {
            passive: true });  

    }

    function createUI() {
        const root = document.createElement('div');
        const enginesDiv = document.createElement('div');
        const openBtn = document.createElement('button')
        const fragment = document.createDocumentFragment();

        toolbar.rootElement = root;
        toolbar.openBtn = openBtn;

        root.className = 'search-toolbar-ext-root';
        enginesDiv.className = 'search-toolbar-engines';
        openBtn.className = 'search-toolbar-collapse-button';

        openBtn.innerHTML = '▼';
        openBtn.addEventListener('click', toggleToolbar, { passive: true });

        toolbar.engineInfo.forEach(engine => {
            const btn = document.createElement('button');
            btn.className = 'search-toolbar-engine';
            btn.textContent = `${engine.icon} ${engine.name}`;
            btn.addEventListener('click', () => {
                toolbar.targetEngine = engine;
                toolbar.searchOnEngine();
            }, { passive: true });
            fragment.appendChild(btn);
        });

        enginesDiv.appendChild(fragment);
        root.appendChild(openBtn);
        root.appendChild(enginesDiv);
        document.documentElement.appendChild(root);
        
    }

    function toggleToolbar() {
        toolbar.isPanelCollapsed = !toolbar.isPanelCollapsed;
        toolbar.applyCollapseState(toolbar.isPanelCollapsed);
    }

    function getInputElement() {
        const selector = toolbar.inputEleSelector[window.location.hostname];
        return document.querySelector(selector);
    }

    function isCurrentEngine(domain) {
        return window.location.hostname.includes(domain);
    }

    function updateSearchContent (){
        toolbar.searchContent = toolbar.inputEle.value.trim();
    }

    function debounce (fn, delay) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    init();
})();
