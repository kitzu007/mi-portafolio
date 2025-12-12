// ==========================================
// 1. BASE DE DATOS DE PROYECTOS (Simulada)
// ==========================================

// --- SISTEMA DE AUDIO (SoundManager) ---
class SoundManager {
    constructor() {
        this.ctx = null;
        this.muted = true; 
        this.masterGain = null;
        this.musicGain = null; // Nuevo: Volumen SOLO para música
        this.sfxEnabled = true; 
        this.ambienceNodes = []; 
        this.currentMusicVol = 0.5; // Volumen de música (independiente)
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            
            // 1. Nodo Maestro (Mute global)
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.3; 
            this.masterGain.connect(this.ctx.destination);

            // 2. Nodo Música (Controlado por slider)
            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.value = this.currentMusicVol;
            this.musicGain.connect(this.masterGain);
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
    }

    // Actualizar Volumen de MÚSICA (Slider)
    setMusicVolume(val) {
        this.currentMusicVol = val; 
        if(this.musicGain && !this.muted) {
            this.musicGain.gain.setTargetAtTime(val, this.ctx.currentTime, 0.1);
        }
    }

    // Toggle SFX
    toggleSFX(state) {
        this.sfxEnabled = state;
    }

    toggleMute() {
        this.init(); 
        this.muted = !this.muted;
        
        const panel = document.getElementById('sound-panel');
        const mainBtn = document.getElementById('sound-main-btn');

        if (mainBtn) {
            if (this.muted) {
                panel.classList.remove('active');
                panel.classList.add('muted'); // Borde ROJO
                
                mainBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
                mainBtn.style.color = '#ff5555';
                if(this.masterGain) this.masterGain.gain.value = 0; // Silencio total
                this.stopAmbience(); 
            } else {
                panel.classList.remove('muted');
                panel.classList.add('active'); // Borde VERDE
                
                mainBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                mainBtn.style.color = 'var(--color-game)';
                if(this.masterGain) this.masterGain.gain.value = 0.3; // Volver a nivel maestro normal
                this.playTone(600, 'sine', 0.1); 
                this.startAmbience(); 
            }
        }
    }

    // --- MÚSICA DE FONDO (Generative Ambient System) ---
    startAmbience() {
        if (this.ambienceNodes.length > 0) return; 

        const now = this.ctx.currentTime;
        
        // 1. EL "COLCHÓN" (Pad)
        const padFreqs = [87.31, 130.81, 174.61, 220.00]; 
        
        padFreqs.forEach((f) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();
            
            osc.type = 'sine'; 
            osc.frequency.value = f;
            
            filter.type = 'lowpass';
            filter.frequency.value = 600;
            
            const lfo = this.ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.05 + Math.random() * 0.02;
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.value = 0.015;
            lfo.connect(lfoGain);
            lfoGain.connect(gain.gain);

            gain.gain.value = 0.03; 

            osc.connect(filter);
            filter.connect(gain);
            // CONEXIÓN CLAVE: Conectamos a musicGain, no masterGain directo
            gain.connect(this.musicGain); 
            
            osc.start(now);
            lfo.start(now);
            
            this.ambienceNodes.push({ osc, gain, lfo, lfoGain, filter, type: 'pad' });
        });

        // 2. LA MELODÍA (Generative Arpeggiator)
        const scale = [349.23, 392.00, 440.00, 523.25, 587.33, 659.25, 698.46]; 
        
        const playNote = () => {
            if (!this.ctx || this.muted || this.ambienceNodes.length === 0) return;

            const noteFreq = scale[Math.floor(Math.random() * scale.length)];
            
            if(Math.random() > 0.3) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(noteFreq, this.ctx.currentTime);
                
                gain.gain.setValueAtTime(0, this.ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.1); 
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 4); 

                osc.connect(gain);
                // CONEXIÓN CLAVE: Melodía también a musicGain
                gain.connect(this.musicGain);
                
                osc.start(this.ctx.currentTime);
                osc.stop(this.ctx.currentTime + 4);
            }

            const nextTime = (Math.random() * 3000) + 2000;
            this.melodyTimeout = setTimeout(playNote, nextTime);
        };
        playNote(); 
    }

    stopAmbience() {
        // Parar osciladores del pad
        this.ambienceNodes.forEach(node => {
            if(node.type === 'pad') {
                node.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2);
                node.osc.stop(this.ctx.currentTime + 2);
                node.lfo.stop(this.ctx.currentTime + 2);
            }
        });
        
        // Limpiar timeout de melodía
        if(this.melodyTimeout) clearTimeout(this.melodyTimeout);
        
        this.ambienceNodes = [];
    }

    playTone(freq, type, duration, vol = 1) {
        // Verificar Mute con SFX flag
        if (this.muted || !this.ctx || !this.sfxEnabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol * 0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playHover() { this.playTone(800, 'sine', 0.05, 0.2); }
    playClick() { this.playTone(400, 'square', 0.1, 0.3); }
    playBack() { this.playTone(200, 'sawtooth', 0.2, 0.3); }
    
    playSnakeEat() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.setValueAtTime(1200, now + 0.1); 
        gain.gain.value = 0.2;
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(now + 0.3);
    }

    playSnakeDie() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.5); 
        gain.gain.value = 0.4;
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(now + 0.5);
    }

    // --- SONIDOS ESPECÍFICOS POR SECCIÓN ---
    playGameDevOpen() {
        // Estilo Arcade (Ya cubierto por playClick, pero lo reforzamos)
        this.playTone(600, 'square', 0.1, 0.3);
        setTimeout(() => this.playTone(800, 'square', 0.2, 0.3), 100);
    }

    playFullStackOpen() {
        // Estilo Moderno y Serio (Glassy/Tech Ping)
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        
        // Oscilador Principal (Tono puro y limpio)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine'; 
        
        // Frecuencia fija pero elegante (ej. un Do alto o un La)
        osc.frequency.setValueAtTime(800, now);
        
        // Envelope: Ataque instantáneo, caída suave (como una campana de cristal)
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.02); // Ataque rápido
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6); // Cola larga y suave
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(now + 0.6);

        // Segundo Oscilador (Armónico para darle 'brillo')
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1200, now); // 5ta justa aprox
        
        gain2.gain.setValueAtTime(0, now);
        gain2.gain.linearRampToValueAtTime(0.1, now + 0.02);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        
        osc2.connect(gain2);
        gain2.connect(this.masterGain);
        
        osc2.start();
        osc2.stop(now + 0.4);
    }

    playDatabaseOpen() {
        // Estilo Procesamiento de Datos (Ráfaga rápida)
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        
        // Ráfaga de 3 "paquetes" de datos
        for(let i=0; i<3; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth'; // Sonido más "rugoso" digital
            
            const time = now + (i * 0.08);
            osc.frequency.setValueAtTime(100 + (i*50), time);
            
            gain.gain.setValueAtTime(0.1, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start(time);
            osc.stop(time + 0.05);
        }
    }
}
const audioSys = new SoundManager();

// ==========================================
// 1.5 SISTEMA DE PERSISTENCIA (State Manager)
// ==========================================
const saveState = (state) => {
    localStorage.setItem('portfolioState', state);
};

const restoreState = () => {
    const saved = localStorage.getItem('portfolioState');
    if (!saved || saved === 'intro') return; // Comportamiento por defecto

    // Si hay estado guardado, saltamos la intro
    introScreen.style.display = 'none';
    splitLanding.classList.remove('blurred');
    splitLanding.classList.add('active');

    if (saved === 'hub') {
        // Ya estamos en el hub por las líneas anteriores
    } else if (saved.startsWith('details:')) {
        const category = saved.split(':')[1];
        // Pequeño timeout para asegurar que el DOM esté listo
        setTimeout(() => openDetails(category), 100);
    }
};


// ¡Hola! Aquí es donde defines qué trabajos quieres mostrar al mundo.
// Es como tu currículum, pero en formato de objetos JSON.
const projectsData = [
    // --- VIDEOJUEGOS (Game Dev) ---
    {
        category: "gamedev",
        title: "Wind Mayhem",
        description: "Juego creado para la game jam, Wind Mayhem es una experiencia salvaje que combina acción, precisión y pura creatividad en una colección de tres minijuegos, tan extraños como divertidos. En este juego me enfoque solo el el diseño de nivel del minijuego  Celestial Monk",
        tags: ["Unity", "C#", "level design"],
        image: "./assets/Wind Mayhem.png",
        link: "https://tayronagames.itch.io/wind-mayhem"
    },
    {
        category: "gamedev",
        title: "Downfall Protocol",
        description: "En un mundo al borde del colapso, la humanidad lucha por adaptarse a un planeta donde las leyes de la gravedad ya no son lo que solían ser. Tras la destrucción de la Luna, la Tierra quedó condenada a una realidad inestable: fuerzas invisibles tiran y empujan en direcciones imposibles. Para sobrevivir, los humanos desarrollaron un dispositivo capaz de manipular la gravedad a voluntad… pero no todos lo usan para proteger. fui el encargado de todo lo relacionado con el diseño de la gravedad y la física del juego.",
        tags: ["Unity", "C#", "level design", "physics"],
        image: "./assets/Downfall Protocol.png",
        link: "https://d1asu.itch.io/downfall-protocol"
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
// 1.1 SOBRE MI (Descripciones por área)
// ==========================================
const aboutMeData = {
    gamedev: "Como desarrollador de videojuegos, combino creatividad y lógica para construir mundos interactivos. Tengo experiencia en Unity y Unreal Engine, trabajando en mecánicas de juego, optimización gráfica y sistemas de inteligencia artificial para brindar experiencias inmersivas.",
    fullstack: "En el desarrollo web, me enfoco en crear soluciones completas y escalables. Domino tanto el frontend como el backend, utilizando tecnologías modernas como React, Node.js y bases de datos para entregar aplicaciones rápidas, seguras y centradas en el usuario.",
    database: "Como especialista en datos, diseño arquitecturas robustas y eficientes. Mi enfoque está en la optimización de consultas, modelado de datos y gestión de grandes volúmenes de información, asegurando integridad, seguridad y alto rendimiento en cada transacción."
};

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
        detect_on: "window",
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
    },
    interactivity: {
        detect_on: "window",
        events: {
            onhover: { enable: true, mode: "grab" }, // Conectar nodos al mouse
            onclick: { enable: true, mode: "push" }
        },
        modes: {
            grab: { distance: 200, line_linked: { opacity: 0.8 } }, // Se iluminan las conexiones
            push: { particles_nb: 3 }
        }
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
    },
    interactivity: {
        detect_on: "window",
        events: {
            onhover: { enable: true, mode: "bubble" }, // "Magnificar" datos al pasar
            onclick: { enable: true, mode: "repulse" }
        },
        modes: {
            bubble: { distance: 150, size: 20, duration: 2, opacity: 1, speed: 3 }, // Se hacen grandes
            repulse: { distance: 200, duration: 0.4 }
        }
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

    // 3. Listener del PANEL DE SONIDO
    const soundMainBtn = document.getElementById('sound-main-btn');
    const volSlider = document.getElementById('volume-slider');
    const sfxToggle = document.getElementById('sfx-toggle');

    if(soundMainBtn) {
        soundMainBtn.addEventListener('click', () => {
            audioSys.toggleMute();
        });
    }

    if(volSlider) {
        volSlider.addEventListener('input', (e) => {
            const val = e.target.value / 100; // 0 a 1
            audioSys.setMusicVolume(val);
        });
    }

    if(sfxToggle) {
        sfxToggle.addEventListener('change', (e) => {
            audioSys.toggleSFX(e.target.checked);
        });
    }

    restoreState();
});

// --- INTERACCIÓN CON LAS 3 COLUMNAS DEL HUB ---
columns.forEach(col => {
    
    // SONIDO HOVER
    col.addEventListener('mouseenter', () => {
        audioSys.playHover();
    });

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
        
        // Reproducir sonido característico
        if (sectionType === 'gamedev') audioSys.playGameDevOpen();
        if (sectionType === 'fullstack') audioSys.playFullStackOpen();
        if (sectionType === 'database') audioSys.playDatabaseOpen();

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
const infoBtn = document.getElementById('info-btn');
const infoModal = document.getElementById('info-modal');
const closeInfo = document.getElementById('close-info');

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

    saveState('hub');
    saveState('hub'); // Guardamos estado HUB
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
    saveState('intro');
});

// --- MODAL DE CONTACTO ---
contactBtn.addEventListener('click', () => { contactModal.classList.remove('hidden'); });
closeContact.addEventListener('click', () => { contactModal.classList.add('hidden'); });
window.addEventListener('click', (e) => { // Cerrar si clic fuera
    if (e.target === contactModal) contactModal.classList.add('hidden');
    if (e.target === infoModal) infoModal.classList.add('hidden');
});

// --- MODAL DE INFO ---
if(infoBtn && infoModal && closeInfo) {
    infoBtn.addEventListener('click', () => { infoModal.classList.remove('hidden'); });
    closeInfo.addEventListener('click', () => { infoModal.classList.add('hidden'); });
}

// --- BOTÓN VOLVER (De Proyectos al Hub) ---
backBtn.addEventListener('click', () => {
    saveState('hub');
    contentOverlay.classList.add('hidden');  // Guardamos estado HUB
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
    saveState(`details:${category}`); // Guardamos estado DETALLE
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

    // --- SECCIÓN ABOUT ME (CON EFECTO DE ESCRIBIR) ---
    if (aboutMeData[category]) {
        // Deducir color basado en la categoría para el borde
        let borderColor = 'white';
        if(category === 'gamedev') borderColor = 'var(--color-game)';
        if(category === 'fullstack') borderColor = 'var(--color-stack)';
        if(category === 'database') borderColor = 'var(--color-data)';

        htmlContent += `
            <div class="about-section" style="margin-bottom: 30px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 10px; border-left: 4px solid ${borderColor};">
                <h3 style="margin-bottom: 10px; color: white; font-family: 'Outfit', sans-serif;">Sobre este perfil</h3>
                <!-- Aquí usaremos el efecto de máquina de escribir -->
                <p id="typewriter-text" style="color: #ccc; line-height: 1.6; font-size: 1.05rem; min-height: 60px;"></p>
            </div>
        `;
    }

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
                <div class="community-msg">
                    "Entre todos somos una comunidad, ayúdame a ampliar mi portafolio. Dándole play a este juego me ayudas a poblar una base de datos para mostrar mis habilidades. ¡Gracias por jugar!"
                </div>
                
                <div class="difficulty-controls">
                    <button class="diff-btn" onclick="setDiff(150, this)">EASY</button>
                    <button class="diff-btn active" onclick="setDiff(100, this)">MID</button>
                    <button class="diff-btn" onclick="setDiff(60, this)">HARD</button>
                </div>

                <div class="game-score">SCORE: <span id="score">0</span></div>
                <canvas id="snake-canvas" width="300" height="300"></canvas>
                <button id="start-game-btn" class="game-btn" style="display:block;">JUGAR</button>
                <p class="game-instructions">Usa las flechas del teclado ⬆️⬇️⬅️➡️</p>
                <p id="game-over-msg" style="color:red; display:none; font-family:'Press Start 2P'; margin-top:10px;">GAME OVER</p>
                
                <!-- D-PAD MÓVIL INYECTADO -->
                <div class="mobile-controls">
                    <button class="pad-btn btn-up" data-dir="UP"><i class="fa-solid fa-arrow-up"></i></button>
                    <button class="pad-btn btn-left" data-dir="LEFT"><i class="fa-solid fa-arrow-left"></i></button>
                    <button class="pad-btn btn-down" data-dir="DOWN"><i class="fa-solid fa-arrow-down"></i></button>
                    <button class="pad-btn btn-right" data-dir="RIGHT"><i class="fa-solid fa-arrow-right"></i></button>
                </div>
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

    // 7. INICIAR EFECTO DE ESCRITURA
    if (aboutMeData[category]) {
        const typeEl = document.getElementById('typewriter-text');
        if(typeEl) typeWriter(typeEl, aboutMeData[category], 20);
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
    
    // Nivel de dificultad (velocidad)
    // Usamos window.gameSpeed si existe (seteado por los botones), si no default 100
    let dropInterval = window.gameSpeed || 100; 

    // Datos para Analítica (Database Profile Feature)
    let startTime = 0;
    let movesCount = 0;
    let maxSpeed = dropInterval; // La velocidad es constante ahora
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

    // LISTENER TÁCTIL (Móviles)
    document.querySelectorAll('.pad-btn').forEach(btn => {
        // Usamos 'touchstart' y 'click' para mejor respuesta
        const action = (e) => {
           if (!gameRunning) return;
           e.preventDefault(); // Evitar zoom/scroll
           const dir = btn.dataset.dir;
           
           // Replicamos la lógica de input
           const lastDir = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : d;
           if (dir === "LEFT" && lastDir === "RIGHT") return;
           if (dir === "RIGHT" && lastDir === "LEFT") return;
           if (dir === "UP" && lastDir === "DOWN") return;
           if (dir === "DOWN" && lastDir === "UP") return;
           if (dir === lastDir) return;

           if (inputQueue.length < 3) {
               inputQueue.push(dir);
               movesCount++; 
           }
        };

        btn.addEventListener('touchstart', action, {passive: false});
        btn.addEventListener('click', action);
    });

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
                    audioSys.playSnakeEat(); // Sonido moneda
                    
                    // Nueva posición de comida (que no caiga en la serpiente)
                    let validPos = false;
                    while(!validPos) {
                        food.x = Math.floor(Math.random() * 15) * box;
                        food.y = Math.floor(Math.random() * 15) * box;
                        validPos = !collision({x:food.x, y:food.y}, snake);
                    }

                    // Ahora la velocidad es fija según dificultad, no aumenta sola
                    // if(dropInterval > 60) dropInterval -= 1; 
                    // if (dropInterval < maxSpeed) maxSpeed = dropInterval;

                } else {
                    snake.pop(); // Si no comemos, quitamos la cola para avanzar
                }

                // --- GESTIÓN DE COLISIONES (GAME OVER) ---
                let newHead = { x: snakeX, y: snakeY };
                
                // 1. Chocar con paredes
                if(snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height) {
                    deathReason = "wall";
                    audioSys.playSnakeDie(); // Sonido muerte
                    gameOver();
                    return;
                }
                
                // 2. Chocar consigo mismo
                if(collision(newHead, snake)) {
                    deathReason = "self";
                    audioSys.playSnakeDie(); // Sonido muerte
                    gameOver();
                    return; 
                }

                snake.unshift(newHead); // Añadir nueva cabeza
            }
        }

        // --- DIBUJAR TODO (RENDER CYBER) ---
        
        // 1. Limpiar pantalla
        ctx.fillStyle = "#05080a"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 2. Dibujar Grid Holográfico
        ctx.strokeStyle = "#1a2a22";
        ctx.lineWidth = 1;
        for(let i=0; i<canvas.width; i+=box) {
            ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }

        // 3. Dibujar Comida (Hexágono Pulsante)
        food.pulse += 0.15;
        const glow = 15 + Math.sin(food.pulse) * 8;
        
        ctx.shadowBlur = glow;
        ctx.shadowColor = "#ff00cc";
        ctx.fillStyle = "#ff00cc";
        
        // Dibujamos un círculo en vez de cuadrado para la "energía"
        ctx.beginPath();
        let foodCenterX = food.x + box/2;
        let foodCenterY = food.y + box/2;
        ctx.arc(foodCenterX, foodCenterY, box/2 - 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset sombra

        // 4. Dibujar Serpiente (Segmentada)
        for(let i = 0; i < snake.length; i++) {
            let sX = snake[i].x;
            let sY = snake[i].y;

            // Cabeza
            if (i === 0) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = "#00ff9d";
                ctx.fillStyle = "#ffffff";
                
                // Forma de cabeza un poco redondeada
                ctx.beginPath();
                ctx.roundRect(sX, sY, box, box, 5);
                ctx.fill();
                
                // Ojos (para saber dirección)
                ctx.fillStyle = "#000";
                // Lógica simple para ojos según dirección podría ir aquí, 
                // pero por simplicidad dejamos dos puntos negros
                ctx.beginPath();
                ctx.arc(sX + 6, sY + 6, 2, 0, Math.PI*2);
                ctx.arc(sX + 14, sY + 6, 2, 0, Math.PI*2);
                ctx.fill();

            } else {
                // Cuerpo con gradiente o color sólido neón
                ctx.shadowBlur = 5;
                ctx.shadowColor = "rgba(0, 255, 157, 0.5)";
                ctx.fillStyle = "#00ff9d";
                
                // Segmento un poquito más pequeño que la caja para dar efecto "spine"
                ctx.fillRect(sX + 2, sY + 2, box - 4, box - 4);
            }
        }

        // 5. Dibujar Partículas
        particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.05;

            if(p.life <= 0) {
                particles.splice(index, 1);
            } else {
                ctx.globalAlpha = p.life;
                ctx.shadowBlur = 10;
                ctx.shadowColor = p.color;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size);
                ctx.globalAlpha = 1.0;
                ctx.shadowBlur = 0;
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
                // Determinar string de dificultad basado en gameSpeed
                let diffLabel = "MEDIUM";
                if(window.gameSpeed >= 150) diffLabel = "EASY";
                if(window.gameSpeed <= 60) diffLabel = "HARD";

                sendDataToBackend(name, score, duration, movesCount, maxSpeed, deathReason, diffLabel);
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
    async function sendDataToBackend(name, score, duration, moves, speed, death, difficulty) {
        
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
            difficulty: difficulty,
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

// ==========================================
// 8. HELPERS GLOBALES (Dificultad)
// ==========================================
window.gameSpeed = 100; // Por defecto Medio

window.setDiff = function(speed, btn) {
    window.gameSpeed = speed;
    
    // Actualizar UI
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Enfocar el canvas para que no haya que hacer clic para jugar
    const canvas = document.getElementById('snake-canvas');
    if(canvas) canvas.focus();
};

function typeWriter(element, text, speed) {
    element.innerHTML = ""; 
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}
