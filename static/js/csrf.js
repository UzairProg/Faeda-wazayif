/**
 * Faeda Jobs — Global CSRF Auto-Protection Script
 * Automatically secures all HTML forms, jQuery AJAX, and Fetch API calls with CSRF tokens.
 */
(function() {
    function getCsrfToken() {
        // 1. Check meta tag
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        if (metaTag && metaTag.getAttribute('content')) {
            return metaTag.getAttribute('content');
        }
        // 2. Check XSRF-TOKEN cookie
        const match = document.cookie.match(new RegExp('(^|;\\s*)XSRF-TOKEN=([^;]*)'));
        return match ? decodeURIComponent(match[2]) : null;
    }

    function injectCsrfInputs() {
        const token = getCsrfToken();
        if (!token) return;

        // Auto-inject into all POST/PUT/DELETE forms
        document.querySelectorAll('form').forEach(form => {
            const method = (form.getAttribute('method') || 'GET').toUpperCase();
            if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
                let input = form.querySelector('input[name="csrf_token"]');
                if (!input) {
                    input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = 'csrf_token';
                    input.value = token;
                    form.appendChild(input);
                } else if (!input.value) {
                    input.value = token;
                }
            }
        });
    }

    // Configure jQuery AJAX if present
    function setupJQueryAjax() {
        if (window.jQuery) {
            const token = getCsrfToken();
            if (token) {
                window.jQuery.ajaxSetup({
                    beforeSend: function(xhr, settings) {
                        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                            xhr.setRequestHeader('X-CSRF-TOKEN', token);
                            xhr.setRequestHeader('X-CSRFToken', token);
                        }
                    }
                });
            }
        }
    }

    // Intercept native fetch
    if (window.fetch) {
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            options = options || {};
            const method = (options.method || 'GET').toUpperCase();
            if (!['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method)) {
                const token = getCsrfToken();
                if (token) {
                    if (!options.headers) {
                        options.headers = {};
                    }
                    if (options.headers instanceof Headers) {
                        if (!options.headers.has('X-CSRFToken') && !options.headers.has('X-CSRF-TOKEN')) {
                            options.headers.set('X-CSRF-TOKEN', token);
                            options.headers.set('X-CSRFToken', token);
                        }
                    } else if (typeof options.headers === 'object' && !Array.isArray(options.headers)) {
                        if (!options.headers['X-CSRFToken'] && !options.headers['X-CSRF-TOKEN']) {
                            options.headers['X-CSRF-TOKEN'] = token;
                            options.headers['X-CSRFToken'] = token;
                        }
                    }
                }
            }
            return originalFetch(url, options);
        };
    }

    // Run on DOMContentLoaded and on dynamic forms
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectCsrfInputs();
            setupJQueryAjax();
        });
    } else {
        injectCsrfInputs();
        setupJQueryAjax();
    }

    // Also observe mutations in case modals or dynamic forms are added to DOM
    if (window.MutationObserver) {
        const observer = new MutationObserver(() => {
            injectCsrfInputs();
        });
        document.addEventListener('DOMContentLoaded', () => {
            if (document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
            }
        });
    }

    // Expose helper globally
    window.getCsrfToken = getCsrfToken;
})();
