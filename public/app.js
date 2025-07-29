// Configuración de la API
const API_BASE_URL = 'http://localhost:3001';

// Variables globales
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Elementos del DOM
const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const loading = document.getElementById('loading');
const notifications = document.getElementById('notifications');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    checkAuthStatus();
});

// Configurar event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
    
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', handleNavClick);
    });
    
    // Create hero form
    document.getElementById('createHeroForm').addEventListener('submit', handleCreateHero);
    
    // Adopt pet form
    document.getElementById('adoptPetForm').addEventListener('submit', handleAdoptPet);
}

// Verificar estado de autenticación
function checkAuthStatus() {
    if (authToken) {
        verifyToken();
    } else {
        showAuthSection();
    }
}

// Manejar login
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            showNotification('Login exitoso', 'success');
            showAppSection();
            loadHeroes();
            loadUserInfo();
        } else {
            showNotification(data.message || 'Error en el login', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    } finally {
        hideLoading();
    }
}

// Manejar registro
async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }
    
    // Validar longitud mínima de contraseña
    if (password.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Usuario registrado exitosamente. Ahora puedes iniciar sesión.', 'success');
            showLoginForm(); // Cambiar al formulario de login
            document.getElementById('registerFormElement').reset();
        } else {
            showNotification(data.message || 'Error en el registro', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    } finally {
        hideLoading();
    }
}

// Verificar token
async function verifyToken() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok && data.valid) {
            currentUser = data.user;
            showAppSection();
            loadHeroes();
            loadUserInfo();
        } else {
            logout();
        }
    } catch (error) {
        logout();
    }
}

// Cerrar sesión
function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    showAuthSection();
    showNotification('Sesión cerrada', 'warning');
}

// Mostrar sección de autenticación
function showAuthSection() {
    authSection.classList.remove('hidden');
    appSection.classList.add('hidden');
}

// Mostrar formulario de login
function showLoginForm() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
}

// Mostrar formulario de registro
function showRegisterForm() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

// Mostrar sección de la aplicación
function showAppSection() {
    authSection.classList.add('hidden');
    appSection.classList.remove('hidden');
}

// Manejar navegación
function handleNavClick(e) {
    const tab = e.target.closest('.nav-btn').dataset.tab;
    
    // Actualizar botones activos
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.closest('.nav-btn').classList.add('active');
    
    // Mostrar contenido correspondiente
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    if (tab === 'heroes') {
        document.getElementById('heroesTab').classList.add('active');
        loadHeroes();
    } else if (tab === 'pets') {
        document.getElementById('petsTab').classList.add('active');
        loadPets();
    } else if (tab === 'auth') {
        document.getElementById('authTab').classList.add('active');
        loadUserInfo();
    }
}

// Cargar héroes
async function loadHeroes() {
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/heroes`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const heroes = await response.json();
            displayHeroes(heroes);
        } else {
            showNotification('Error al cargar héroes', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    } finally {
        hideLoading();
    }
}

// Mostrar héroes
function displayHeroes(heroes) {
    const heroesGrid = document.getElementById('heroesGrid');
    
    if (heroes.length === 0) {
        heroesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>No hay héroes</h3>
                <p>Crea tu primer superhéroe para comenzar</p>
            </div>
        `;
        return;
    }
    
    heroesGrid.innerHTML = heroes.map(hero => `
        <div class="hero-card">
            <h3>${hero.name}</h3>
            <p class="alias">${hero.alias}</p>
            <p><strong>Ciudad:</strong> ${hero.city || 'No especificada'}</p>
            <p><strong>Equipo:</strong> ${hero.team || 'Sin equipo'}</p>
            ${hero.pet ? `
                <div class="mt-20">
                    <p><strong>Mascota:</strong> ${hero.pet.nombre} (${hero.pet.tipo})</p>
                    <button class="btn btn-info" onclick="showPetStatus(${hero.id})">
                        <i class="fas fa-heartbeat"></i> Ver Estado
                    </button>
                </div>
            ` : `
                <div class="mt-20">
                    <button class="btn btn-success" onclick="showAdoptPetModal(${hero.id})">
                        <i class="fas fa-paw"></i> Adoptar Mascota
                    </button>
                </div>
            `}
            <div class="mt-20">
                <button class="btn btn-danger" onclick="deleteHero(${hero.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Cargar mascotas
async function loadPets() {
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/heroes`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const heroes = await response.json();
            const heroesWithPets = heroes.filter(hero => hero.pet);
            displayPets(heroesWithPets);
        } else {
            showNotification('Error al cargar mascotas', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    } finally {
        hideLoading();
    }
}

// Mostrar mascotas
function displayPets(heroesWithPets) {
    const petsGrid = document.getElementById('petsGrid');
    
    if (heroesWithPets.length === 0) {
        petsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-paw"></i>
                <h3>No hay mascotas</h3>
                <p>Adopta una mascota para un héroe para comenzar</p>
            </div>
        `;
        return;
    }
    
    petsGrid.innerHTML = heroesWithPets.map(hero => `
        <div class="pet-card">
            <h3>${hero.pet.nombre}</h3>
            <p><strong>Héroe:</strong> ${hero.alias}</p>
            <p><strong>Tipo:</strong> ${hero.pet.tipo}</p>
            <p><strong>Edad:</strong> ${hero.pet.edad || 'No especificada'}</p>
            ${hero.pet.poderes && hero.pet.poderes.length > 0 ? 
                `<p><strong>Poderes:</strong> ${hero.pet.poderes.join(', ')}</p>` : ''
            }
            
            <div class="pet-status">
                <div class="status-bar">
                    <div class="status-label">
                        <span>Vida</span>
                        <span>${hero.pet.vida || 0}%</span>
                    </div>
                    <div class="status-progress">
                        <div class="status-fill status-life" style="width: ${hero.pet.vida || 0}%"></div>
                    </div>
                </div>
                
                <div class="status-bar">
                    <div class="status-label">
                        <span>Hambre</span>
                        <span>${hero.pet.hambre || 0}%</span>
                    </div>
                    <div class="status-progress">
                        <div class="status-fill status-hunger" style="width: ${hero.pet.hambre || 0}%"></div>
                    </div>
                </div>
                
                <div class="status-bar">
                    <div class="status-label">
                        <span>Felicidad</span>
                        <span>${hero.pet.felicidad || 0}%</span>
                    </div>
                    <div class="status-progress">
                        <div class="status-fill status-happiness" style="width: ${hero.pet.felicidad || 0}%"></div>
                    </div>
                </div>
                
                <div class="status-bar">
                    <div class="status-label">
                        <span>Higiene</span>
                        <span>${hero.pet.higiene || 0}%</span>
                    </div>
                    <div class="status-progress">
                        <div class="status-fill status-hygiene" style="width: ${hero.pet.higiene || 0}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="pet-actions">
                <button class="btn btn-success" onclick="feedPet(${hero.id})">
                    <i class="fas fa-utensils"></i> Alimentar
                </button>
                <button class="btn btn-info" onclick="playWithPet(${hero.id})">
                    <i class="fas fa-play"></i> Jugar
                </button>
                <button class="btn btn-warning" onclick="bathePet(${hero.id})">
                    <i class="fas fa-shower"></i> Bañar
                </button>
            </div>
        </div>
    `).join('');
}

// Cargar información del usuario
function loadUserInfo() {
    const userInfo = document.getElementById('userInfo');
    
    if (currentUser) {
        userInfo.innerHTML = `
            <h3>Información del Usuario</h3>
            <p><strong>ID:</strong> ${currentUser.id}</p>
            <p><strong>Usuario:</strong> ${currentUser.username}</p>
            <p><strong>Rol:</strong> <span class="user-role">${currentUser.role}</span></p>
            <p><strong>Token:</strong> <small>${authToken.substring(0, 20)}...</small></p>
        `;
    }
}

// Mostrar modal de crear héroe
function showCreateHeroModal() {
    document.getElementById('createHeroModal').classList.remove('hidden');
}

// Cerrar modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Manejar creación de héroe
async function handleCreateHero(e) {
    e.preventDefault();
    
    const heroData = {
        name: document.getElementById('heroName').value,
        alias: document.getElementById('heroAlias').value,
        city: document.getElementById('heroCity').value,
        team: document.getElementById('heroTeam').value
    };
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/heroes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(heroData)
        });
        
        if (response.ok) {
            showNotification('Héroe creado exitosamente', 'success');
            closeModal('createHeroModal');
            document.getElementById('createHeroForm').reset();
            loadHeroes();
        } else {
            const data = await response.json();
            showNotification(data.message || 'Error al crear héroe', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    } finally {
        hideLoading();
    }
}

// Mostrar modal de adoptar mascota
function showAdoptPetModal(heroId) {
    document.getElementById('adoptPetModal').classList.remove('hidden');
    document.getElementById('adoptPetForm').dataset.heroId = heroId;
}

// Manejar adopción de mascota
async function handleAdoptPet(e) {
    e.preventDefault();
    
    const heroId = e.target.dataset.heroId;
    const petData = {
        nombre: document.getElementById('petName').value,
        tipo: document.getElementById('petType').value,
        edad: parseInt(document.getElementById('petAge').value) || null,
        poderes: document.getElementById('petPowers').value.split(',').map(p => p.trim()).filter(p => p)
    };
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/heroes/${heroId}/adoptar-mascota`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(petData)
        });
        
        if (response.ok) {
            showNotification('Mascota adoptada exitosamente', 'success');
            closeModal('adoptPetModal');
            document.getElementById('adoptPetForm').reset();
            loadHeroes();
            loadPets();
        } else {
            const data = await response.json();
            showNotification(data.message || 'Error al adoptar mascota', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    } finally {
        hideLoading();
    }
}

// Alimentar mascota
async function feedPet(heroId) {
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/heroes/${heroId}/mascota/alimentar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            showNotification(data.message, 'success');
            loadPets();
        } else {
            const data = await response.json();
            showNotification(data.message || 'Error al alimentar mascota', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    } finally {
        hideLoading();
    }
}

// Jugar con mascota
async function playWithPet(heroId) {
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/heroes/${heroId}/mascota/jugar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            showNotification(data.message, 'success');
            loadPets();
        } else {
            const data = await response.json();
            showNotification(data.message || 'Error al jugar con mascota', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    } finally {
        hideLoading();
    }
}

// Bañar mascota
async function bathePet(heroId) {
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/heroes/${heroId}/mascota/banar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            showNotification(data.message, 'success');
            loadPets();
        } else {
            const data = await response.json();
            showNotification(data.message || 'Error al bañar mascota', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    } finally {
        hideLoading();
    }
}

// Eliminar héroe
async function deleteHero(heroId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este héroe?')) {
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/heroes/${heroId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            showNotification('Héroe eliminado exitosamente', 'success');
            loadHeroes();
            loadPets();
        } else {
            const data = await response.json();
            showNotification(data.message || 'Error al eliminar héroe', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    } finally {
        hideLoading();
    }
}

// Mostrar estado de mascota
async function showPetStatus(heroId) {
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/heroes/${heroId}/mascota/estado`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const petStatus = await response.json();
            showNotification(`Estado de ${petStatus.nombre}: Vida ${petStatus.vida}%, Hambre ${petStatus.hambre}%, Felicidad ${petStatus.felicidad}%, Higiene ${petStatus.higiene}%`, 'info');
        } else {
            const data = await response.json();
            showNotification(data.message || 'Error al obtener estado de mascota', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    } finally {
        hideLoading();
    }
}

// Mostrar loading
function showLoading() {
    loading.classList.remove('hidden');
}

// Ocultar loading
function hideLoading() {
    loading.classList.add('hidden');
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notifications.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Funciones globales para usar en HTML
window.logout = logout;
window.showCreateHeroModal = showCreateHeroModal;
window.closeModal = closeModal;
window.showAdoptPetModal = showAdoptPetModal;
window.feedPet = feedPet;
window.playWithPet = playWithPet;
window.bathePet = bathePet;
window.deleteHero = deleteHero;
window.showPetStatus = showPetStatus;
window.showLoginForm = showLoginForm;
window.showRegisterForm = showRegisterForm; 