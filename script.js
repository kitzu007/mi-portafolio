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
const splitLanding = document.getElementById('split-landing'); 
const contentOverlay = document.getElementById('content-overlay'); 
const dynamicContent = document.getElementById('dynamic-content'); 
const backBtn = document.getElementById('back-btn'); 
const retroBg = document.getElementById('retro-bg'); // NUEVO: Referencia al fondo retro


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
    },
    interactivity: {
        events: {
            onhover: { enable: true, mode: "repulse" }, // Reacción al mouse
        },
        modes: {
            repulse: { distance: 100, duration: 0.4 }
        }
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
    
    // Asegurar que el fondo retro esté oculto al inicio
    if(retroBg) retroBg.classList.add('hidden');
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
        retroBg.classList.add('hidden'); // NUEVO: Asegurar que se oculta el fondo retro
        
        retroBg.classList.add('hidden'); // NUEVO: Asegurar que se oculta el fondo retro
        
        // Detener Snake
        if(gameRunning) {
            gameRunning = false;
            cancelAnimationFrame(gameAnimationFrame);
        }
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

    // Detener juego Snake
    if(gameRunning) {
        gameRunning = false;
        cancelAnimationFrame(gameAnimationFrame); // NUEVO: Cancelar frame
    }

    // NUEVO: Ocultar el fondo retro al salir
    retroBg.classList.add('hidden');

    // Mostrar de nuevo la flecha de "Volver a Bienvenida"
    backIntroBtn.style.display = 'flex';
});

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================



function openDetails(category) {
    // 1. Ocultar la pantalla principal y flecha
    splitLanding.style.display = 'none';
    backIntroBtn.style.display = 'none'; 
    
    // 2. Mostrar la pantalla de detalles
    contentOverlay.classList.remove('hidden');
    
    // 3. Cambiar partículas y fondo
    if (category === 'gamedev') {
        tsParticles.load("tsparticles", gameParticles);
        retroBg.classList.remove('hidden');
    } else {
        retroBg.classList.add('hidden');
    }

    if (category === 'fullstack') tsParticles.load("tsparticles", stackParticles);
    if (category === 'database') tsParticles.load("tsparticles", dataParticles);

    // 4. Buscar proyectos
    const filtered = projectsData.filter(item => item.category === category);

    // 5. Generar HTML (LÓGICA DIFERENCIADA PARA GAME DEV)
    let htmlContent = `<h2 style="margin-bottom:20px; color:white;">Proyectos de ${category.toUpperCase()}</h2>`;

    if (category === 'gamedev') {
        // --- LAYOUT DIVIDIDO PARA GAME DEV ---
        htmlContent += `<div class="gamedev-container">`;
        
        // Columna Izquierda: Proyectos
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
        htmlContent += `</div>`; // Fin projects-col

        // Columna Derecha: Juego Snake
        htmlContent += `
            <div class="game-col">
                <div class="game-score">SCORE: <span id="score">0</span></div>
                <canvas id="snake-canvas" width="300" height="300"></canvas>
                <button id="start-game-btn" class="game-btn" style="display:block;">JUGAR</button>
                <p class="game-instructions">Usa las flechas del teclado ⬆️⬇️⬅️➡️</p>
                <p id="game-over-msg" style="color:red; display:none; font-family:'Press Start 2P'; margin-top:10px;">GAME OVER</p>
            </div>
        `;

        htmlContent += `</div>`; // Fin gamedev-container

    } else {
        // --- LAYOUT NORMAL (Full Stack / Database) ---
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

    // Inyectar HTML
    let container = document.getElementById('dynamic-area');
    if (!container) {
        container = document.createElement('div');
        container.id = 'dynamic-area';
        contentOverlay.appendChild(container); // Esto podría duplicar si no se limpia, pero openDetails suele llamarse fresco
    }
    container.innerHTML = htmlContent;

    // INICIAR JUEGO
    if (category === 'gamedev') {
        setupSnakeGame();
    }
}

// ==========================================
// JUEGO SNAKE
// ==========================================
// let gameInterval; // YA NO SE USA
let gameRunning = false;

let gameAnimationFrame;
let lastTime = 0;

function setupSnakeGame() {
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    const roleBtn = document.getElementById('start-game-btn');
    const scoreEl = document.getElementById('score');
    const msgEl = document.getElementById('game-over-msg');

    // Configuración
    const box = 20; 
    
    // Estado Lógico
    let snake = [];
    let prevSnake = []; 
    
    // Inicialización
    snake[0] = { x: 9 * box, y: 10 * box };
    prevSnake[0] = { x: 9 * box, y: 10 * box };

    let food = {
        x: Math.floor(Math.random() * 15) * box,
        y: Math.floor(Math.random() * 15) * box,
        color: "#ff00cc",
        pulse: 0
    };

    let score = 0;
    let d; 
    
    // Cola de Inputs (Buffer)
    let inputQueue = [];

    // Sistema de Partículas
    let particles = [];

    // Variables de Loop
    let dropCounter = 0;
    let dropInterval = 100;

    // --- TELEMETRÍA (Data Analyst Mode) ---
    let startTime = 0;
    let movesCount = 0;
    let maxSpeed = 100; // ms por frame (menor es más rápido)
    let deathReason = ""; // 'wall' o 'self'

    // Inputs
    document.addEventListener('keydown', handleInput);

    function handleInput(event) {
        if (!gameRunning) return;
        
        const key = event.keyCode;
        const validKeys = [37, 38, 39, 40];
        
        if (validKeys.includes(key)) {
            event.preventDefault();
            
            // Mapear tecla
            let newDir;
            if (key === 37) newDir = "LEFT";
            if (key === 38) newDir = "UP";
            if (key === 39) newDir = "RIGHT";
            if (key === 40) newDir = "DOWN";

            const lastDir = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : d;
            
            // Validaciones
            if (newDir === "LEFT" && lastDir === "RIGHT") return;
            if (newDir === "RIGHT" && lastDir === "LEFT") return;
            if (newDir === "UP" && lastDir === "DOWN") return;
            if (newDir === "DOWN" && lastDir === "UP") return;
            if (newDir === lastDir) return;

            if (inputQueue.length < 3) {
                inputQueue.push(newDir);
                movesCount++; // Registrar movimiento
            }
        }
    }

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

    // Interpolación Lineal
    function lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }

    function update(time = 0) {
        if(!gameRunning) return;

        const deltaTime = time - lastTime;
        lastTime = time;

        dropCounter += deltaTime;

        // --- LOGICA DE JUEGO ---
        while (dropCounter > dropInterval) {
            dropCounter -= dropInterval;

            if (inputQueue.length > 0) {
                d = inputQueue.shift();
            }

            if (d) {
                prevSnake = snake.map(segment => ({ ...segment }));

                let snakeX = snake[0].x;
                let snakeY = snake[0].y;

                if(d == "LEFT") snakeX -= box;
                if(d == "UP") snakeY -= box;
                if(d == "RIGHT") snakeX += box;
                if(d == "DOWN") snakeY += box;

                // Comer
                let ate = false;
                if(snakeX == food.x && snakeY == food.y) {
                    score++;
                    scoreEl.innerText = score;
                    createExplosion(food.x, food.y, "#ff00cc");
                    
                    let newFoodX, newFoodY;
                    let validPos = false;
                    while(!validPos) {
                        newFoodX = Math.floor(Math.random() * 15) * box;
                        newFoodY = Math.floor(Math.random() * 15) * box;
                        validPos = !collision({x:newFoodX, y:newFoodY}, snake);
                    }
                    food.x = newFoodX;
                    food.y = newFoodY;

                    ate = true;
                    if(dropInterval > 60) dropInterval -= 1;
                    
                    // Actualizar maxSpeed si superamos el récord de esta sesión
                    if (dropInterval < maxSpeed) maxSpeed = dropInterval;

                } else {
                    snake.pop();
                }

                // Game Over Check
                let newHead = { x: snakeX, y: snakeY };
                
                // Chequear Muerte por Pared
                if(snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height) {
                    deathReason = "wall";
                    gameOver();
                    return;
                }
                
                // Chequear Muerte por Pertenecer a sí mismo
                if(collision(newHead, snake)) {
                    deathReason = "self";
                    gameOver();
                    return; 
                }

                snake.unshift(newHead);
                
                if (ate) {
                    let tail = prevSnake[prevSnake.length - 1];
                    prevSnake.push({ ...tail });
                }
            }
        }

        // --- RENDERIZADO ---
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        let alpha = dropCounter / dropInterval;
        if (alpha > 1) alpha = 1;
        if (!d) alpha = 1;

        ctx.strokeStyle = "#111";
        ctx.lineWidth = 1;
        for(let i=0; i<canvas.width; i+=box) {
            ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }

        food.pulse += 0.1;
        const glowSize = 15 + Math.sin(food.pulse) * 5;
        
        ctx.shadowBlur = glowSize;
        ctx.shadowColor = "#ff00cc";
        ctx.fillStyle = "#ff00cc";
        ctx.fillRect(food.x + 2, food.y + 2, box - 4, box - 4);
        ctx.shadowBlur = 0;

        for(let i = 0; i < snake.length; i++) {
            const curr = snake[i];
            const prev = prevSnake[i] || curr; 

            const renderX = lerp(prev.x, curr.x, alpha);
            const renderY = lerp(prev.y, curr.y, alpha);

            if (i === 0) {
                ctx.shadowBlur = 20;
                ctx.shadowColor = "#00ff9d";
                ctx.fillStyle = "#fff";
            } else {
                ctx.shadowBlur = 0;
                ctx.fillStyle = "#00ff9d";
            }

            ctx.fillRect(renderX, renderY, box, box);

            if (i === 0) {
                ctx.fillStyle = "#000";
                ctx.fillRect(renderX + 4, renderY + 4, 4, 4);
                ctx.fillRect(renderX + 12, renderY + 4, 4, 4);
            }
        }
        ctx.shadowBlur = 0;

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
        
        // --- PROCESO DE GUARDADO DE DATOS ---
        const duration = Math.floor((Date.now() - startTime) / 1000); // Segundos jugados
        // Pedir nombre al usuario
        setTimeout(() => {
            const name = prompt("¡Juego Terminado! Ingresa tu nombre para guardar tus estadísticas (Database Analyst Mode):", "Player 1");
            if(name) {
                sendDataToBackend(name, score, duration, movesCount, maxSpeed, deathReason);
            }
        }, 100);
    }
    
    // Función para enviar datos a la API PHP
    async function sendDataToBackend(name, score, duration, moves, speed, death) {
        const payload = {
            player_name: name,
            score: score,
            duration_seconds: duration,
            moves_count: moves,
            max_speed_ms: speed,
            death_type: death,
            platform: navigator.platform // Info básica del sistema
        };
        
        try {
            const response = await fetch('api/save_score.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            if(result.success) {
                alert("✅ Datos guardados en MySQL exitosamente.");
            } else {
                console.error("Error DB:", result.error);
                alert("❌ Error al guardar: " + result.error);
            }
        } catch (err) {
            console.error("Error Fetch:", err);
            // alert("No se pudo conectar con la API (¿Está corriendo WAMP?).");
        }
    }

    function collision(head, array) {
         for(let i = 0; i < array.length; i++) {
            if(head.x == array[i].x && head.y == array[i].y) return true;
        }
        return false;
    }

    // Botón Jugar/Reintentar
    roleBtn.addEventListener('click', () => {
        // Reset Logic
        snake = [];
        snake[0] = { x: 9 * box, y: 10 * box };
        prevSnake = [];
        prevSnake[0] = { x: 9 * box, y: 10 * box };
        
        score = 0;
        scoreEl.innerText = score;
        
        d = undefined;
        inputQueue = [];
        
        msgEl.style.display = 'none';
        roleBtn.style.display = 'none';
        
        dropInterval = 100;
        particles = []; 
        
        // Reset Telemetría
        movesCount = 0;
        maxSpeed = 100;
        startTime = Date.now();
        deathReason = "";

        gameRunning = true;
        lastTime = performance.now();
        update(); 
    });
}
