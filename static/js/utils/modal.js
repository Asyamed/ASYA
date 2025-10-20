export const setupModal = (buttonId, overlayId, closeButtonId) => {
    const button = buttonId ? document.getElementById(buttonId) : null;
    const buttonFooter = buttonId ? document.getElementById(`${buttonId}-footer`) : null;
    const overlay = document.getElementById(overlayId);
    const closeButton = document.getElementById(closeButtonId);

    const openModal = (event) => {
        if (event) event.preventDefault();
        overlay?.classList.add('active');
    };

    const closeModal = () => overlay?.classList.remove('active');

    button?.addEventListener('click', openModal);
    buttonFooter?.addEventListener('click', openModal);
    closeButton?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', (event) => {
        if (event.target === overlay) closeModal();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeModal();
    });
};
