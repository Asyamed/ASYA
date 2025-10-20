const libraryModule = {
    id: 'storage', 
    name: 'Kütüphanem', 
    roles: ['student'], 
    hasChatHistory: false, 
    icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>`,
    render: () => {
        // Kişisel Kütüphane HTML'ini oluşturan yardımcı fonksiyon
        const renderPersonalLibrary = () => {
            return '<div class="glass soft p-6 h-full flex items-center justify-center"><p class="text-center text-text-secondary">Kişisel kütüphane özelliği geliştirme aşamasındadır.</p></div>';
        }

        // Ana render fonksiyonunun dönüşü
        return `
        <div class="h-full flex flex-col">
            <div class="flex-shrink-0 p-2 glass soft mb-3">
                <div class="flex items-center justify-center gap-2 bg-background/40 p-1 rounded-lg">
                    <button class="gpa-planner-tab flex-1 text-center" data-library-tab-btn="personal">Kişisel Kütüphanem</button>
                    <button class="gpa-planner-tab flex-1 text-center" data-library-tab-btn="public">Public Notlar</button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto pr-2">
                <div id="personal-library-section" class="library-tab-content">
                    ${renderPersonalLibrary()}
                </div>
                <div id="public-library-section" class="library-tab-content">
                    <div class="glass soft p-6 h-full flex items-center justify-center">
                        <div class="text-center">
                            <svg class="w-16 h-16 text-accent mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <h3 class="text-xl font-bold text-white mb-2">Çok Yakında</h3>
                            <p class="text-text-secondary">Bu bölüm, diğer öğrencilerle notlarınızı paylaşabileceğiniz bir ortak alan olarak tasarlanmaktadır.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
};

export default libraryModule;