// Almacenamiento de datos con soporte para LocalStorage
let appData = {
    water: 0,
    waterGoal: 2.5,
    sleepHours: 0, // Almacenar un solo valor por día
    steps: 0,
    stepsGoal: 10000,
    exerciseTime: 0,
    caloriesBurned: 0,
    totalCalories: 0,
    caloriesGoal: 2000,
    meals: [],
    currentDate: new Date().toISOString().split('T')[0]
};

// Funciones de LocalStorage con soporte para usuarios
function saveToLocalStorage() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const userKey = 'healthData_' + currentUser;
    const dataByDate = JSON.parse(localStorage.getItem(userKey)) || {};
    dataByDate[appData.currentDate] = {
        water: appData.water,
        sleepHours: appData.sleepHours || 0,
        exerciseTime: appData.exerciseTime,
        caloriesBurned: appData.caloriesBurned,
        totalCalories: appData.totalCalories,
        meals: appData.meals,
        steps: appData.steps
    };
    localStorage.setItem(userKey, JSON.stringify(dataByDate));
}

function loadFromLocalStorage(date = null) {
    const targetDate = date || appData.currentDate;
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        // Reiniciar datos si no hay usuario
        resetAppData();
        appData.currentDate = targetDate;
        return;
    }
    
    const userKey = 'healthData_' + currentUser;
    const dataByDate = JSON.parse(localStorage.getItem(userKey)) || {};
    
    if (dataByDate[targetDate]) {
        const savedData = dataByDate[targetDate];
        appData.water = savedData.water || 0;
        appData.sleepHours = savedData.sleepHours || 0;
        appData.exerciseTime = savedData.exerciseTime || 0;
        appData.caloriesBurned = savedData.caloriesBurned || 0;
        appData.totalCalories = savedData.totalCalories || 0;
        appData.meals = savedData.meals || [];
        appData.steps = savedData.steps || 0;
    } else {
        // Reiniciar datos para el nuevo día
        resetAppData();
    }
    appData.currentDate = targetDate;
}

function loadUserData() {
    loadFromLocalStorage();
}

function resetAppData() {
    appData.water = 0;
    appData.sleepHours = 0;
    appData.exerciseTime = 0;
    appData.caloriesBurned = 0;
    appData.totalCalories = 0;
    appData.meals = [];
    appData.steps = 0;
}

// Funcionalidad de autenticación
function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showNotification('❌ Por favor, completa todos los campos');
        return;
    }
    
    // Verificar si es administrador (credenciales especiales)
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('currentUser', 'admin');
        localStorage.setItem('isAdmin', 'true');
        
        // Mostrar panel de admin y ocultar dashboard normal
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('dashboard').classList.remove('active');
        
        loadAdminStats();
        showNotification('✅ Bienvenido, Administrador');
        return;
    }
    
    // Obtener usuarios de localStorage
    const users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (users[username] && users[username].password === password) {
        // Inicio de sesión exitoso
        localStorage.setItem('currentUser', username);
        localStorage.removeItem('isAdmin');
        
        // Mostrar dashboard normal y ocultar panel de admin
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboard').classList.add('active');
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('adminPanel').style.display = 'none';
        
        document.getElementById('userName').textContent = users[username].displayName || username;
        document.getElementById('userAvatar').textContent = (users[username].displayName || username).charAt(0).toUpperCase();
        
        loadUserData();
        updateDashboard();
        showNotification('✅ ¡Bienvenido, ' + (users[username].displayName || username) + '!');
    } else {
        showNotification('❌ Usuario o contraseña incorrectos');
        // Limpiar campo de contraseña
        document.getElementById('password').value = '';
    }
}

function logout() {
    // Limpiar usuario actual
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    
    // Ocultar todos los paneles
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'none';
    
    // Limpiar campos
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    showNotification('👋 Sesión cerrada correctamente');
}

// Funcionalidad de registro
function showRegisterModal() {
    document.getElementById('registerModal').classList.add('active');
}

function register() {
    const displayName = document.getElementById('regDisplayName').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const passwordConfirm = document.getElementById('regPasswordConfirm').value;
    
    // Validación
    if (!displayName || !username || !email || !password || !passwordConfirm) {
        showNotification('❌ Por favor, completa todos los campos');
        return;
    }
    
    if (username.length < 3) {
        showNotification('❌ El nombre de usuario debe tener al menos 3 caracteres');
        return;
    }
    
    if (password.length < 6) {
        showNotification('❌ La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    if (password !== passwordConfirm) {
        showNotification('❌ Las contraseñas no coinciden');
        return;
    }
    
    // Validación de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('❌ Ingresa un correo electrónico válido');
        return;
    }
    
    // Verificar si el usuario ya existe
    const users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (users[username]) {
        showNotification('❌ El nombre de usuario ya existe');
        return;
    }
    
    // Verificar si el correo ya existe
    const existingEmail = Object.values(users).find(user => user.email === email);
    if (existingEmail) {
        showNotification('❌ El correo electrónico ya está registrado');
        return;
    }
    
    // Crear nuevo usuario
    users[username] = {
        displayName: displayName,
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
        lastLogin: null
    };
    
    // Guardar usuarios
    localStorage.setItem('users', JSON.stringify(users));
    
    // Limpiar formulario
    document.getElementById('regDisplayName').value = '';
    document.getElementById('regUsername').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regPasswordConfirm').value = '';
    
    // Cerrar modal
    closeModal('registerModal');
    
    // Completar automáticamente el formulario de inicio de sesión
    document.getElementById('username').value = username;
    
    showNotification('✅ ¡Cuenta creada exitosamente! Ahora puedes iniciar sesión');
}

// Actualizar dashboard
function updateDashboard() {
    // Pasos
    document.getElementById('steps').textContent = appData.steps.toLocaleString();
    document.getElementById('stepsProgress').style.width = (appData.steps / appData.stepsGoal * 100) + '%';
    
    // Agua
    document.getElementById('waterAmount').textContent = appData.water.toFixed(1);
    document.getElementById('waterProgress').style.width = (appData.water / appData.waterGoal * 100) + '%';
    
    // Gráfico de sueño
    renderSleepChart();
    
    // Ejercicio
    document.getElementById('exerciseTime').textContent = appData.exerciseTime + ' min hoy';
    
    // Calorías
    document.getElementById('caloriesCount').textContent = appData.totalCalories.toLocaleString() + ' kcal';
    
    renderMeals();
}

// Gráfico de sueño - Muestra los últimos 7 días correctamente
function renderSleepChart() {
    const chart = document.getElementById('sleepChart');
    if (!chart) return;
    
    // Limpiar gráfico
    chart.innerHTML = '';
    
    // Obtener datos de localStorage para el usuario actual
    const currentUser = localStorage.getItem('currentUser');
    const userKey = currentUser ? 'healthData_' + currentUser : 'healthData';
    const dataByDate = JSON.parse(localStorage.getItem(userKey)) || {};
    const currentDate = new Date(appData.currentDate);
    
    // Crear 7 barras para los últimos 7 días
    for (let i = 0; i < 7; i++) {
        // Calcular fecha para esta barra (6 días atrás hasta hoy)
        const barDate = new Date(currentDate);
        barDate.setDate(currentDate.getDate() - (6 - i));
        const dateString = barDate.toISOString().split('T')[0];
        
        // Obtener el día real de la semana para esta fecha
        const dayOfWeek = barDate.getDay(); // 0=Domingo, 1=Lunes, etc.
        const dayNames = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
        const dayLabel = dayNames[dayOfWeek];
        
        // Get sleep data for this date
        const dayData = dataByDate[dateString];
        const hours = dayData ? (dayData.sleepHours || 0) : 0;
        
        // Create bar container
        const barContainer = document.createElement('div');
        barContainer.className = 'sleep-bar';
        
        // Create bar
        const bar = document.createElement('div');
        bar.className = 'bar';
        
        // Set height (minimum 8px for visibility)  
        const height = hours > 0 ? Math.max(8, (hours / 10) * 160) : 8;
        bar.style.height = height + 'px';
        
        // Set color based on hours
        if (hours === 0) {
            bar.style.background = '#374151';
            bar.style.opacity = '0.5';
        } else if (hours < 6) {
            bar.style.background = '#ef4444';
        } else if (hours <= 8) {
            bar.style.background = '#8b5cf6';
        } else {
            bar.style.background = '#10b981';
        }
        
        // Highlight current day
        if (dateString === appData.currentDate) {
            bar.style.boxShadow = '0 0 0 2px #22d3ee';
            bar.style.transform = 'scale(1.05)';
        }
        
        bar.title = `${barDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}: ${hours > 0 ? hours + ' horas' : 'Sin datos'}`;
        
        // Create label
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = dayLabel;
        
        // Highlight current day label
        if (dateString === appData.currentDate) {
            label.style.color = '#22d3ee';
            label.style.fontWeight = 'bold';
        }
        
        // Assemble
        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        chart.appendChild(barContainer);
    }
    
    console.log('📊 Sleep chart rendered for date:', appData.currentDate);
    console.log('📊 Current day sleep hours:', appData.sleepHours);
}

// Mostrar comidas
function renderMeals() {
    const mealList = document.getElementById('mealList');
    mealList.innerHTML = '';
    
    if (appData.meals.length === 0) {
        mealList.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">No hay comidas registradas</div>';
        return;
    }
    
    appData.meals.forEach((meal, index) => {
        const mealItem = document.createElement('div');
        mealItem.className = 'meal-item';
        mealItem.innerHTML = `
            <div class="meal-info">
                <div class="meal-name">${meal.name}</div>
                <div class="meal-calories">${meal.calories} kcal</div>
            </div>
            <button class="delete-meal-btn" onclick="deleteMeal(${index})">Eliminar</button>
        `;
        mealList.appendChild(mealItem);
    });
}

// Funciones de modal
function openWaterModal() {
    document.getElementById('waterModal').classList.add('active');
    document.getElementById('modalWaterAmount').textContent = appData.water.toFixed(1) + ' L';
}

function openSleepModal() {
    // Calculate average from last 7 days
    const currentUser = localStorage.getItem('currentUser');
    const userKey = currentUser ? 'healthData_' + currentUser : 'healthData';
    const dataByDate = JSON.parse(localStorage.getItem(userKey)) || {};
    const currentDate = new Date(appData.currentDate);
    let totalHours = 0;
    let daysWithData = 0;
    
    for (let i = 0; i < 7; i++) {
        const checkDate = new Date(currentDate);
        checkDate.setDate(currentDate.getDate() - i);
        const dateString = checkDate.toISOString().split('T')[0];
        const dayData = dataByDate[dateString];
        
        if (dayData && dayData.sleepHours > 0) {
            totalHours += dayData.sleepHours;
            daysWithData++;
        }
    }
    
    const avg = daysWithData > 0 ? (totalHours / daysWithData).toFixed(1) : '0';
    document.getElementById('avgSleep').textContent = avg + ' hrs';
    document.getElementById('lastSleep').textContent = (appData.sleepHours || 0) + ' hrs';
    document.getElementById('sleepModal').classList.add('active');
}

function openExerciseModal() {
    document.getElementById('totalExerciseTime').textContent = appData.exerciseTime + ' min';
    document.getElementById('caloriesBurned').textContent = appData.caloriesBurned + ' kcal';
    document.getElementById('exerciseModal').classList.add('active');
}

function openFoodModal() {
    document.getElementById('totalCalories').textContent = appData.totalCalories.toLocaleString() + ' kcal';
    document.getElementById('caloriesProgress').style.width = (appData.totalCalories / appData.caloriesGoal * 100) + '%';
    renderMeals();
    document.getElementById('foodModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Agregar agua
function addWater() {
    const amount = parseFloat(document.getElementById('waterInput').value);
    if (amount && amount > 0) {
        appData.water += amount;
        if (appData.water > appData.waterGoal) {
            appData.water = appData.waterGoal;
        }
        saveToLocalStorage();
        updateDashboard();
        document.getElementById('waterInput').value = '0.25';
        document.getElementById('modalWaterAmount').textContent = appData.water.toFixed(1) + ' L';
        
        showNotification('💧 Agua agregada correctamente');
    }
}

// Agregar sueño
function addSleep() {
    const hours = parseFloat(document.getElementById('sleepInput').value);
    
    if (hours && hours > 0 && hours <= 24) {
        console.log('💤 Agregando sueño:', hours, 'para fecha:', appData.currentDate);
        
        // Establecer horas de sueño solo para el día actual
        appData.sleepHours = hours;
        
        // Guardar y actualizar
        saveToLocalStorage();
        
        // Forzar actualización del gráfico
        setTimeout(() => {
            renderSleepChart();
        }, 50);
        
        updateDashboard();
        
        closeModal('sleepModal');
        
        const today = new Date(appData.currentDate);
        const dayName = today.toLocaleDateString('es-ES', { weekday: 'long' });
        showNotification(`🌙 Sueño registrado: ${hours} horas para ${dayName}`);
    }
}

// Agregar ejercicio
function addExercise() {
    const type = document.getElementById('exerciseType').value;
    const minutes = parseInt(document.getElementById('exerciseMinutes').value);
    
    if (type && minutes && minutes > 0) {
        appData.exerciseTime += minutes;
        const caloriesPerMin = {
            'cardio': 10,
            'pesas': 6,
            'yoga': 3,
            'correr': 12,
            'nadar': 11,
            'ciclismo': 9
        };
        const burned = minutes * (caloriesPerMin[type] || 5);
        appData.caloriesBurned += burned;
        
        saveToLocalStorage();
        updateDashboard();
        document.getElementById('exerciseType').value = '';
        document.getElementById('exerciseMinutes').value = '30';
        closeModal('exerciseModal');
        showNotification('💪 Ejercicio registrado: ' + burned + ' kcal quemadas');
    }
}

// Add food
function addFood() {
    const name = document.getElementById('foodName').value;
    const calories = parseInt(document.getElementById('foodCalories').value);
    
    if (name && calories && calories > 0) {
        appData.meals.push({ name, calories });
        appData.totalCalories += calories;
        
        saveToLocalStorage();
        updateDashboard();
        renderMeals();
        document.getElementById('foodName').value = '';
        document.getElementById('foodCalories').value = '300';
        document.getElementById('totalCalories').textContent = appData.totalCalories.toLocaleString() + ' kcal';
        document.getElementById('caloriesProgress').style.width = (appData.totalCalories / appData.caloriesGoal * 100) + '%';
        
        showNotification('🍽️ Comida agregada correctamente');
    }
}

// Delete meal
function deleteMeal(index) {
    appData.totalCalories -= appData.meals[index].calories;
    appData.meals.splice(index, 1);
    saveToLocalStorage();
    updateDashboard();
    renderMeals();
    document.getElementById('totalCalories').textContent = appData.totalCalories.toLocaleString() + ' kcal';
    document.getElementById('caloriesProgress').style.width = (appData.totalCalories / appData.caloriesGoal * 100) + '%';
    showNotification('🗑️ Comida eliminada');
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #22d3ee, #14b8a6);
        color: #1a1a1a;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Close modal on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Enter key for login
document.getElementById('password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        login();
    }
});

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Date navigation functions
function changeDate(direction) {
    const currentDate = new Date(appData.currentDate);
    currentDate.setDate(currentDate.getDate() + direction);
    const newDate = currentDate.toISOString().split('T')[0];
    loadFromLocalStorage(newDate);
    updateDateDisplay();
    updateDashboard();
    renderSleepChart(); // Ensure chart updates
}

function selectDate() {
    const selectedDate = document.getElementById('dateSelector').value;
    if (selectedDate) {
        loadFromLocalStorage(selectedDate);
        updateDateDisplay();
        updateDashboard();
        renderSleepChart(); // Ensure chart updates
    }
}

function openDatePicker() {
    const dateInput = document.getElementById('dateSelector');
    dateInput.showPicker();
}

function updateDateDisplay() {
    const dateSelector = document.getElementById('dateSelector');
    const dateDisplay = document.getElementById('dateDisplay');
    const today = new Date().toISOString().split('T')[0];
    
    dateSelector.value = appData.currentDate;
    
    if (appData.currentDate === today) {
        dateDisplay.textContent = 'Hoy';
    } else {
        const date = new Date(appData.currentDate);
        dateDisplay.textContent = date.toLocaleDateString('es-ES', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short' 
        });
    }
}

// Weekly statistics
function showWeeklyStats() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const userKey = 'healthData_' + currentUser;
    const dataByDate = JSON.parse(localStorage.getItem(userKey)) || {};
    const dates = Object.keys(dataByDate).sort().slice(-7); // Last 7 days
    
    let totalWater = 0, totalExercise = 0, totalCalories = 0, avgSleep = 0;
    let validDays = 0;
    
    dates.forEach(date => {
        const data = dataByDate[date];
        if (data) {
            totalWater += data.water || 0;
            totalExercise += data.exerciseTime || 0;
            totalCalories += data.totalCalories || 0;
            if (data.sleep && data.sleep.length > 0) {
                avgSleep += data.sleep[data.sleep.length - 1] || 0;
            }
            validDays++;
        }
    });
    
    if (validDays > 0) {
        avgSleep = avgSleep / validDays;
    }
    
    const statsContent = document.getElementById('weeklyStatsContent');
    statsContent.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">💧</div>
                <div class="stat-info">
                    <div class="stat-label">Agua Total</div>
                    <div class="stat-value">${totalWater.toFixed(1)} L</div>
                    <div class="stat-avg">Promedio: ${(totalWater / 7).toFixed(1)} L/día</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">💪</div>
                <div class="stat-info">
                    <div class="stat-label">Ejercicio Total</div>
                    <div class="stat-value">${totalExercise} min</div>
                    <div class="stat-avg">Promedio: ${Math.round(totalExercise / 7)} min/día</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🍽️</div>
                <div class="stat-info">
                    <div class="stat-label">Calorías Totales</div>
                    <div class="stat-value">${totalCalories.toLocaleString()} kcal</div>
                    <div class="stat-avg">Promedio: ${Math.round(totalCalories / 7)} kcal/día</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🌙</div>
                <div class="stat-info">
                    <div class="stat-label">Sueño Promedio</div>
                    <div class="stat-value">${avgSleep.toFixed(1)} hrs</div>
                    <div class="stat-avg">Últimos ${validDays} días</div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('statsModal').classList.add('active');
}

// Reset functionality
function showResetModal() {
    document.getElementById('resetModal').classList.add('active');
}

function confirmReset() {
    localStorage.removeItem('healthData');
    appData.water = 0;
    appData.exerciseTime = 0;
    appData.caloriesBurned = 0;
    appData.totalCalories = 0;
    appData.meals = [];
    appData.steps = 0;
    appData.sleep = [0, 0, 0, 0, 0, 0, 0];
    
    updateDashboard();
    closeModal('resetModal');
    showNotification('🔄 Todos los datos han sido reiniciados');
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario ya está conectado
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        // Verificar si es administrador
        if (currentUser === 'admin' && localStorage.getItem('isAdmin') === 'true') {
            // Mostrar panel de administrador
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'block';
            document.getElementById('dashboard').style.display = 'none';
            document.getElementById('dashboard').classList.remove('active');
            loadAdminStats();
        } else {
            // Inicio de sesión automático para usuarios normales
            const users = JSON.parse(localStorage.getItem('users')) || {};
            if (users[currentUser]) {
                // Mostrar dashboard normal
                document.getElementById('loginScreen').style.display = 'none';
                document.getElementById('dashboard').classList.add('active');
                document.getElementById('dashboard').style.display = 'block';
                document.getElementById('adminPanel').style.display = 'none';
                
                document.getElementById('userName').textContent = users[currentUser].displayName || currentUser;
                document.getElementById('userAvatar').textContent = (users[currentUser].displayName || currentUser).charAt(0).toUpperCase();
                
                // Actualizar último inicio de sesión
                users[currentUser].lastLogin = new Date().toISOString();
                localStorage.setItem('users', JSON.stringify(users));
            }
        }
    }
    
    loadFromLocalStorage();
    updateDateDisplay();
    updateDashboard();
    renderSleepChart();
});

// Funciones de administrador
function loadAdminStats() {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const totalUsers = Object.keys(users).length;
    
    // Calcular usuarios activos (con login en los últimos 7 días)
    const now = new Date();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const activeUsers = Object.values(users).filter(user => {
        if (!user.lastLogin) return false;
        const lastLogin = new Date(user.lastLogin);
        return lastLogin > sevenDaysAgo;
    }).length;
    
    // Calcular tamaño de datos
    const allData = JSON.stringify(localStorage);
    const dataSize = Math.round(new Blob([allData]).size / 1024);
    
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('activeUsers').textContent = activeUsers;
    document.getElementById('dataSize').textContent = dataSize;
}

function showUsersList() {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const usersTable = document.getElementById('usersTable');
    
    if (Object.keys(users).length === 0) {
        usersTable.innerHTML = '<p style="text-align: center; color: #999;">No hay usuarios registrados</p>';
        return;
    }
    
    usersTable.innerHTML = '';
    Object.entries(users).forEach(([username, userData]) => {
        const lastLogin = userData.lastLogin ? 
            new Date(userData.lastLogin).toLocaleDateString('es-ES') : 
            'Nunca';
        
        const userRow = document.createElement('div');
        userRow.className = 'user-row';
        userRow.innerHTML = `
            <div class="user-info">
                <div style="font-weight: 600;">${userData.displayName || username}</div>
                <div style="font-size: 12px; color: #999;">@${username}</div>
            </div>
            <div style="font-size: 12px; color: #999;">
                Último acceso: ${lastLogin}
            </div>
        `;
        usersTable.appendChild(userRow);
    });
}

function showDeleteUsersModal() {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const userSelect = document.getElementById('userToDelete');
    
    userSelect.innerHTML = '<option value="">Seleccionar usuario...</option>';
    Object.entries(users).forEach(([username, userData]) => {
        const option = document.createElement('option');
        option.value = username;
        option.textContent = `${userData.displayName || username} (@${username})`;
        userSelect.appendChild(option);
    });
    
    document.getElementById('deleteUserModal').style.display = 'flex';
}

function confirmDeleteUser() {
    const username = document.getElementById('userToDelete').value;
    if (!username) {
        showNotification('❌ Selecciona un usuario para eliminar');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || {};
    delete users[username];
    localStorage.setItem('users', JSON.stringify(users));
    
    // Eliminar datos del usuario
    localStorage.removeItem('healthData_' + username);
    
    closeModal('deleteUserModal');
    loadAdminStats();
    showUsersList();
    showNotification('🗑️ Usuario eliminado correctamente');
}

function showResetSystemModal() {
    document.getElementById('resetSystemModal').style.display = 'flex';
    document.getElementById('confirmationText').value = '';
}

function confirmResetSystem() {
    const confirmation = document.getElementById('confirmationText').value;
    if (confirmation !== 'CONFIRMAR') {
        showNotification('❌ Debes escribir "CONFIRMAR" para continuar');
        return;
    }
    
    // Eliminar todos los datos excepto el admin
    localStorage.clear();
    
    closeModal('resetSystemModal');
    showNotification('⚠️ Sistema reiniciado completamente');
    
    // Redirigir al login
    setTimeout(() => {
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'flex';
    }, 2000);
}

function exportData() {
    const allData = {
        users: JSON.parse(localStorage.getItem('users')) || {},
        healthData: {}
    };
    
    // Recopilar todos los datos de salud
    const users = allData.users;
    Object.keys(users).forEach(username => {
        const userHealthData = localStorage.getItem('healthData_' + username);
        if (userHealthData) {
            allData.healthData[username] = JSON.parse(userHealthData);
        }
    });
    
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `dashboard_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('📤 Datos exportados correctamente');
}

function clearOldData() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30); // Datos más antiguos de 30 días
    
    const users = JSON.parse(localStorage.getItem('users')) || {};
    let deletedEntries = 0;
    
    Object.keys(users).forEach(username => {
        const userKey = 'healthData_' + username;
        const userData = JSON.parse(localStorage.getItem(userKey)) || {};
        
        Object.keys(userData).forEach(date => {
            if (new Date(date) < cutoffDate) {
                delete userData[date];
                deletedEntries++;
            }
        });
        
        localStorage.setItem(userKey, JSON.stringify(userData));
    });
    
    loadAdminStats();
    showNotification(`🧹 Se eliminaron ${deletedEntries} registros antiguos`);
}

function generateReport() {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const totalUsers = Object.keys(users).length;
    
    // Generar estadísticas básicas
    const now = new Date();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const activeUsers = Object.values(users).filter(user => {
        if (!user.lastLogin) return false;
        return new Date(user.lastLogin) > sevenDaysAgo;
    }).length;
    
    const report = `
REPORTE DEL SISTEMA - Dashboard de Salud
Fecha: ${now.toLocaleDateString('es-ES')}
========================================

ESTADÍSTICAS GENERALES:
- Usuarios registrados: ${totalUsers}
- Usuarios activos (7 días): ${activeUsers}
- Tasa de actividad: ${totalUsers > 0 ? Math.round((activeUsers/totalUsers)*100) : 0}%

DETALLES DE USUARIOS:
${Object.entries(users).map(([username, userData]) => `
- ${userData.displayName || username} (@${username})
  Email: ${userData.email}
  Registro: ${new Date(userData.createdAt).toLocaleDateString('es-ES')}
  Último acceso: ${userData.lastLogin ? new Date(userData.lastLogin).toLocaleDateString('es-ES') : 'Nunca'}
`).join('')}

Reporte generado automáticamente por el Panel de Administrador
    `;
    
    const reportBlob = new Blob([report], {type: 'text/plain'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(reportBlob);
    link.download = `reporte_sistema_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    
    showNotification('📄 Reporte generado correctamente');
}