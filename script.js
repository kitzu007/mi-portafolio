// ==========================================
// BASE DE DATOS DE PROYECTOS (Simulada)
// ==========================================
// Aquí guardamos la información de cada proyecto.
// Puedes editar los textos, links e imágenes fácilmente.
const projectsData = [
    // --- VIDEOJUEGOS (Game Dev) ---
    {
        category: "gamedev",
        title: "Space War 2D",
        description: "Juego de naves espaciales hecho en Unity. Usa sistema de partículas y físicas.",
        tags: ["Unity", "C#", "VFX"],
        image: "https://placehold.co/600x400/111/00ff9d?text=Space+War", // Cambia esto por tu imagen
        link: "#"
    },
    {
        category: "gamedev",
        title: "Medieval RPG",
        description: "Juego de rol pixel art con inventario y misiones.",
        tags: ["Unreal", "C++", "Blueprints"],
        image: "https://placehold.co/600x400/222/00ff9d?text=RPG+Game",
        link: "#"
    },

    // --- FULL STACK (Web) ---
    {
        category: "fullstack",
        title: "Tienda Online Pro",
        description: "E-commerce completo con carrito de compras y panel de admin.",
        tags: ["React", "Node.js", "Stripe"],
        image: "https://placehold.co/600x400/111/00f3ff?text=E-Commerce",
        link: "#"
    },
    {
        category: "fullstack",
        title: "Chat en Tiempo Real",
        description: "Aplicación de mensajería instantánea tipo WhatsApp Web.",
        tags: ["Socket.io", "Express", "JS"],
        image: "https://placehold.co/600x400/222/00f3ff?text=Chat+App",
        link: "#"
    },

    // --- DATOS (Database Specialist) ---
    {
        category: "database",
        title: "Dashboard de Ventas",
        description: "Análisis de big data visualizado con gráficos dinámicos.",
        tags: ["SQL", "Python", "PowerBI"],
        image: "https://placehold.co/600x400/111/ff5500?text=Data+Dashboard",
        link: "#"
    },
    {
        category: "database",
        title: "Optimizador de Consultas",
        description: "Script para mejorar la velocidad de bases de datos masivas.",
        tags: ["PostgreSQL", "MongoDB", "Performance"],
        image: "https://placehold.co/600x400/222/ff5500?text=DB+Optimizer",
        link: "#"
    }
];

// ==========================================
// REFERENCIAS A ELEMENTOS DE LA PANTALLA
// ==========================================
const splitLanding = document.getElementById('split-landing'); // Pantalla principal
const contentOverlay = document.getElementById('content-overlay'); // Pantalla de detalles (oculta)
const dynamicContent = document.getElementById('dynamic-content'); // Donde ponemos los proyectos
const backBtn = document.getElementById('back-btn'); // Botón "Volver"

// Seleccionamos las 3 columnas principales
const columns = document.querySelectorAll('.split-item'); 

// ==========================================
// CONFIGURACIÓN DE PARTÍCULAS
// ==========================================
// Esto controla cómo se mueven los puntos en el fondo.

// ==========================================
// CONFIGURACIÓN DE PARTÍCULAS (AVANZADA)
// ==========================================

// 1. Configuración Base (Pantalla Principal)
const landingParticles = {
    particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        opacity: { value: 0.2, random: true },
        size: { value: 3 },
        move: { enable: true, speed: 1, direction: "none", random: true, out_mode: "out" },
        line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.1, width: 1 }
    },
    interactivity: {
        events: { onhover: { enable: true, mode: "grab" } },
        modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } } }
    }
};

// 2. Efecto VIDEOJUEGOS (Cuadrados Pixel Art que caen)
const gameParticles = {
    particles: {
        number: { value: 80 },
        color: { value: "#00ff9d" }, // Verde
        shape: { type: "square" }, // Cuadrados
        opacity: { value: 0.8 },
        size: { value: 5, random: true },
        move: { enable: true, speed: 4, direction: "bottom", straight: false, out_mode: "out" }, // Lluvia
        line_linked: { enable: false }
    }
};

// 3. Efecto FULL STACK (Red Tecnológica)
const stackParticles = {
    particles: {
        number: { value: 60 },
        color: { value: "#00f3ff" }, // Azul
        shape: { type: "circle" },
        opacity: { value: 0.5 },
        size: { value: 3 },
        move: { enable: true, speed: 2, direction: "none", random: false, out_mode: "bounce" },
        line_linked: { enable: true, distance: 120, color: "#00f3ff", opacity: 0.4, width: 1 } // Conexiones visibles
    }
};

// 4. Efecto DATOS (Símbolos o números flotando)
const dataParticles = {
    particles: {
        number: { value: 40 },
        color: { value: "#ff5500" }, // Naranja
        shape: { type: "char", character: { value: ["0", "1", "{", "}", "$"], font: "Verdana" } }, // Caracteres de código
        opacity: { value: 0.8 },
        size: { value: 10 },
        move: { enable: true, speed: 1, direction: "top", random: true } // Suben como datos
    }
};

// ==========================================
// LÓGICA PRINCIPAL
// ==========================================

// 1. CARGA INICIAL
document.addEventListener('DOMContentLoaded', () => {
    // Iniciamos las partículas del fondo
    tsParticles.load("tsparticles", landingParticles);
});

// 2. EVENTOS DE CLIC EN LAS COLUMNAS
columns.forEach(col => {
    col.addEventListener('click', () => {
        // Obtenemos qué sección es (gamedev, fullstack o database)
        const sectionType = col.dataset.section;
        
        // Abrimos la pantalla de detalles
        openDetails(sectionType);
    });
});

// --- LÓGICA DE BIENVENIDA Y CONTACTO ---

const introScreen = document.getElementById('intro-screen');
const enterBtn = document.getElementById('enter-btn');
const backIntroBtn = document.getElementById('back-intro-btn'); // Nuevo botón
const contactBtn = document.getElementById('contact-btn');
const contactModal = document.getElementById('contact-modal');
const closeContact = document.getElementById('close-contact');

// Entrar al Hub
enterBtn.addEventListener('click', () => {
    introScreen.style.opacity = '0';
    introScreen.style.visibility = 'hidden';
    
    // Quitar el efecto borroso del fondo
    splitLanding.classList.remove('blurred');
});

// Volver a la Bienvenida (Reset Completo)
backIntroBtn.addEventListener('click', () => {
    // 1. Mostrar Pantalla de Intro
    introScreen.style.visibility = 'visible';
    introScreen.style.opacity = '1';
    
    // 2. Restaurar efecto borroso
    splitLanding.classList.add('blurred');

    // 3. Si estábamos viendo un proyecto, cerrar esa vista
    if (!contentOverlay.classList.contains('hidden')) {
        contentOverlay.classList.add('hidden');
        splitLanding.style.display = 'flex';
        // Restaurar partículas del fondo original
        tsParticles.load("tsparticles", landingParticles);
    }
});

// Abrir Modal Contacto
contactBtn.addEventListener('click', () => {
    contactModal.classList.remove('hidden');
});

// Cerrar Modal Contacto
closeContact.addEventListener('click', () => {
    contactModal.classList.add('hidden');
});

// Cerrar si clic fuera
window.addEventListener('click', (e) => {
    if (e.target === contactModal) {
        contactModal.classList.add('hidden');
    }
});

// 3. EVENTO BOTÓN VOLVER (De detalles a Hub)
backBtn.addEventListener('click', () => {
    // Cerramos detalles
    contentOverlay.classList.add('hidden'); 
    splitLanding.style.display = 'flex'; 
    
    // Restaurar partículas iniciales
    tsParticles.load("tsparticles", landingParticles);

    // Mostrar de nuevo la flecha de "Volver a Bienvenida"
    backIntroBtn.style.display = 'flex';
});

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function openDetails(category) {
    // 1. Ocultar la pantalla principal y la flecha de intro
    splitLanding.style.display = 'none';
    backIntroBtn.style.display = 'none'; // Ocultar flecha
    
    // 2. Mostrar la pantalla de detalles
    contentOverlay.classList.remove('hidden');
    
    // 3. Cambiar las partículas según la categoría
    if (category === 'gamedev') tsParticles.load("tsparticles", gameParticles);
    if (category === 'fullstack') tsParticles.load("tsparticles", stackParticles);
    if (category === 'database') tsParticles.load("tsparticles", dataParticles);

    // 4. Buscar los proyectos de esa categoría
    // Filtramos la lista 'projectsData' buscando coincidencias
    const filtered = projectsData.filter(item => item.category === category);

    // 5. Crear el HTML de las tarjetas
    let htmlContent = `<h2 style="margin-bottom:20px; color:white;">Proyectos de ${category.toUpperCase()}</h2>`;
    htmlContent += `<div class="projects-grid">`;

    // Recorremos cada proyecto encontrado
    filtered.forEach(proj => {
        htmlContent += `
            <div class="project-card">
                <div class="project-img-box">
                    <img src="${proj.image}" alt="${proj.title}">
                </div>
                <div class="project-info">
                    <h3 style="color:white; margin-bottom:10px;">${proj.title}</h3>
                    <div style="margin-bottom:10px;">
                        ${proj.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                    <p style="color:#aaa; margin-bottom:15px;">${proj.description}</p>
                    <a href="${proj.link}" class="project-btn">Ver Proyecto</a>
                </div>
            </div>
        `;
    });

    htmlContent += `</div>`; // Cerramos el div grid

    // 5. Inyectar el HTML en la página (si existe el contenedor dinámico)
    // Nota: En index.html necesitamos crear este contenedor si lo borré sin querer en el paso anterior.
    // Vamos a chequearlo y crearlo dinámicamente si falta.
    let container = document.getElementById('dynamic-area');
    if (!container) {
        container = document.createElement('div');
        container.id = 'dynamic-area';
        contentOverlay.appendChild(container);
    }
    container.innerHTML = htmlContent;
}
