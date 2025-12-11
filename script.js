// ==========================================
// 1. BASE DE DATOS DE PROYECTOS (Simulada)
// ==========================================
// ¡Hola! Aquí es donde defines qué trabajos quieres mostrar al mundo.
// Es como tu currículum, pero en formato de objetos JSON.
const projectsData = [
    // --- VIDEOJUEGOS (Game Dev) ---
    {
        category: "gamedev",
        title: "Neon Cyber-Racer",
        description: "Arcade de carreras futurista con físicas de vehículos avanzadas y shaders personalizados.",
        tags: ["Unity", "C#", "HLSL"],
        image: "https://placehold.co/600x400/000/00ff9d?text=Cyber+Racer",
        link: "#"
    },
    {
        category: "gamedev",
        title: "Dungeon Souls",
        description: "RPG de acción roguelike. Generación procedimental de mazmorras e IA enemiga compleja.",
        tags: ["Unreal Engine 5", "C++", "AI"],
        image: "https://placehold.co/600x400/111/00ff9d?text=Dungeon+Souls",
        link: "#"
    },
    {
        category: "gamedev",
        title: "VR Space Odyssey",
        description: "Experiencia de realidad virtual inmersiva simulando gravedad cero.",
        tags: ["Oculus SDK", "Unity", "VR"],
        image: "https://placehold.co/600x400/222/00ff9d?text=VR+Space",
        link: "#"
    },

    // --- FULL STACK (Web) ---
    {
        category: "fullstack",
        title: "CryptoExchange Pro",
        description: "Plataforma de trading en tiempo real con WebSockets y autenticación segura.",
        tags: ["React", "Node.js", "WebSockets"],
        image: "https://placehold.co/600x400/000/00f3ff?text=Crypto+App",
        link: "#"
    },
    {
        category: "fullstack",
        title: "SaaS Task Manager",
        description: "Gestor de productividad para equipos remotos con calendario colaborativo.",
        tags: ["Next.js", "Firebase", "Tailwind"],
        image: "https://placehold.co/600x400/001/00f3ff?text=SaaS+Task",
        link: "#"
    },
    {
        category: "fullstack",
        title: "Social Media Hub",
        description: "Red social con feed infinito, stories y sistema de likes/comentarios.",
        tags: ["MERN", "AWS S3", "GraphQL"],
        image: "https://placehold.co/600x400/002/00f3ff?text=Social+Network",
        link: "#"
    },

    // --- DATOS (Database Specialist) ---
    {
        category: "database",
        title: "Big Data Analytics Core",
        description: "Procesamiento de 1M+ registros por segundo para detección de fraudes bancarios.",
        tags: ["Apache Kafka", "Python", "SQL"],
        image: "https://placehold.co/600x400/100/ff5500?text=Big+Data",
        link: "#"
    },
    {
        category: "database",
        title: "Warehouse AI Optimization",
        description: "Algoritmo predictivo para gestión de inventario basado en históricos de ventas.",
        tags: ["Machine Learning", "Snowflake", "dbt"],
        image: "https://placehold.co/600x400/200/ff5500?text=AI+Logistic",
        link: "#"
    },
    {
        category: "database",
        title: "NoSQL Migration Tool",
        description: "Herramienta CLI para migrar schemas relacionales a estructuras documentales sin downtime.",
        tags: ["MongoDB", "Go", "Docker"],
        image: "https://placehold.co/600x400/300/ff5500?text=Migration+Tool",
        link: "#"
    }
];

// ==========================================
// 2. REFERENCIAS AL DOM (Elementos de HTML)
// ==========================================
// Aquí "agarramos" los elementos de la página para poder controlarlos.
const splitLanding = document.getElementById('split-landing'); 
const contentOverlay = document.getElementById('content-overlay'); 
const dynamicContent = document.getElementById('dynamic-content'); 
const backBtn = document.getElementById('back-btn'); 
const retroBg = document.getElementById('retro-bg'); 

// Seleccionamos las 3 columnas principales donde ocurre la magia
const columns = document.querySelectorAll('.split-item'); 

// ==========================================
// 3. CONFIGURACIÓN DE PARTÍCULAS (tsParticles)
// ==========================================
// Estas configuraciones definen cómo se comportan los fondos animados.

// A. Configuración Base: ECO SISTEMA DIGITAL (Tu Landing Page)
// Mezcla de formas y colores que representa todas tus habilidades.
const landingParticles = {
    particles: {
        number: { value: 120, density: { enable: true, value_area: 800 } },
        color: { 
            value: ["#00ff9d", "#00f3ff", "#ff5500", "#bf00ff"] // Verde, Azul, Naranja, Purpura
        },
        shape: { 
            type: ["circle", "triangle", "edge", "char"], 
            character: {
                value: ["{ }", "< >", "</>", "0", "1", "★", "⚡"], // Símbolos de código y poder
                font: "Verdana",
                weight: "bold",
                fill: true
            }
        },
        opacity: { 
            value: 0.8, 
            random: true, 
            anim: { enable: true, speed: 1, opacity_min: 0.3, sync: false } 
        },
        size: { 
            value: 6, 
            random: true, 
            anim: { enable: true, speed: 3, size_min: 2, sync: false } 
        },
        line_linked: { 
            enable: true, 
            distance: 180, // Conexiones entre puntos
            color: "#ffffff", 
            opacity: 0.3, 
            width: 1.5 
        },
        move: { 
            enable: true, 
            speed: 2, 
            direction: "none", 
            random: true, 
            out_mode: "out", 
            attract: { enable: false, rotateX: 600, rotateY: 1200 } 
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: { 
            onhover: { enable: true, mode: "bubble" }, // Al pasar mouse
            onclick: { enable: true, mode: "push" },   // Al hacer clic
            resize: true 
        },
        modes: { 
            bubble: { distance: 200, size: 6, duration: 2, opacity: 0.8, speed: 3 },
            push: { particles_nb: 4 }
        }
    },
    retina_detect: true
};

// B. Configuración Game Dev: LLUVIA PIXELADA (Estilo Matrix/Tetris)
const gameParticles = {
    particles: {
        number: { value: 80 },
        color: { value: "#00ff9d" }, // Verde hacker
        shape: { type: "square" },   // Cuadrados pixel art
        opacity: { value: 0.8 },
        size: { value: 5, random: true },
        move: { enable: true, speed: 4, direction: "bottom", straight: false, out_mode: "out" }, // Caen hacia abajo
        line_linked: { enable: false } // Sin líneas, solo "lluvia"
    },
    interactivity: {
        events: {
            onhover: { enable: true, mode: "repulse" }, // Se alejan de tu mouse
        },
        modes: {
            repulse: { distance: 100, duration: 0.4 }
        }
    }
};

// C. Configuración Full Stack: RED TECNOLÓGICA (Nodos conectados)
const stackParticles = {
    particles: {
        number: { value: 60 },
        color: { value: "#00f3ff" }, // Azul cian futurista
        shape: { type: "circle" },
        opacity: { value: 0.5 },
        size: { value: 3 },
        move: { enable: true, speed: 2, direction: "none", random: false, out_mode: "bounce" },
        line_linked: { enable: true, distance: 120, color: "#00f3ff", opacity: 0.4, width: 1 } // Red muy visible
    }
};

// D. Configuración Datos: CODIGO FLOTANTE (Data Streams)
const dataParticles = {
    particles: {
        number: { value: 40 },
        color: { value: "#ff5500" }, // Naranja base de datos
        shape: { type: "char", character: { value: ["0", "1", "{", "}", "$"], font: "Verdana" } }, // Binarios y símbolos
        opacity: { value: 0.8 },
        size: { value: 10 },
        move: { enable: true, speed: 1, direction: "top", random: true } // Suben hacia la "nube"
    }
};

// ==========================================
// 4. LÓGICA PRINCIPAL DEL SITIO
// ==========================================

// --- CARGA INICIAL ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Iniciamos las partículas del "Ecosistema" (Pantalla principal)
    tsParticles.load("tsparticles", landingParticles);
    
    // 2. Nos aseguramos que el fondo retro 3D esté apagado al principio
    if(retroBg) retroBg.classList.add('hidden');
});

// --- INTERACCIÓN CON LAS 3 COLUMNAS DEL HUB ---
columns.forEach(col => {
    
    // A. EFECTO DE INCLINACIÓN 3D (TILT)
    // Hace que las tarjetas sigan a tu mouse.
    col.addEventListener('mousemove', (e) => {
        // Desactivamos esto en celulares para ahorrar batería
        if (window.innerWidth > 768) {
            const content = col.querySelector('.content'); 
            
            // Matemáticas para calcular dónde está el mouse relativo al centro
            const rect = col.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const xPct = mouseX / width - 0.5; // -0.5 (izq) a 0.5 (der)
            const yPct = mouseY / height - 0.5;
            
            // Calculamos rotación (máximo 30 grados)
            const rotateY = xPct * 30; 
            const rotateX = yPct * -30; // Invertido para efecto ventana
            
            // Aplicamos la transformación CSS
            content.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
            content.style.transition = 'none'; // Sin retardo para que se sienta instantáneo
        }
    });

    // B. RESTAURAR AL SALIR DEL MOUSE
    col.addEventListener('mouseleave', () => {
        const content = col.querySelector('.content');
        content.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        content.style.transition = 'transform 0.5s ease'; // Volver suavemente al centro
    });

    // C. CLIC PARA ENTRAR A UNA SECCIÓN
    col.addEventListener('click', () => {
        const sectionType = col.dataset.section; // 'gamedev', 'fullstack' o 'database'
        openDetails(sectionType);
    });
});

// ==========================================
// 5. SISTEMA DE BIENVENIDA Y TRANSICIÓN ÉPICA
// ==========================================
const introScreen = document.getElementById('intro-screen');
const enterBtn = document.getElementById('enter-btn');
const backIntroBtn = document.getElementById('back-intro-btn'); 
const contactBtn = document.getElementById('contact-btn');
const contactModal = document.getElementById('contact-modal');
const closeContact = document.getElementById('close-contact');

// Creamos un elemento div para el flash blanco/gris dinámicamente
const flashOverlay = document.createElement('div');
flashOverlay.classList.add('white-flash');
document.body.appendChild(flashOverlay);

// --- AL HACER CLIC EN "ENTRAR AL HUB" ---
enterBtn.addEventListener('click', () => {
    
    // 1. Efecto WARP VELOCITY (Acelerar partículas al máximo)
    const particles = tsParticles.domItem(0);
    if (particles) {
        particles.options.particles.move.speed = 50; // ¡Velocidad absurda!
        particles.options.particles.size.value = 0.5; // Se hacen rayitas como estrellas
        particles.options.particles.opacity.value = 1;
        particles.refresh();
    }

    // 2. Animación de Zoom hacia la cámara (CSS)
    introScreen.classList.add('intro-exit');

    // 3. Coordinar los tiempos de la animación
    setTimeout(() => {
        // FLASH DE LUZ
        flashOverlay.classList.add('flash-active');
        
        // Cambio de escena justo cuando la luz nos ciega
        setTimeout(() => {
            introScreen.style.display = 'none';
            introScreen.classList.remove('intro-exit');
            splitLanding.classList.remove('blurred'); // Enfocamos el Hub
            splitLanding.classList.add('active'); 
            
            // Apagar flash (fade out suave)
            flashOverlay.classList.remove('flash-active');

            // Restaurar partículas a velocidad normal
            if (particles) {
                particles.options.particles.move.speed = 1.5; 
                particles.options.particles.size.value = 4;
                particles.options.particles.opacity.value = 0.6;
                particles.refresh();
            }

        }, 200); 

    }, 800); // Esto dura lo mismo que el zoom CSS
});

// --- VOLVER A LA PANTALLA DE INICIO (RESET) ---
backIntroBtn.addEventListener('click', () => {
    // Restaurar visibilidad
    introScreen.style.display = 'flex'; 
    
    // Pequeño truco para permitir que la transición de opacidad funcione
    setTimeout(() => {
        introScreen.style.opacity = '1';
        introScreen.style.visibility = 'visible';
    }, 10);

    // Desenfocar el fondo de nuevo
    splitLanding.classList.remove('active');
    splitLanding.classList.add('blurred');

    // Si había un proyecto abierto, cerrarlo todo
    if (!contentOverlay.classList.contains('hidden')) {
        contentOverlay.classList.add('hidden');
        splitLanding.style.display = 'flex';
        
        // Cargar partículas originales
        tsParticles.load("tsparticles", landingParticles);
        retroBg.classList.add('hidden');
        
        // Detener Snake si estaba corriendo
        if(gameRunning) {
            gameRunning = false;
            cancelAnimationFrame(gameAnimationFrame);
        }
    }
});

// --- MODAL DE CONTACTO ---
contactBtn.addEventListener('click', () => { contactModal.classList.remove('hidden'); });
closeContact.addEventListener('click', () => { contactModal.classList.add('hidden'); });
window.addEventListener('click', (e) => { // Cerrar si clic fuera
    if (e.target === contactModal) contactModal.classList.add('hidden');
});

// --- BOTÓN VOLVER (De Proyectos al Hub) ---
backBtn.addEventListener('click', () => {
    contentOverlay.classList.add('hidden'); 
    splitLanding.style.display = 'flex'; 
    
    tsParticles.load("tsparticles", landingParticles); // Particles default

    if(gameRunning) {
        gameRunning = false;
        cancelAnimationFrame(gameAnimationFrame); 
    }

    retroBg.classList.add('hidden'); // Ocultar grid
    backIntroBtn.style.display = 'flex'; // Mostrar botón de inicio
});

// ==========================================
// 6. FUNCIÓN PARA ABRIR DETALLES (PROYECTOS)
// ==========================================
function openDetails(category) {
    // 1. Preparar escenario
    splitLanding.style.display = 'none';
    backIntroBtn.style.display = 'none'; 
    contentOverlay.classList.remove('hidden');
    
    // 2. Configurar ambiente según categoría
    if (category === 'gamedev') {
        tsParticles.load("tsparticles", gameParticles); // Lluvia Matrix
        retroBg.classList.remove('hidden'); // Activar Grid 3D
    } else {
        retroBg.classList.add('hidden');
    }

    if (category === 'fullstack') tsParticles.load("tsparticles", stackParticles);
    if (category === 'database') tsParticles.load("tsparticles", dataParticles);

    // 3. Filtrar proyectos
    const filtered = projectsData.filter(item => item.category === category);

    // 4. Construir el HTML dinámicamente
    let htmlContent = `<h2 style="margin-bottom:20px; color:white;">Proyectos de ${category.toUpperCase()}</h2>`;

    // CASO ESPECIAL: GAME DEV (Incluye el juego Snake)
    if (category === 'gamedev') {
        htmlContent += `<div class="gamedev-container">`;
        
        // Columna Izq: Lista de Juegos
        htmlContent += `<div class="projects-col">`;
        filtered.forEach(proj => {
            htmlContent += `
                <div class="project-card pixel-card">
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
        htmlContent += `</div>`; 

        // Columna Der: Mini Consola Snake
        htmlContent += `
            <div class="game-col">
                <div class="game-score">SCORE: <span id="score">0</span></div>
                <canvas id="snake-canvas" width="300" height="300"></canvas>
                <button id="start-game-btn" class="game-btn" style="display:block;">JUGAR</button>
                <p class="game-instructions">Usa las flechas del teclado ⬆️⬇️⬅️➡️</p>
                <p id="game-over-msg" style="color:red; display:none; font-family:'Press Start 2P'; margin-top:10px;">GAME OVER</p>
            </div>
        `;
        htmlContent += `</div>`; 

    } else {
        // CASO NORMAL: Grid simple
        htmlContent += `<div class="projects-grid">`;
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
        htmlContent += `</div>`;
    }

    // 5. Inyectar contenido en la página
    let container = document.getElementById('dynamic-area');
    if (!container) {
        container = document.createElement('div');
        container.id = 'dynamic-area';
        contentOverlay.appendChild(container); 
    }
    container.innerHTML = htmlContent;

    // 6. Si es Game Dev, inicializar el juego
    if (category === 'gamedev') {
        setupSnakeGame();
    }
}

// ==========================================
// 7. MINIJUEGO SNAKE (Lógica del Juego)
// ==========================================
let gameRunning = false;
let gameAnimationFrame;
let lastTime = 0;

function setupSnakeGame() {
    const canvas = document.getElementById('snake-canvas');
    if(!canvas) return; // Seguridad por si acaso

    const ctx = canvas.getContext('2d');
    const roleBtn = document.getElementById('start-game-btn');
    const scoreEl = document.getElementById('score');
    const msgEl = document.getElementById('game-over-msg');

    const box = 20; // Tamaño de cada "cuadrito"
    
    // Estado inicial de la serpiente
    let snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };
    
    // Posición de la comida
    let food = {
        x: Math.floor(Math.random() * 15) * box,
        y: Math.floor(Math.random() * 15) * box,
        pulse: 0
    };

    let score = 0;
    let d; // Dirección actual
    let inputQueue = []; // Cola de teclas para evitar giros imposibles
    let particles = []; // Efectos de explosión

    // Variables de control de tiempo (Game Loop)
    let dropCounter = 0;
    let dropInterval = 100; // Velocidad del juego (ms por frame)

    // Datos para Analítica (Database Profile Feature)
    let startTime = 0;
    let movesCount = 0;
    let maxSpeed = 100;
    let deathReason = "";

    // ESCUCHAR TECLADO
    document.addEventListener('keydown', handleInput);

    function handleInput(event) {
        if (!gameRunning) return;
        
        const key = event.keyCode;
        // Flechas: Izq(37), Arriba(38), Der(39), Abajo(40)
        
        if ([37, 38, 39, 40].includes(key)) {
            event.preventDefault(); // Evitar scroll de la página
            
            let newDir;
            if (key === 37) newDir = "LEFT";
            if (key === 38) newDir = "UP";
            if (key === 39) newDir = "RIGHT";
            if (key === 40) newDir = "DOWN";

            // Obtener última dirección registrada
            const lastDir = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : d;
            
            // EVITAR GIROS DE 180 GRADOS (Chocar contra uno mismo)
            if (newDir === "LEFT" && lastDir === "RIGHT") return;
            if (newDir === "RIGHT" && lastDir === "LEFT") return;
            if (newDir === "UP" && lastDir === "DOWN") return;
            if (newDir === "DOWN" && lastDir === "UP") return;
            if (newDir === lastDir) return;

            // Limitar inputs rápidos ('Buffer')
            if (inputQueue.length < 3) {
                inputQueue.push(newDir);
                movesCount++; 
            }
        }
    }

    // Efecto de partículas al comer
    function createExplosion(x, y, color) {
        for(let i=0; i<20; i++) {
            particles.push({
                x: x + box/2,
                y: y + box/2,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0,
                color: color,
                size: Math.random() * 3 + 1
            });
        }
    }

    // BUCLE PRINCIPAL DEL JUEGO (Update Loop)
    function update(time = 0) {
        if(!gameRunning) return;

        const deltaTime = time - lastTime;
        lastTime = time;
        dropCounter += deltaTime;

        // Actualizar lógica cada 'dropInterval' milisegundos
        while (dropCounter > dropInterval) {
            dropCounter -= dropInterval;

            if (inputQueue.length > 0) d = inputQueue.shift(); // Procesar siguiente movimiento

            if (d) {
                let snakeX = snake[0].x;
                let snakeY = snake[0].y;

                if(d == "LEFT") snakeX -= box;
                if(d == "UP") snakeY -= box;
                if(d == "RIGHT") snakeX += box;
                if(d == "DOWN") snakeY += box;

                // --- COMER MANZANA ---
                if(snakeX == food.x && snakeY == food.y) {
                    score++;
                    scoreEl.innerText = score;
                    createExplosion(food.x, food.y, "#ff00cc");
                    
                    // Nueva posición de comida (que no caiga en la serpiente)
                    let validPos = false;
                    while(!validPos) {
                        food.x = Math.floor(Math.random() * 15) * box;
                        food.y = Math.floor(Math.random() * 15) * box;
                        validPos = !collision({x:food.x, y:food.y}, snake);
                    }

                    // Aumentar dificultad (Velocidad)
                    if(dropInterval > 60) dropInterval -= 1;
                    if (dropInterval < maxSpeed) maxSpeed = dropInterval;

                } else {
                    snake.pop(); // Si no comemos, quitamos la cola para avanzar
                }

                // --- GESTIÓN DE COLISIONES (GAME OVER) ---
                let newHead = { x: snakeX, y: snakeY };
                
                // 1. Chocar con paredes
                if(snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height) {
                    deathReason = "wall";
                    gameOver();
                    return;
                }
                
                // 2. Chocar consigo mismo
                if(collision(newHead, snake)) {
                    deathReason = "self";
                    gameOver();
                    return; 
                }

                snake.unshift(newHead); // Añadir nueva cabeza
            }
        }

        // --- DIBUJAR TODO (RENDER) ---
        ctx.fillStyle = "#050505"; // Fondo negro
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar Grid Verde estilo CRT
        ctx.strokeStyle = "#111";
        ctx.lineWidth = 1;
        for(let i=0; i<canvas.width; i+=box) {
            ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }

        // Dibujar Comida (con efecto pulsante)
        food.pulse += 0.1;
        const glowSize = 15 + Math.sin(food.pulse) * 5;
        ctx.shadowBlur = glowSize;
        ctx.shadowColor = "#ff00cc";
        ctx.fillStyle = "#ff00cc";
        ctx.fillRect(food.x + 2, food.y + 2, box - 4, box - 4);
        ctx.shadowBlur = 0;

        // Dibujar Serpiente
        for(let i = 0; i < snake.length; i++) {
            // Cabeza blanca brillante, cuerpo verde
            if (i === 0) {
                ctx.shadowBlur = 20;
                ctx.shadowColor = "#00ff9d";
                ctx.fillStyle = "#fff";
            } else {
                ctx.shadowBlur = 0;
                ctx.fillStyle = "#00ff9d";
            }
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
        }

        // Dibujar Partículas
        particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.03;

            if(p.life <= 0) {
                particles.splice(index, 1);
            } else {
                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size);
                ctx.globalAlpha = 1.0;
            }
        });

        gameAnimationFrame = requestAnimationFrame(update);
    }

    function gameOver() {
        gameRunning = false;
        cancelAnimationFrame(gameAnimationFrame);
        msgEl.style.display = 'block';
        roleBtn.innerText = 'REINTENTAR';
        roleBtn.style.display = 'block';
        
        // --- GUARDAR PUNTAJE EN BASE DE DATOS ---
        const duration = Math.floor((Date.now() - startTime) / 1000); 
        
        setTimeout(() => {
            const name = prompt("¡Juego Terminado! 🎮\nIngresa tu alias para guardar tu récord:", "Jugador 1");
            if(name) {
                sendDataToBackend(name, score, duration, movesCount, maxSpeed, deathReason);
            }
        }, 100);
    }

    function collision(head, array) {
         for(let i = 0; i < array.length; i++) {
            if(head.x == array[i].x && head.y == array[i].y) return true;
        }
        return false;
    }

    // INICIAR EL JUEGO AL TOCAR BOTÓN
    roleBtn.addEventListener('click', () => {
        // Resetear variables
        snake = [];
        snake[0] = { x: 9 * box, y: 10 * box };
        score = 0;
        scoreEl.innerText = score;
        d = undefined;
        inputQueue = [];
        particles = []; 
        movesCount = 0;
        maxSpeed = 100;
        startTime = Date.now();
        deathReason = "";
        
        // Ocultar UI menú
        msgEl.style.display = 'none';
        roleBtn.style.display = 'none';

        gameRunning = true;
        lastTime = performance.now();
        update(); 
    });

    // ==========================================
    // 8. CONEXIÓN CON EL BACKEND (PHP + MySQL)
    // ==========================================
    
    // IMPORTANTE: Si usas Ngrok, actualiza esta URL. Si no, usa localhost.
    const API_URL = "https://unfriable-pressor-alba.ngrok-free.dev/mi-portafolio/api/save_score.php"; 

    // Función asíncrona para enviar los datos
    async function sendDataToBackend(name, score, duration, moves, speed, death) {
        
        // Verificación de seguridad para avisarte si no estás en servidor
        const isFile = window.location.protocol === 'file:';
        const isLiveServer = window.location.port === '5500';

        if (isFile || isLiveServer) {
            alert("⚠️ ALERTA:\nEstás abriendo el archivo localmente.\nPara guardar datos en MySQL, debes usar WAMP en: http://localhost/mi-portafolio/");
            return;
        }

        const payload = {
            player_name: name,
            score: score,
            duration_seconds: duration,
            moves_count: moves,
            max_speed_ms: speed,
            death_type: death,
            platform: navigator.platform 
        };
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            if(result.success) {
                alert("✅ ¡Puntaje guardado en la Base de Datos!");
            } else {
                console.error("Error DB:", result.error);
                alert("❌ Ocurrió un error al guardar: " + result.error);
            }
        } catch (err) {
            console.error("Error Fetch:", err);
            alert("⚠️ Error de conexión: No se pudo contactar con la base de datos.");
        }
    }
}
