import { getCsrfToken, getDatasetValue } from '../utils/formUtils.js';

function buildUrl(path = '') {
    if (!path) return '';
    const baseUrl = getDatasetValue('apiBase') || '';
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith('/') || !baseUrl) {
        return `${baseUrl}${path}`;
    }
    const separator = baseUrl.endsWith('/') ? '' : '/';
    return `${baseUrl}${separator}${path}`;
}

async function parseResponse(response, { rawResponse = false } = {}) {
    if (rawResponse) return response;
    const contentType = response.headers.get('Content-Type') || '';
    let data;

    if (contentType.includes('application/json')) {
        data = await response.json();
    } else if (contentType.includes('text/')) {
        data = await response.text();
    } else {
        data = await response.blob();
    }

    if (!response.ok) {
        const error = new Error('API isteği başarısız oldu.');
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

export async function request(path, { method = 'GET', body, headers = {}, rawResponse = false } = {}) {
    const url = buildUrl(path);
    if (!url) {
        console.warn('[api] Geçerli bir uç nokta belirtilmedi.');
        return null;
    }

    const config = {
        method: method.toUpperCase(),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            ...headers
        }
    };

    const csrfToken = getCsrfToken();
    const isFormData = body instanceof FormData;

    if (body && !isFormData) {
        config.headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify(body);
    } else if (isFormData) {
        config.body = body;
    }

    if (csrfToken && config.method !== 'GET' && !config.headers['X-CSRFToken']) {
        config.headers['X-CSRFToken'] = csrfToken;
    }

    try {
        const response = await fetch(url, config);
        return await parseResponse(response, { rawResponse });
    } catch (error) {
        console.error('[api] İstek sırasında hata oluştu:', error);
        throw error;
    }
}

export async function safeRequest(path, options) {
    try {
        return await request(path, options);
    } catch (error) {
        console.warn('[api] safeRequest yakalanan hata:', error);
        return null;
    }
}

export async function syncAuthState(action, payload = {}) {
    const endpoint = getDatasetValue('authSyncEndpoint');
    if (!endpoint) return null;

    return safeRequest(endpoint, {
        method: 'POST',
        body: {
            action,
            ...payload,
            authState: getDatasetValue('authState') || 'anonymous'
        }
    });
}

export function getInitialAuthState() {
    return getDatasetValue('authState') || 'anonymous';
}

export function getApiBaseUrl() {
    return getDatasetValue('apiBase') || '';
}
