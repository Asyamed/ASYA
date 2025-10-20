import { scrollToTopOnLoad } from '../utils/dom.js';
import { setupModal } from '../utils/modal.js';

scrollToTopOnLoad();

// --- 3D Arka Plan Animasyonu ---
const container = document.getElementById('scene-container');
let THREERef;
let scene, camera, renderer, points, points2;

function init() {
    THREERef = window.THREE;

    if (!THREERef) {
        console.warn('Three.js yüklenemedi; arka plan animasyonu devre dışı bırakıldı.');
        return;
    }

    scene = new THREERef.Scene();
    camera = new THREERef.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;

    renderer = new THREERef.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x050810, 1);
    container.appendChild(renderer.domElement);

    const particles = window.innerWidth < 768 ? 500 : 800;
    const areaWidth = window.innerWidth * 1.5;
    const areaHeight = window.innerHeight * 1.5;

    const vertices = [];
    for (let i = 0; i < particles; i++) {
        vertices.push((Math.random() * areaWidth) - areaWidth / 2, (Math.random() * areaHeight) - areaHeight / 2, (Math.random() - 0.5) * 600);
    }
    const geometry = new THREERef.BufferGeometry();
    geometry.setAttribute('position', new THREERef.Float32BufferAttribute(vertices, 3));
    points = new THREERef.Points(geometry, new THREERef.PointsMaterial({ color: 0x38E5C6, size: 1.5, transparent: true, opacity: 0.7 }));
    scene.add(points);

    const vertices2 = [];
    for (let i = 0; i < particles / 2; i++) {
        vertices2.push((Math.random() * areaWidth) - areaWidth / 2, (Math.random() * areaHeight) - areaHeight / 2, (Math.random() - 0.5) * 600);
    }
    const geometry2 = new THREERef.BufferGeometry();
    geometry2.setAttribute('position', new THREERef.Float32BufferAttribute(vertices2, 3));
    points2 = new THREERef.Points(geometry2, new THREERef.PointsMaterial({ color: 0x8A2BE2, size: 1.2, transparent: true, opacity: 0.6 })); // BlueViolet color
    scene.add(points2);

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

let mouseX = 0, mouseY = 0;
function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.1;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.1;
}

function animate() {
    requestAnimationFrame(animate);
    camera.position.x += (mouseX - camera.position.x) * 0.03;
    camera.position.y += (-mouseY - camera.position.y) * 0.03;
    camera.lookAt(scene.position);
    if (points) { points.rotation.y += 0.0003; } 
    if (points2) { points2.rotation.y -= 0.0004; }
    renderer.render(scene, camera);
}

const startScene = () => {
    if (!container) return;
    init();
    if (scene && camera && renderer) {
        animate();
    }
};

if (container) {
    if (window.THREE) {
        startScene();
    } else {
        window.addEventListener('load', startScene, { once: true });
    }
}

setupModal('about-btn', 'about-modal-overlay', 'close-about-modal');
setupModal('contact-btn', 'contact-modal-overlay', 'close-contact-modal');
setupModal(null, 'form-success-modal-overlay', 'close-success-modal');

// --- İnteraktif Demo Scripti ---
const DEMO_DATA = {
    lung: { 
        type: 'analyzer', 
        title: 'Akciğer Analizi', 
        labels:['Tümör','Pnömoni','Zatürre'], 
        sample: [78, 12, 5], 
        note: 'Örnek göğüs grafisi analizi.', 
        imageUrl: 'https://placehold.co/300x200/0B1120/38E5C6?text=Akci%C4%9Fer+BT',
        infoTitle: 'Akciğer Görüntüleme Analizi',
        infoText: 'ASYA, Akciğer BT ve röntgen görüntülerinde Zatürre, Tümör ve Pnömoni gibi kritik bulguların tespitine yardımcı olur. Platforma üye olarak kendi anonimleştirilmiş verilerinizi yükleyebilir ve saniyeler içinde ön analiz sonuçları alabilirsiniz.'
    },
    heart: { 
        type: 'analyzer', 
        title: 'Kalp Analizi', 
        labels:['BT Anjiyo Riski','EKO Anomali','Diğer'], 
        sample: [18, 9, 3], 
        note: 'Ön-risk skorları.', 
        imageUrl: 'https://placehold.co/300x200/0B1120/38E5C6?text=Kalp+Anjiyo',
        infoTitle: 'Kardiyak Görüntüleme Desteği',
        infoText: 'BT Anjiyo ve Ekokardiyografi (EKO) testlerinizde olası risk ve anomalileri belirlemek için ASYA\'nın gücünden faydalanın. Bu demo, sistemin potansiyel bulguları nasıl skorladığını göstermektedir. Gerçek analizler için platforma katılın.'
    },
    brain: { 
        type: 'analyzer', 
        title: 'Beyin Analizi', 
        labels:['Pıhtı','Tümör','Diğer'], 
        sample: [21, 6, 2], 
        note: 'MR/CT tabanlı demo.', 
        imageUrl: 'https://placehold.co/300x200/0B1120/38E5C6?text=Beyin+MR',
        infoTitle: 'Nörolojik Görüntüleme Asistanı',
        infoText: 'Beyin MR ve BT taramalarında Pıhtı ve Tümör gibi lezyonların tespiti için geliştirilmiş yapay zeka modellerimizi deneyimleyin. Ayrıca, üye olarak MS ve ALS gibi hastalıklar için EEG ve EMG verilerini analiz edebilirsiniz.'
     },
    llm: { 
        type: 'chat', 
        title: 'Tıbbi LLM Sohbeti',
        infoTitle: 'Uzmanınıza Danışın: Tıbbi LLM',
        infoText: 'ASYA, tıp literatürüyle eğitilmiş özel bir dil modeli sunar. Karmaşık vakalar hakkında sorular sorun, güncel tedavi kılavuzlarını öğrenin veya bir makalenin özetini isteyin. Tüm cevaplar kaynakçalıdır ve bu bir demo sohbet akışıdır.'
    },
    student: { 
        type: 'study', 
        title: 'Öğrenci Asistanı',
        infoTitle: 'Akıllı Ders Çalışma Partneriniz',
        infoText: 'Ders notlarınızı, PDF\'lerinizi veya kitaplarınızı ASYA\'ya yükleyin. Yapay zeka sizin için metni özetlesin, anahtar kavramları çıkarsın ve hatta örnek sınav soruları hazırlasın. Bu demo, bir PDF\'den nasıl özet çıkarıldığını göstermektedir.'
    }
};

const demoOutlet = document.getElementById('demo-outlet');
const demoTabsContainer = document.getElementById('demo-tabs');

const renderAnalyzerDemo = (key) => {
    const data = DEMO_DATA[key];
    let barsHtml = '';
    data.labels.forEach((label, i) => {
        barsHtml += `
            <div>
                <div class="flex justify-between text-xs mb-1">
                    <span class="text-gray-300">${label}</span>
                    <span class="font-semibold text-white" id="p${i}">--%</span>
                </div>
                <div class="progress-bar"><div id="m${i}"></div></div>
            </div>
        `;
    });

    return `
        <div class="fade-in-content space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div class="md:col-span-2 rounded-lg bg-black/20 p-2 hidden md:block">
                     <img src="${data.imageUrl}" alt="${data.title}" class="rounded w-full h-auto object-cover">
                </div>
                <div class="md:col-span-3">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-bold text-white">${data.title}</h4>
                            <p class="text-xs text-gray-400">${data.note}</p>
                        </div>
                        <div class="flex flex-col items-center flex-shrink-0 ml-2">
                            <div class="confidence-gauge" id="gauge" style="--p:0">
                                <div><span id="gaugeLabel" class="text-xl font-bold text-white">--%</span></div>
                            </div>
                            <span class="text-xs text-gray-400 mt-1">Güven Skoru</span>
                        </div>
                    </div>
                    <div class="space-y-2 mt-2" id="results-bars">
                        ${barsHtml}
                    </div>
                </div>
            </div>
            <button id="run-analysis-btn" class="main-button w-full bg-accent/20 text-accent-color font-bold py-2 px-6 rounded-lg text-sm border border-accent-color/30 hover:bg-accent-color hover:text-gray-900" onclick="runDemoAnalysis('${key}')">
                Örnek Analizi Çalıştır
            </button>
            <div id="demo-info-panel" class="opacity-0 transform translate-y-2 bg-black/20 p-3 rounded-lg text-center mt-2">
                <h5 class="font-bold text-sm text-white">${data.infoTitle}</h5>
                <p class="text-xs text-gray-400 mt-1">${data.infoText}</p>
            </div>
        </div>
    `;
};

const renderChatDemo = () => {
     const data = DEMO_DATA.llm;
     return `
        <div class="fade-in-content space-y-3 flex flex-col">
            <div class="flex-grow space-y-3 flex flex-col p-2 bg-black/20 rounded-lg min-h-[150px]" id="chat-area">
                <div class="chat-bubble user">35 yaş, ateş, öksürük. Pnömoni mi? Kılavuz ne diyor?</div>
                 <div id="llm-response" class="chat-bubble asya opacity-0 transform translate-y-2">Cevap hazırlanıyor...</div>
            </div>
            <input type="text" placeholder="ASYA'ya bir soru sorun..." class="form-input mt-auto text-sm" onfocus="runLlmResponse()">
            <div id="demo-info-panel" class="opacity-0 transform translate-y-2 bg-black/20 p-3 rounded-lg text-center mt-2">
                <h5 class="font-bold text-sm text-white">${data.infoTitle}</h5>
                <p class="text-xs text-gray-400 mt-1">${data.infoText}</p>
            </div>
        </div>
     `;
};

const renderStudyDemo = () => {
    const data = DEMO_DATA.student;
    return `
         <div class="fade-in-content space-y-3 flex flex-col">
            <div class="text-center p-4 rounded-lg bg-black/20">
                 <h4 class="font-bold text-white">Akıllı Ders Asistanı</h4>
                 <p class="text-xs text-gray-400 mt-1">PDF'nizi yükleyin, anında özet ve soru-cevap alın.</p>
            </div>
            <div id="summary-output" class="text-sm text-gray-300 p-3 bg-black/20 rounded-lg flex-grow min-h-[90px]">
                <span class="text-gray-500">Özet burada görünecek...</span>
            </div>
             <button id="run-summary-btn" class="main-button w-full bg-accent/20 text-accent-color font-bold py-2 px-6 rounded-lg text-sm border border-accent-color/30 hover:bg-accent-color hover:text-gray-900" onclick="runDemoSummary()">
                Örnek Özeti Oluştur
            </button>
            <div id="demo-info-panel" class="opacity-0 transform translate-y-2 bg-black/20 p-3 rounded-lg text-center mt-2">
                <h5 class="font-bold text-sm text-white">${data.infoTitle}</h5>
                <p class="text-xs text-gray-400 mt-1">${data.infoText}</p>
            </div>
         </div>
    `;
};

const showInfoPanel = () => {
    const infoPanel = document.getElementById('demo-info-panel');
    if (infoPanel) {
        setTimeout(() => {
            infoPanel.style.opacity = '1';
            infoPanel.style.transform = 'translateY(0)';
        }, 300);
    }
};

window.runDemoAnalysis = (key) => {
    const data = DEMO_DATA[key];
    const confidence = Math.floor(85 + Math.random() * 14);
    const gauge = document.getElementById('gauge');

    document.getElementById('run-analysis-btn').disabled = true;

     data.labels.forEach((_, i) => {
        const p = document.getElementById('p' + i);
        const m = document.getElementById('m' + i);
        if(p) p.textContent = '--%';
        if(m) m.style.width = '0%';
    });
    if(gauge) {
        gauge.style.setProperty('--p', 0);
        document.getElementById('gaugeLabel').textContent = '--%';
    }

    setTimeout(() => {
        if(gauge){
            gauge.style.setProperty('--p', confidence);
            document.getElementById('gaugeLabel').textContent = confidence + '%';
        }
        data.sample.forEach((val, i) => {
            setTimeout(() => {
                const p = document.getElementById('p' + i);
                const m = document.getElementById('m' + i);
                if(p) p.textContent = val + "%";
                if(m) m.style.width = val + '%';
            }, 200 * i);
        });
        showInfoPanel();
    }, 100);
};

window.runDemoSummary = () => {
    const output = document.getElementById('summary-output');
    document.getElementById('run-summary-btn').disabled = true;
    output.innerHTML = `<strong class="text-white">Solunum Fizyolojisi Özetleniyor...</strong>`;
    setTimeout(() => {
        output.innerHTML = `
            <strong class="text-white">Solunum Fizyolojisi Özet:</strong>
            <ul class="list-disc pl-5 mt-2 space-y-1">
                <li>Ventilasyon, gaz değişimi ve transport temel mekanizmalardır.</li>
                <li>Akciğer hacimleri spirometri ile ölçülür.</li>
                <li>Oksihemoglobin disosiasyon eğrisi doku oksijenasyonunu belirler.</li>
            </ul>`;
        showInfoPanel();
    }, 800);
};

let llmRan = false;
window.runLlmResponse = () => {
    if(llmRan) return;
    llmRan = true;
    const responseEl = document.getElementById('llm-response');
    setTimeout(() => {
        responseEl.innerHTML = `Anlıyorum. IDSA 2023 kılavuzuna göre, bu semptomlar toplum kökenli pnömoni ile uyumlu olabilir. Önerilen ilk basamak tedavi... (PubMed: 3681, 4120). <br><small class="opacity-60">Bu bir tıbbi tavsiye değildir.</small>`;
        responseEl.style.opacity = '1';
        responseEl.style.transform = 'translateY(0)';
        showInfoPanel();
    }, 800);
}


const renderDemoContent = (tabKey) => {
    const data = DEMO_DATA[tabKey];
    if (!data || !demoOutlet) return;
    llmRan = false;
    demoOutlet.innerHTML = '';

    let content = '';
    if (data.type === 'analyzer') {
        content = renderAnalyzerDemo(tabKey);
    } else if (data.type === 'chat') {
        content = renderChatDemo();
    } else if (data.type === 'study') {
        content = renderStudyDemo();
    }
    demoOutlet.innerHTML = content;
};

demoTabsContainer.addEventListener('click', (e) => {
    const tab = e.target.closest('.demo-tab');
    if (tab) {
        demoTabsContainer.querySelector('.active').classList.remove('active');
        tab.classList.add('active');
        renderDemoContent(tab.dataset.tab);
    }
});

// Initial render
renderDemoContent('lung');

// Kurum Formu
const kurumForm = document.getElementById('kurum-form');
if (kurumForm) {
    kurumForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const successModal = document.getElementById('form-success-modal-overlay');
        successModal.classList.add('active');
        kurumForm.reset();
    });
}
