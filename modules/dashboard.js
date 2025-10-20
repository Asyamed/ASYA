const dashboardModule = {
    name: 'Ana Sayfa', 
    icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z"/></svg>`,
    roles: ['doctor', 'student'],
    hasChatHistory: false,
    render: ({ userData }) => {
        const postPlaceholder = userData.role === 'doctor' ? 'Bir vaka, makale veya soru paylaşın...' : 'Bir soru sor, notlarını paylaş...';
        const feedItems = [
            { user: 'Dr. Barış Aydın', role: 'Anestezi Uzmanı', content: 'Yoğun bir nöbetin ardından servisin sessizliği... Bazen en iyi dinlenme, bu anlarda saklı. Herkese iyi dinlenmeler. #nobet #doktorhayatı', time: '15 dakika önce', likes: 12, comments: 3, image: 'assets/ornek.jpg' },
            { user: 'Dr. Elif Yılmaz', role: 'Kardiyolog', content: 'Nadir bir perikardiyal kist vakasıyla karşılaştım. Görüntüleri anonimleştirerek paylaşıyorum, ilginç bir tartışma olabilir.', time: '2 saat önce', likes: 47, comments: 9, image: null },
            { user: 'Ahmet Çelik', role: '4. Sınıf Öğrenci', content: 'Farmakoloji vizesi için hazırladığım özet notlarımı Kütüphane modülüne "public" olarak ekledim. Herkese başarılar!', time: '5 saat önce', likes: 125, comments: 16, image: null },
            { user: 'Fatih Develi', role: '1.Sınıf Öğrencisi', content: 'Fazladan fizyo notu olan yorum olarak paylaşabilir mi ben de kendi notlarımı yollayabilirim', time: '8 saat önce', likes: 13, comments: 3, image: 'assets/ornek2.jpg' },
            { user: 'Prof. Dr. Canan Aksoy', role: 'Nörolog', content: 'Yeni yayınlanan bir makale, Alzheimer teşhisinde kullanılan amiloid PET taramalarının etkinliğini sorguluyor. Okumanızı tavsiye ederim. #alzheimer #nöroloji', time: 'dün', likes: 82, comments: 21, image: null },
            { user: 'Büşra Öztürk', role: 'İntörn', content: 'Asistan hocaların kendini fazla öne çıkartması iyice bunaltmaya başladı tamam kanka en yetkili sensin #staj #tıp', time: '2 gün önce', likes: 150, comments: 34, image: null },
        ];
        const agendaItems = [ { time: '14:00', title: 'Hasta Kontrolü (A.Y.)' }, { time: '16:30', title: 'Departman Toplantısı' }, { time: '19:00', title: 'Makale Okuması: JAMA' }];
        const newsItems = [ { source: 'Medscape', title: 'Yapay Zeka, Meme Kanseri Taramasında Radyologlara Yardımcı Oluyor' }, { source: 'Tıbbın Sesi', title: 'Türkiye\'de geliştirilen yeni cerrahi robot, ilk ameliyatını başarıyla tamamladı.' }, { source: 'Nature', title: 'CRISPR-Cas9 teknolojisiyle genetik hastalıkların tedavisinde yeni bir eşik aşıldı.' } ];
        const channels = [
            { name: 'Kardiyoloji Gündemi', icon: '❤️', members: '1.2k üye' },
            { name: 'Nörobilim Keşifleri', icon: '🧠', members: '876 üye' },
            { name: 'Acil Tıp Vakaları', icon: '🚑', members: '2.4k üye' },
            { name: 'Pediatri Notları', icon: '🧾', members: '950 üye' }
        ];
        const chats = [
            { id: 'chat1', user: 'Dr. Elif Yılmaz', role: 'Kardiyolog', lastMessage: 'Harika, teşekkürler!', time: '5dk', unread: 2, online: true },
            { id: 'chat2', user: 'Prof. Dr. Canan Aksoy', role: 'Nörolog', lastMessage: 'Makaleyi inceledim, yarın konuşalım.', time: '1s', unread: 0, online: false },
            { id: 'chat3', user: 'Dr. Barış Aydın', role: 'Anestezi Uzmanı', lastMessage: 'Nöbet listesi güncellendi mi?', time: '2s', unread: 0, online: true },
            { id: 'chat4', user: 'Dr. Zeynep Kaya', role: 'Dahiliye Uzmanı', lastMessage: 'Konsültasyon için teşekkür ederim hocam.', time: 'dün', unread: 0, online: false }
        ];
        
        const userProfileImgSrc = document.getElementById('user-profile-img').src;

        return `
        <div id="dashboard-container" class="relative h-full">
            <div id="dashboard-grid" class="flex flex-col lg:flex-row gap-4 h-full">
                <div id="feed-column" class="lg:w-2/3 space-y-4 transition-all duration-500 ease-in-out overflow-y-auto pr-2">
                    <div class="glass soft p-4 card-hover">
                        <div class="flex items-start gap-3">
                            <img src="${userProfileImgSrc}" class="w-10 h-10 rounded-full mt-1"/>
                            <textarea class="w-full bg-transparent text-text-primary placeholder-text-secondary border-0 focus:ring-0 resize-none pt-2 text-base" rows="3" placeholder="${postPlaceholder}"></textarea>
                        </div>
                        <div class="flex justify-between items-center mt-2 pl-12">
                            <div>
                                <button class="flex items-center gap-2 text-sm text-text-secondary hover:text-accent px-3 py-1 rounded-lg hover:bg-white/5 transition-colors">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"></path></svg>
                                    <span>Görsel Ekle</span>
                                </button>
                            </div>
                            <button class="main-button font-bold py-2 px-6 text-sm">Paylaş</button>
                        </div>
                    </div>
                    <div class="space-y-4"> 
                        ${feedItems.map(item => `
                        <div class="glass soft p-4 card-hover feed-item"> 
                            <div class="flex items-center"> 
                                <img src="https://placehold.co/40x40/11192b/38E5C6?text=${item.user.charAt(0)}" class="w-10 h-10 rounded-full"/> 
                                <div class="ml-3"> 
                                    <p class="font-semibold text-white">${item.user}</p> 
                                    <p class="text-xs text-text-secondary">${item.role} • ${item.time}</p> 
                                </div> 
                            </div> 
                            <p class="mt-3 text-sm text-text-primary leading-relaxed">${item.content}</p> 
                            ${item.image ? `<div class="mt-3 rounded-lg overflow-hidden border border-border"><img src="${item.image}" class="w-full h-auto object-cover" onerror="this.style.display='none'"></div>` : ''}
                            <div class="mt-4 flex items-center gap-6 text-text-secondary text-sm">
                                <button class="flex items-center gap-2 hover:text-accent transition-colors duration-200 like-btn"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z"></path></svg> <span>${item.likes}</span></button>
                                <button class="flex items-center gap-2 hover:text-accent transition-colors duration-200 comment-btn"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg> <span>${item.comments}</span></button>
                            </div>
                        </div>`).join('')} 
                    </div>
                </div>
                <div id="side-column" class="lg:w-1/3 space-y-4 transition-all duration-500 ease-in-out overflow-y-auto pr-2">
                    <div class="glass soft p-4 card-hover"> 
                        <div class="flex justify-between items-center">
                            <h3 class="font-bold text-white">Bugünün Ajandası</h3>
                            <button id="edit-agenda-btn" class="p-1 text-text-secondary hover:text-white" title="Düzenle"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L13.196 5.196z"></path></svg></button>
                        </div>
                        <ul id="agenda-list" class="mt-3 space-y-3"> ${agendaItems.map(item => `<li class="flex items-center"> <div class="w-12 text-sm font-semibold text-accent">${item.time}</div> <div class="flex-1 pl-3 border-l-2 border-border text-sm">${item.title}</div> </li>`).join('')} </ul>
                    </div>
                    <div class="glass soft p-4 card-hover">
                        <div class="flex justify-between items-center">
                            <h3 class="font-bold text-white">Tıptan Haberler</h3>
                            <button id="toggle-news-size" class="p-1 text-text-secondary hover:text-white" title="Genişlet/Daralt"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4h4m12 4V4h-4M4 16v4h4m12-4v4h-4"></path></svg></button>
                        </div>
                        <ul class="mt-3 space-y-3"> ${newsItems.map(item => `<li> <p class="text-sm font-semibold leading-snug">${item.title}</p> <p class="text-xs text-text-secondary mt-1">${item.source}</p> </li>`).join('')} </ul> 
                    </div>
                    <div id="messenger-widget" class="glass soft overflow-hidden card-hover">
                        <div id="messenger-header" class="flex justify-between items-center p-3 cursor-pointer bg-white/5">
                            <h3 class="font-bold text-white text-sm">Mesajlar</h3>
                            <div class="flex items-center gap-3">
                                <button class="p-1 text-text-secondary hover:text-white" title="Yeni Mesaj"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>
                                <svg id="messenger-toggle-icon" class="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                            </div>
                        </div>
                        <div id="messenger-body" class="p-2 h-80 flex flex-col transition-all duration-300 ease-in-out">
                            <div class="flex-shrink-0 p-1 bg-background/50 rounded-lg flex items-center gap-1 mb-2">
                                <button data-tab="channels" class="messenger-tab-btn flex-1 text-xs py-1.5 rounded-md font-semibold">Kanallar</button>
                                <button data-tab="chats" class="messenger-tab-btn flex-1 text-xs py-1.5 rounded-md font-semibold active">Sohbetlerim</button>
                            </div>
                            <div class="flex-1 overflow-y-auto">
                                <div id="channels-content" class="messenger-tab-content p-1">
                                    ${channels.map(channel => `
                                    <div class="flex items-center p-2 rounded-lg chat-list-item cursor-pointer">
                                        <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg">${channel.icon}</div>
                                        <div class="ml-3 flex-1">
                                            <p class="font-semibold text-sm">${channel.name}</p>
                                            <p class="text-xs text-text-secondary">${channel.members}</p>
                                        </div>
                                    </div>`).join('')}
                                </div>
                                <div id="chats-content" class="messenger-tab-content active">
                                    ${chats.map(chat => `
                                    <div class="flex items-center p-2 rounded-lg chat-list-item cursor-pointer" data-chat-user='${JSON.stringify(chat)}'>
                                        <div class="relative">
                                            <img src="https://placehold.co/40x40/11192b/38E5C6?text=${chat.user.charAt(0)}" class="w-10 h-10 rounded-full"/>
                                            ${chat.online ? `<span class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white/10"></span>` : ''}
                                        </div>
                                        <div class="ml-3 flex-1">
                                            <div class="flex justify-between items-center">
                                                <p class="font-semibold text-sm">${chat.user}</p>
                                                <p class="text-xs text-text-secondary">${chat.time}</p>
                                            </div>
                                            <div class="flex justify-between items-center mt-1">
                                                <p class="text-xs text-text-secondary truncate pr-2">${chat.lastMessage}</p>
                                                ${chat.unread > 0 ? `<span class="bg-accent text-background text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">${chat.unread}</span>` : ''}
                                            </div>
                                        </div>
                                    </div>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }
};

export default dashboardModule;