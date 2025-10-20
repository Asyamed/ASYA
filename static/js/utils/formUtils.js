const FORM_VALIDATORS = {
    required: (value) => {
        if (value === undefined || value === null) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        return Boolean(value);
    },
    email: (value) => {
        if (!value) return true;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(String(value).trim());
    },
    minLength: (value, min = 0) => {
        if (value === undefined || value === null) return false;
        return String(value).trim().length >= Number(min);
    },
    pattern: (value, pattern) => {
        if (!pattern) return true;
        const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern);
        return regex.test(String(value));
    }
};

const DEFAULT_MESSAGES = {
    required: (label) => `${label} alanı zorunludur.`,
    email: (label) => `${label} için geçerli bir e-posta adresi girin.`,
    minLength: (label, rule) => `${label} en az ${rule.value ?? rule.min} karakter olmalıdır.`,
    pattern: (label) => `${label} formatı geçersiz.`,
    default: () => 'Form doğrulaması başarısız oldu.'
};

function resolveValue(rawValue, element) {
    if (typeof rawValue === 'function') return rawValue(element);
    if (rawValue !== undefined) return rawValue;
    if (!element) return '';
    if (element.type === 'checkbox') return element.checked;
    if (element.type === 'radio') {
        const form = element.form ?? document;
        const checked = form.querySelector(`input[name="${element.name}"]:checked`);
        return checked ? checked.value : '';
    }
    return element.value;
}

function formatMessage(rule, label) {
    if (typeof rule === 'object' && rule.message) return rule.message;
    const ruleType = typeof rule === 'string' ? rule : rule.type;
    const formatter = DEFAULT_MESSAGES[ruleType] || DEFAULT_MESSAGES.default;
    return formatter(label, rule);
}

export function runValidations(configs = []) {
    const errors = [];

    configs.forEach((config) => {
        const { field, element: providedElement, rules = [], label = field, value } = config;
        const element = providedElement || (field ? document.getElementById(field) : null);
        const resolvedValue = resolveValue(value, element);

        for (const rule of rules) {
            let ruleType = rule;
            let ruleValue;
            let isValid = true;

            if (typeof rule === 'function') {
                const result = rule(resolvedValue, config);
                if (result !== true) {
                    errors.push({
                        field,
                        element,
                        message: typeof result === 'string' ? result : DEFAULT_MESSAGES.default()
                    });
                    break;
                }
                continue;
            }

            if (typeof rule === 'object') {
                ruleType = rule.type;
                ruleValue = rule.value ?? rule.min ?? rule.pattern;
            }

            const validator = FORM_VALIDATORS[ruleType];
            if (validator) {
                isValid = validator(resolvedValue, ruleValue);
            }

            if (!isValid) {
                errors.push({
                    field,
                    element,
                    message: formatMessage(rule, label)
                });
                break;
            }
        }
    });

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function focusFirstError(errors = []) {
    if (!errors.length) return;
    const target = errors[0].element || (errors[0].field ? document.getElementById(errors[0].field) : null);
    if (target && typeof target.focus === 'function') {
        target.focus();
    }
}

export function getFormValues(form, { trim = true } = {}) {
    const formData = new FormData(form);
    const values = {};

    for (const [key, val] of formData.entries()) {
        values[key] = trim && typeof val === 'string' ? val.trim() : val;
    }

    return values;
}

export function resetForm(form) {
    if (form && typeof form.reset === 'function') {
        form.reset();
    }
}

export function clearValidationMessages(targets = []) {
    targets.forEach((target) => {
        const el = typeof target === 'string' ? document.getElementById(target) : target;
        if (el) {
            el.textContent = '';
            el.style.display = 'none';
        }
    });
}

export function getDatasetValue(key) {
    if (!document || !document.body) return '';
    return document.body.dataset?.[key] ?? '';
}

export function getCsrfToken() {
    return (
        getDatasetValue('csrfToken') ||
        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
        ''
    );
}

export function getFormMetadata(form) {
    if (!form) return {};
    const { endpoint = '', method = 'POST' } = form.dataset;
    return {
        endpoint,
        method: method.toUpperCase(),
        csrf: getCsrfToken()
    };
}
