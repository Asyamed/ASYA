const studyAssistantModule = {
    id: 'study-assistant', 
    name: 'AI Ders Asistanı', 
    roles: ['student'], 
    hasChatHistory: true, 
    icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>`, 
    render: () => `
    <div class="ai-chat-container">
        <div class="ai-chat-messages" id="ai-chat-messages">
            <div class="ai-message bot">
                <div class="avatar">
                    <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                </div>
                <div class="content">
                    ASYA AI Ders Asistanı'na hoş geldin! Tıp eğitiminde sana yardımcı olmak için buradayım. Bir konuyu özetleyebilir, örnek sorular hazırlayabilir, hatta klinik bir vaka oluşturabilirim. Nasıl başlayalım?
                </div>
            </div>
        </div>
        <div class="ai-chat-input-area">
            <div class="ai-quick-prompts" id="ai-quick-prompts">
                 <button class="ai-quick-prompt-btn" data-prompt="Bana solunum fizyolojisi hakkında 5 adet çoktan seçmeli soru hazırla.">Soru Hazırla</button>
                 <button class="ai-quick-prompt-btn" data-prompt="Akut miyokard enfarktüsü konusunu ana başlıklar halinde özetle.">Konu Özetle</button>
                 <button class="ai-quick-prompt-btn" data-prompt="Pnömoni şüphesiyle gelen 65 yaşında bir erkek hasta için bir klinik vaka senaryosu oluştur.">Vaka Oluştur</button>
                 <button class="ai-quick-prompt-btn" data-prompt="Çiz: Kalbin anatomik yapısını basitleştirilmiş bir şema ile göster.">Görsel Çiz</button>
            </div>
            <div class="ai-chat-input-wrapper" id="ai-chat-input-wrapper">
                <div id="image-preview-container" class="hidden">
                    <div class="image-preview-item">
                        <img id="image-preview" src="" alt="Yüklenecek görsel">
                        <button id="remove-image-btn" title="Görseli Kaldır">&times;</button>
                    </div>
                </div>
                <div class="ai-chat-input-inner">
                    <button class="ai-chat-tool-btn" id="ai-attach-file-btn" title="Görsel veya Belge Yükle">
                       <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                    </button>
                    <button class="ai-chat-tool-btn" id="ai-image-mode-btn" title="Görsel Üretim Modu">
                       <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12.5a2.5 2.5 0 002.5-2.5V5a2 2 0 00-2-2H17"></path></svg>
                    </button>
                    <input type="file" id="ai-file-input" class="hidden" accept="image/*,.pdf,.txt,.md">
                    <div id="ai-chat-textarea" contenteditable="true" data-placeholder="Mesajını yaz veya bir dosya yükle..." class="ai-chat-textarea"></div>
                    <button class="ai-chat-tool-btn ai-chat-send-btn" id="ai-chat-send-btn">
                       <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    </div>` 
};

export default studyAssistantModule;
