export const scrollToTopOnLoad = () => {
    window.addEventListener('load', () => window.scrollTo(0, 0));
};

export const queryOptionalElement = (id) => document.getElementById(id);
