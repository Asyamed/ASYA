// --- YENİLENMİŞ FIREBASE ENTEGRASYONU ---
import { initializeApp, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { firebaseConfig } from '../services/firebaseConfig.js';
import { runValidations, focusFirstError, clearValidationMessages } from '../utils/formUtils.js';
import { syncAuthState } from '../services/api.js';

// Global değişkenler
let auth;
let db;
let googleUserToCompleteProfile = null;
let selectedRole = '';

// DOM Elementleri
const authContainer = document.getElementById('auth-container');
const allViews = {
    login: document.getElementById('login-view'),
    register: document.getElementById('register-view'),
    registerForm: document.getElementById('register-form-view'),
    resetPassword: document.getElementById('reset-password-view')
};
const dynamicForm = document.getElementById('dynamic-form');
const registerTitle = document.getElementById('register-title');
const registerSubtitle = document.getElementById('register-subtitle');
const messageModal = document.getElementById('message-modal-overlay');
const errorContainers = ['login-error', 'register-error', 'reset-error'];

// Ana başlangıç fonksiyonu
function main() {
    // --------------------------------------------------------------------------
    // BİLGİLERİN GÜNCELLENDİ
    // --------------------------------------------------------------------------
    // Firebase servislerini başlat
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    setLogLevel('debug');

    // Oturum dinleyicisini kur
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("Doğrulanmış kullanıcı oturumu aktif:", user.uid);
            const userDocRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userDocRef);
            if(docSnap.exists()){
                window.location.href = '/app';
            } else {
                console.log("Kullanıcı doğrulandı ama profil verisi eksik. Rol seçimi bekleniyor.");
                googleUserToCompleteProfile = user;
                switchView(allViews.register);
            }
        } else {
            console.log("Kullanıcı oturumu kapalı.");
        }
    });

    // Tüm olay dinleyicilerini kur
    setupEventListeners();
    init3DBackground();
}

// 3D Arka Plan Animasyonu
function init3DBackground() {
    const container = document.getElementById('scene-container');
    let scene, camera, renderer, points, points2;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x050810, 1);
    container.appendChild(renderer.domElement);

    const particles = window.innerWidth < 768 ? 500 : 800;
    const areaWidth = window.innerWidth * 1.5, areaHeight = window.innerHeight * 1.5;

    const vertices = [];
    for (let i = 0; i < particles; i++) vertices.push((Math.random() * areaWidth) - areaWidth / 2, (Math.random() * areaHeight) - areaHeight / 2, (Math.random() - 0.5) * 600);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    points = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x38E5C6, size: 1.5, transparent: true, opacity: 0.7 }));
    scene.add(points);

    const vertices2 = [];
    for (let i = 0; i < particles / 2; i++) vertices2.push((Math.random() * areaWidth) - areaWidth / 2, (Math.random() * areaHeight) - areaHeight / 2, (Math.random() - 0.5) * 600);
    const geometry2 = new THREE.BufferGeometry();
    geometry2.setAttribute('position', new THREE.Float32BufferAttribute(vertices2, 3));
    points2 = new THREE.Points(geometry2, new THREE.PointsMaterial({ color: 0x8A2BE2, size: 1.2, transparent: true, opacity: 0.6 }));
    scene.add(points2);

    let mouseX = 0, mouseY = 0;
    const onMouseMove = (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.1;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.1;
    };

    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);

    const animate = () => {
        requestAnimationFrame(animate);
        camera.position.x += (mouseX - camera.position.x) * 0.03;
        camera.position.y += (-mouseY - camera.position.y) * 0.03;
        camera.lookAt(scene.position);
        if(points) points.rotation.y += 0.0003; 
        if(points2) points2.rotation.y -= 0.0004;
        renderer.render(scene, camera);
    };
    animate();
}

// UI Fonksiyonları
function switchView(activeView) {
    authContainer.classList.toggle('max-w-3xl', activeView === allViews.register);
    authContainer.classList.toggle('max-w-md', activeView !== allViews.register);
    Object.values(allViews).forEach(view => view.classList.remove('active'));
    activeView.classList.add('active');
    activeView.querySelectorAll('.fade-in').forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animation = null;
    });
    clearValidationMessages(errorContainers);
}

function showCustomMessage(title, message) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    messageModal.classList.add('active');
}

function showErrorMessage(elementId, message) {
    const el = document.getElementById(elementId);
    el.textContent = message;
    el.style.display = 'block';
}

function setLoading(isLoading) {
    document.getElementById('loading-modal-overlay').classList.toggle('active', isLoading);
}


// Olay dinleyicilerini kuran fonksiyon
function setupEventListeners() {
    // View Değiştirme Linkleri
    document.getElementById('show-register').addEventListener('click', (e) => { e.preventDefault(); googleUserToCompleteProfile = null; switchView(allViews.register); });
    document.getElementById('show-login').addEventListener('click', (e) => { e.preventDefault(); switchView(allViews.login); });
    document.getElementById('back-to-roles').addEventListener('click', (e) => { e.preventDefault(); switchView(allViews.register); });
    document.getElementById('forgot-password').addEventListener('click', (e) => { e.preventDefault(); switchView(allViews.resetPassword); });
    document.getElementById('show-login-from-reset').addEventListener('click', (e) => { e.preventDefault(); switchView(allViews.login); });
    document.getElementById('modal-close-btn').addEventListener('click', () => messageModal.classList.remove('active'));

    // Rol Seçimi
    document.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', () => {
            selectedRole = card.dataset.role;
            let formHTML = '';
            if (!googleUserToCompleteProfile) {
                formHTML += `
                    <input type="email" id="register-email" name="email" placeholder="E-posta Adresi" class="form-input w-full p-3 rounded-lg text-white" required>
                    <input type="password" id="register-password" name="password" placeholder="Şifre (en az 6 karakter)" class="form-input w-full p-3 rounded-lg text-white" required>`;
            }
            if (selectedRole === 'doctor') {
                registerTitle.textContent = "Doktor Bilgileri";
                registerSubtitle.textContent = "Lütfen bilgilerinizi girerek devam edin.";
                formHTML += `
                    <input type="text" id="register-hospital" name="hospital" placeholder="Çalıştığınız Hastane" class="form-input w-full p-3 rounded-lg text-white" required>
                    <select id="register-department" name="department" class="form-input w-full p-3 rounded-lg text-white appearance-none" required>
                        <option value="" disabled selected>Bölümünüzü Seçin</option>
                        <option value="kardiyoloji">Kardiyoloji</option><option value="onkoloji">Onkoloji</option><option value="nöroloji">Nöroloji</option><option value="dahiliye">Dahiliye</option><option value="pediatri">Pediatri</option><option value="genel cerrahi">Genel Cerrahi</option><option value="diğer">Diğer</option>
                    </select>`;
            } else {
                registerTitle.textContent = "Öğrenci Bilgileri";
                registerSubtitle.textContent = "Lütfen bilgilerinizi girerek devam edin.";
                formHTML += `
                    <input type="text" id="register-city" name="city" placeholder="Yaşadığınız İl" class="form-input w-full p-3 rounded-lg text-white" required>
                    <input type="text" id="register-university" name="university" placeholder="Öğrenim Gördüğünüz Üniversite" class="form-input w-full p-3 rounded-lg text-white" required>`;
            }
            dynamicForm.innerHTML = formHTML;
            switchView(allViews.registerForm);
        });
    });

    // Form Gönderimleri
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('google-signin-btn').addEventListener('click', handleGoogleSignIn);
    document.getElementById('reset-password-form').addEventListener('submit', handlePasswordReset);
}

// Form İşleyici Fonksiyonlar
async function handleLogin(e) {
    e.preventDefault();
    clearValidationMessages(['login-error']);
    const { isValid, errors } = runValidations([
        {
            field: 'login-email',
            label: 'E-posta',
            rules: ['required', 'email']
        },
        {
            field: 'login-password',
            label: 'Şifre',
            rules: ['required']
        }
    ]);

    if (!isValid) {
        const [firstError] = errors;
        showErrorMessage('login-error', firstError.message);
        focusFirstError(errors);
        return;
    }

    setLoading(true);
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        await syncAuthState('login', { provider: 'password' });
        // Başarılı girişten sonra `onAuthStateChanged` yönlendirmeyi yapacak.
    } catch (error) {
        console.error("Giriş hatası:", error);
        showErrorMessage('login-error', 'E-posta veya şifre hatalı. Lütfen kontrol edin.');
    } finally {
        setLoading(false);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    clearValidationMessages(['register-error']);

    const validationConfig = [];

    if (!selectedRole) {
        showErrorMessage('register-error', 'Lütfen bir rol seçin ve formu yeniden gönderin.');
        return;
    }

    if (!googleUserToCompleteProfile) {
        validationConfig.push(
            {
                field: 'register-email',
                label: 'E-posta',
                rules: ['required', 'email']
            },
            {
                field: 'register-password',
                label: 'Şifre',
                rules: ['required', { type: 'minLength', value: 6, message: 'Şifre en az 6 karakter olmalıdır.' }]
            }
        );
    }

    if (selectedRole === 'doctor') {
        validationConfig.push(
            { field: 'register-hospital', label: 'Hastane', rules: ['required'] },
            { field: 'register-department', label: 'Bölüm', rules: ['required'] }
        );
    } else {
        validationConfig.push(
            { field: 'register-city', label: 'Şehir', rules: ['required'] },
            { field: 'register-university', label: 'Üniversite', rules: ['required'] }
        );
    }

    const { isValid, errors } = runValidations(validationConfig);
    if (!isValid) {
        const [firstError] = errors;
        showErrorMessage('register-error', firstError.message);
        focusFirstError(errors);
        return;
    }

    setLoading(true);

    try {
        let user;
        // Durum 1: Google ile giriş yapıldı, profil tamamlanıyor.
        if (googleUserToCompleteProfile) {
            user = googleUserToCompleteProfile;
            const userData = {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                role: selectedRole,
                createdAt: new Date().toISOString()
            };
            if (selectedRole === 'doctor') {
                userData.hospital = document.getElementById('register-hospital').value;
                userData.department = document.getElementById('register-department').value;
            } else {
                userData.city = document.getElementById('register-city').value;
                userData.university = document.getElementById('register-university').value;
            }
            await setDoc(doc(db, "users", user.uid), userData);
            await syncAuthState('register', { provider: 'google', role: selectedRole });
            googleUserToCompleteProfile = null;
            // Profil tamamlandığı için onAuthStateChanged tetiklenip yönlendirme yapacak.
            window.location.href = '/app';

        // Durum 2: E-posta ile sıfırdan kayıt.
        } else {
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            user = userCredential.user;

            const userData = {
                email: user.email,
                role: selectedRole,
                createdAt: new Date().toISOString()
            };
            if (selectedRole === 'doctor') {
                userData.hospital = document.getElementById('register-hospital').value;
                userData.department = document.getElementById('register-department').value;
            } else {
                userData.city = document.getElementById('register-city').value;
                userData.university = document.getElementById('register-university').value;
            }
            await setDoc(doc(db, "users", user.uid), userData);
            await sendEmailVerification(user);
            await syncAuthState('register', { provider: 'password', role: selectedRole });
            showCustomMessage("Kayıt Başarılı!", "Hesabınızı aktif etmek için lütfen e-posta adresinize gönderilen doğrulama linkine tıklayın.");
            switchView(allViews.login);
        }
    } catch (error) {
        console.error("Kayıt hatası:", error);
        let message = `Bir hata oluştu: (${error.code})`;
        if (error.code === 'auth/email-already-in-use') message = "Bu e-posta adresi zaten kullanılıyor.";
        if (error.code === 'auth/weak-password') message = "Şifre çok zayıf. En az 6 karakter olmalı.";
        showErrorMessage('register-error', message);
    } finally {
        setLoading(false);
    }
}

async function handleGoogleSignIn() {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        await syncAuthState('login', { provider: 'google' });
        // Başarılı girişten sonra `onAuthStateChanged` süreci devralacak.
        // Eğer kullanıcı yeni ise, rol seçimine yönlendirecek.
    } catch (error) {
        console.error("Google ile giriş hatası:", error);
        showErrorMessage('login-error', 'Google ile giriş yapılırken bir hata oluştu.');
    } finally {
        setLoading(false);
    }
}

async function handlePasswordReset(e) {
    e.preventDefault();
    clearValidationMessages(['reset-error']);

    const { isValid, errors } = runValidations([
        {
            field: 'reset-email',
            label: 'E-posta',
            rules: ['required', 'email']
        }
    ]);

    if (!isValid) {
        const [firstError] = errors;
        showErrorMessage('reset-error', firstError.message);
        focusFirstError(errors);
        return;
    }

    setLoading(true);
    const email = document.getElementById('reset-email').value;

    try {
        await sendPasswordResetEmail(auth, email);
        showCustomMessage("E-posta Gönderildi", "Eğer bu e-posta adresi kayıtlıysa, şifre sıfırlama linkini gönderdik.");
        await syncAuthState('password-reset', { provider: 'password' });
        switchView(allViews.login);
    } catch (error) {
        console.error("Şifre sıfırlama hatası:", error);
        showErrorMessage('reset-error', "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
        setLoading(false);
    }
}

// Uygulamayı başlat
document.addEventListener('DOMContentLoaded', main);
