import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAET4HYHSff1xENxe74UZuuGnc4k0JLF58",
  authDomain: "luxpower123-69630.firebaseapp.com",
  databaseURL: "https://luxpower123-69630-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "luxpower123-69630",
  storageBucket: "luxpower123-69630.firebasestorage.app",
  messagingSenderId: "7736379752",
  appId: "1:7736379752:web:3d04c6be0194569dc06edd",
  measurementId: "G-TXQ6RSGVZB"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const systemRef = ref(database, 'system_data');

// ========== PARTICLE SYSTEM ==========
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = -1000;
        this.mouseY = -1000;
        this.isDark = true;
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
    }

    createParticles() {
        this.particles = [];
        const count = Math.min(80, Math.floor(window.innerWidth * window.innerHeight / 12000));
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2.5 + 0.5,
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: (Math.random() - 0.5) * 0.4,
                opacity: Math.random() * 0.5 + 0.1,
                hue: Math.random() * 60 + (document.body.classList.contains('theme-cyber') ? 180 : document.body.classList.contains('theme-synthwave') ? 320 : 240)
            });
        }
    }

    animate() {
        const theme = document.body.classList.contains('theme-light') ? 'light' :
                      document.body.classList.contains('theme-cyber') ? 'cyber' :
                      document.body.classList.contains('theme-rosegold') ? 'rosegold' :
                      document.body.classList.contains('theme-nature') ? 'nature' :
                      document.body.classList.contains('theme-glass') ? 'glass' :
                      document.body.classList.contains('theme-synthwave') ? 'synthwave' :
                      document.body.classList.contains('theme-cyberpunk') ? 'cyberpunk' :
                      document.body.classList.contains('theme-ocean') ? 'ocean' :
                      document.body.classList.contains('theme-sunset') ? 'sunset' :
                      document.body.classList.contains('theme-hacker') ? 'hacker' :
                      document.body.classList.contains('theme-win11') ? 'win11' :
                      document.body.classList.contains('theme-win10') ? 'win10' : 'dark';
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let p of this.particles) {
            // Move
            p.x += p.speedX;
            p.y += p.speedY;

            // Wrap around
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // Mouse interaction - gentle push away
            const dx = this.mouseX - p.x;
            const dy = this.mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150 * 0.3;
                p.x -= dx / dist * force;
                p.y -= dy / dist * force;
            }

            // Color based on theme
            let color;
            if (theme === 'light') {
                color = `hsla(${p.hue - 40}, 50%, 50%, ${p.opacity * 0.5})`;
            } else if (theme === 'cyber') {
                color = `hsla(195, 100%, 60%, ${p.opacity * 0.7})`;
            } else if (theme === 'rosegold') {
                color = `hsla(35, 60%, 55%, ${p.opacity * 0.6})`;
            } else if (theme === 'nature') {
                color = `hsla(120, 60%, 50%, ${p.opacity * 0.6})`;
            } else if (theme === 'glass') {
                color = `hsla(240, 60%, 70%, ${p.opacity * 0.5})`;
            } else if (theme === 'synthwave') {
                color = `hsla(320, 80%, 60%, ${p.opacity * 0.6})`;
            } else if (theme === 'cyberpunk') {
                color = `hsla(45, 100%, 50%, ${p.opacity * 0.6})`;
            } else if (theme === 'ocean') {
                color = `hsla(175, 70%, 55%, ${p.opacity * 0.6})`;
            } else if (theme === 'sunset') {
                color = `hsla(35, 90%, 55%, ${p.opacity * 0.6})`;
            } else if (theme === 'hacker') {
                color = `hsla(120, 100%, 50%, ${p.opacity * 0.7})`;
            } else if (theme === 'win10') {
                color = `hsla(210, 100%, 45%, ${p.opacity * 0.35})`;
            } else if (theme === 'win11') {
                color = `hsla(210, 100%, 55%, ${p.opacity * 0.35})`;
            } else {
                color = `hsla(${p.hue}, 60%, 70%, ${p.opacity})`;
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();

            // Connection lines to nearby particles
            for (let p2 of this.particles) {
                if (p === p2) continue;
                const dx2 = p.x - p2.x;
                const dy2 = p.y - p2.y;
                const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                if (dist2 < 120) {
                    const opacity = (120 - dist2) / 120 * 0.15 * p.opacity;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = theme === 'light' 
                        ? `rgba(100, 100, 200, ${opacity * 0.3})`
                        : theme === 'cyber'
                            ? `rgba(0, 200, 255, ${opacity * 0.5})`
                        : theme === 'rosegold'
                            ? `rgba(212, 160, 86, ${opacity * 0.5})`
                        : theme === 'nature'
                            ? `rgba(16, 185, 129, ${opacity * 0.5})`
                        : theme === 'glass'
                            ? `rgba(129, 140, 248, ${opacity * 0.5})`
                        : theme === 'synthwave'
                            ? `rgba(255, 45, 149, ${opacity * 0.5})`
                        : theme === 'cyberpunk'
                            ? `rgba(255, 215, 0, ${opacity * 0.5})`
                        : theme === 'ocean'
                            ? `rgba(45, 212, 191, ${opacity * 0.5})`
                        : theme === 'sunset'
                            ? `rgba(251, 191, 36, ${opacity * 0.5})`
                        : theme === 'hacker'
                            ? `rgba(0, 255, 65, ${opacity * 0.5})`
                        : theme === 'win10'
                            ? `rgba(0, 120, 215, ${opacity * 0.3})`
                        : theme === 'win11'
                            ? `rgba(0, 120, 212, ${opacity * 0.3})`
                            : `rgba(200, 200, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }

    refresh() {
        this.createParticles();
    }
}

// ========== TOAST NOTIFICATION SYSTEM ==========
class ToastSystem {
    constructor() {
        this.container = document.getElementById('toastContainer');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toastContainer';
            document.body.appendChild(this.container);
        }
    }

    show(title, message, type = 'success', duration = 4000) {
        const icons = {
            success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>',
            warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
            error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.success}</div>
            <div class="toast-body">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.closest('.toast').classList.add('removing'); setTimeout(() => this.closest('.toast').remove(), 300)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        this.container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    success(title, message) { this.show(title, message, 'success'); }
    warning(title, message) { this.show(title, message, 'warning', 5000); }
    error(title, message) { this.show(title, message, 'error', 6000); }
}

// ========== RADIAL BATTERY GAUGE ==========
class RadialGauge {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.value = 0;
        this.targetValue = 0;
        this.size = 100;
        this.draw();
    }

    setValue(value) {
        this.targetValue = Math.max(0, Math.min(100, value));
        if (this.value === 0 && this.targetValue > 0) {
            this.value = this.targetValue;
        }
        this.draw();
    }

    draw() {
        const canvas = this.canvas;
        const dpr = window.devicePixelRatio || 1;
        const size = this.size * dpr;
        canvas.width = size;
        canvas.height = size;
        canvas.style.width = this.size + 'px';
        canvas.style.height = this.size + 'px';

        const ctx = this.ctx;
        const cx = size / 2;
        const cy = size / 2;
        const radius = size / 2 - 8 * dpr;
        const lineWidth = 10 * dpr;

        ctx.clearRect(0, 0, size, size);

        // Background ring
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        // Value ring
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (this.targetValue / 100) * Math.PI * 2;

        const isLight = document.body.classList.contains('theme-light');
        const isCyber = document.body.classList.contains('theme-cyber');

        let gradient;
        if (isCyber) {
            gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, '#0891b2');
            gradient.addColorStop(0.5, '#22d3ee');
            gradient.addColorStop(1, '#67e8f9');            } else if (isLight) {
                gradient = ctx.createLinearGradient(0, 0, size, size);
                gradient.addColorStop(0, '#059669');
                gradient.addColorStop(0.5, '#10b981');
                gradient.addColorStop(1, '#34d399');
            } else if (document.body.classList.contains('theme-rosegold')) {
                gradient = ctx.createLinearGradient(0, 0, size, size);
                gradient.addColorStop(0, '#b8860b');
                gradient.addColorStop(0.5, '#d4a056');
                gradient.addColorStop(1, '#f5d6a0');
            } else if (document.body.classList.contains('theme-nature')) {
                gradient = ctx.createLinearGradient(0, 0, size, size);
                gradient.addColorStop(0, '#047857');
                gradient.addColorStop(0.5, '#34d399');
                gradient.addColorStop(1, '#6ee7b7');
            } else if (document.body.classList.contains('theme-glass')) {
                gradient = ctx.createLinearGradient(0, 0, size, size);
                gradient.addColorStop(0, '#6366f1');
                gradient.addColorStop(0.5, '#818cf8');
                gradient.addColorStop(1, '#a5b4fc');
            } else if (document.body.classList.contains('theme-synthwave')) {
                gradient = ctx.createLinearGradient(0, 0, size, size);
                gradient.addColorStop(0, '#ff2d95');
                gradient.addColorStop(0.5, '#ff6bc1');
                gradient.addColorStop(1, '#00fff7');
            } else if (document.body.classList.contains('theme-cyberpunk')) {
                gradient = ctx.createLinearGradient(0, 0, size, size);
                gradient.addColorStop(0, '#ffd700');
                gradient.addColorStop(0.5, '#ffab00');
                gradient.addColorStop(1, '#00e5ff');
            } else if (document.body.classList.contains('theme-ocean')) {
                gradient = ctx.createLinearGradient(0, 0, size, size);
                gradient.addColorStop(0, '#0ea5e9');
                gradient.addColorStop(0.5, '#2dd4bf');
                gradient.addColorStop(1, '#5eead4');
            } else if (document.body.classList.contains('theme-sunset')) {
                gradient = ctx.createLinearGradient(0, 0, size, size);
                gradient.addColorStop(0, '#f59e0b');
                gradient.addColorStop(0.5, '#ec4899');
                gradient.addColorStop(1, '#8b5cf6');
            } else if (document.body.classList.contains('theme-hacker')) {
                gradient = ctx.createLinearGradient(0, 0, size, size);
                gradient.addColorStop(0, '#00aa00');
                gradient.addColorStop(0.5, '#00ff41');
                gradient.addColorStop(1, '#00e5ff');
            } else if (document.body.classList.contains('theme-win10')) {
                gradient = ctx.createLinearGradient(0, 0, size, size);
                gradient.addColorStop(0, '#0078d7');
                gradient.addColorStop(0.5, '#4fc3f7');
                gradient.addColorStop(1, '#8ab4f8');
            } else if (document.body.classList.contains('theme-win11')) {
                gradient = ctx.createLinearGradient(0, 0, size, size);
                gradient.addColorStop(0, '#0078d4');
                gradient.addColorStop(0.5, '#60cdff');
                gradient.addColorStop(1, '#8ab4f8');
            } else {
            gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, '#10ac84');
            gradient.addColorStop(0.5, '#1dd1a1');
            gradient.addColorStop(1, '#55efc4');
        }

        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Glow effect
        if (this.targetValue > 0) {
            ctx.beginPath();
            ctx.arc(cx, cy, radius, startAngle, endAngle);
            ctx.strokeStyle = isCyber 
                ? 'rgba(34, 211, 238, 0.2)' 
                : document.body.classList.contains('theme-rosegold')
                    ? 'rgba(212, 160, 86, 0.2)'
                    : document.body.classList.contains('theme-nature')
                        ? 'rgba(16, 185, 129, 0.2)'
                    : document.body.classList.contains('theme-glass')
                        ? 'rgba(129, 140, 248, 0.2)'
                    : document.body.classList.contains('theme-synthwave')
                        ? 'rgba(255, 45, 149, 0.2)'
                    : document.body.classList.contains('theme-cyberpunk')
                        ? 'rgba(255, 215, 0, 0.2)'
                    : document.body.classList.contains('theme-ocean')
                        ? 'rgba(45, 212, 191, 0.2)'
                    : document.body.classList.contains('theme-sunset')
                        ? 'rgba(251, 191, 36, 0.2)'
                    : document.body.classList.contains('theme-hacker')
                        ? 'rgba(0, 255, 65, 0.2)'
                    : document.body.classList.contains('theme-win10')
                        ? 'rgba(0, 120, 215, 0.2)'
                    : document.body.classList.contains('theme-win11')
                        ? 'rgba(0, 120, 212, 0.2)'
                        : 'rgba(29, 209, 161, 0.2)';
            ctx.lineWidth = lineWidth + 4 * dpr;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    }
}

// ========== SPARKLINE MINI CHARTS ==========
class SparklineManager {
    constructor() {
        this.containers = document.querySelectorAll('.sparkline-wrapper');
        this.dataMap = new Map();
        this.init();
    }

    init() {
        this.containers.forEach(container => {
            const id = container.dataset.sparkline;
            if (id) {
                this.dataMap.set(id, []);
            }
        });
    }

    pushData(id, value) {
        if (!this.dataMap.has(id)) return;
        const data = this.dataMap.get(id);
        data.push(value);
        if (data.length > 30) data.shift();
        this.draw(id);
    }

    draw(id) {
        const container = document.querySelector(`.sparkline-wrapper[data-sparkline="${id}"]`);
        if (!container) return;
        
        const data = this.dataMap.get(id) || [];
        if (data.length < 2) return;

        const width = container.offsetWidth || 180;
        const height = container.offsetHeight || 32;

        let svg = container.querySelector('svg');
        if (!svg) {
            svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
            svg.setAttribute('preserveAspectRatio', 'none');
            container.appendChild(svg);
        }

        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const padding = 2;
        const w = width - padding * 2;
        const h = height - padding * 2;

        const points = data.map((v, i) => {
            const x = padding + (i / (data.length - 1)) * w;
            const y = padding + h - ((v - min) / range) * h;
            return `${x},${y}`;
        }).join(' ');

        const isCyber = document.body.classList.contains('theme-cyber');
        const strokeColor = container.dataset.color || (isCyber ? '#22d3ee' : '#54a0ff');
        const fillColor = container.dataset.fill || (isCyber ? 'rgba(34, 211, 238, 0.08)' : 'rgba(84, 160, 255, 0.08)');

        // Area fill
        const areaPoints = `${padding},${height - padding} ${points} ${padding + w},${height - padding}`;

        svg.innerHTML = `
            <defs>
                <linearGradient id="sparkFill_${id}" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.2"/>
                    <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.02"/>
                </linearGradient>
            </defs>
            <polygon points="${areaPoints}" fill="url(#sparkFill_${id})"/>
            <polyline points="${points}" fill="none" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        `;
    }
}

// ========== AMBIENT GLOW ==========
class AmbientGlow {
    constructor() {
        this.element = document.getElementById('ambientGlow');
        if (!this.element) {
            this.element = document.createElement('div');
            this.element.id = 'ambientGlow';
            document.body.appendChild(this.element);
        }
        this.targetX = window.innerWidth / 2;
        this.targetY = window.innerHeight / 2;
        this.smoothX = window.innerWidth / 2;
        this.smoothY = window.innerHeight / 2;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
        });
        this.animate();
    }

    animate() {
        this.smoothX += (this.targetX - this.smoothX) * 0.05;
        this.smoothY += (this.targetY - this.smoothY) * 0.05;

        this.element.style.left = this.smoothX + 'px';
        this.element.style.top = this.smoothY + 'px';

        requestAnimationFrame(() => this.animate());
    }
}

// ========== 3D CARD TILT ==========
class CardTilt {
    constructor() {
        this.cards = document.querySelectorAll('.summary-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.onMove(e, card));
            card.addEventListener('mouseleave', (e) => this.onLeave(e, card));
            card.addEventListener('mouseenter', (e) => this.onEnter(e, card));
        });
    }

    onEnter(e, card) {
        card.classList.add('tilt-active');
    }

    onMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    }

    onLeave(e, card) {
        card.classList.remove('tilt-active');
        card.style.transform = '';
    }
}

// ========== ANIMATED COUNTER ==========
class AnimatedCounter {
    constructor() {
        this.elements = document.querySelectorAll('[data-counter]');
    }

    animateElement(el, targetValue) {
        const duration = 800;
        const startTime = performance.now();
        const startValue = parseFloat(el.dataset.currentValue || '0');
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            
            const current = startValue + (targetValue - startValue) * eased;
            
            if (el.dataset.counterFormat === 'int') {
                el.textContent = Math.round(current).toString();
            } else if (el.dataset.counterFormat === 'decimal') {
                el.textContent = current.toFixed(1);
            } else {
                el.textContent = current.toFixed(0);
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                el.dataset.currentValue = targetValue.toString();
            }
        };
        
        requestAnimationFrame(animate);
    }

    updateValue(id, value) {
        const el = document.querySelector(`[data-counter="${id}"]`);
        if (el) {
            this.animateElement(el, value);
        }
    }
}

// ========== PARALLAX SCROLL ==========
class ParallaxScroll {
    constructor() {
        this.scrollY = window.scrollY;
        this.rafId = null;
        this.orbs = [];
        this.ambientGlow = null;
        this.particleCanvas = null;
        this.init();
    }

    init() {
        // Only target fixed-position background elements that DON'T have conflicting transforms
        // Orbs use `top` CSS property (not transform) to avoid conflicts with float animations
        for (let i = 1; i <= 3; i++) {
            const el = document.getElementById('glassOrb' + i);
            if (el) {
                this.orbs.push({
                    el,
                    speed: [0.08, 0.12, 0.10][i - 1],
                    originTop: parseFloat(getComputedStyle(el).top) || 0
                });
            }
        }

        // Ambient glow - no existing transform animation, safe to use translateY
        this.ambientGlow = document.getElementById('ambientGlow');

        // Particle canvas - no existing transform animation, safe to use translateY
        this.particleCanvas = document.getElementById('particleCanvas');

        // Bind scroll handler (passive for performance)
        window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
        
        // Initial apply
        this.update();
    }

    onScroll() {
        this.scrollY = window.scrollY;
        if (!this.rafId) {
            this.rafId = requestAnimationFrame(() => this.update());
        }
    }

    update() {
        this.rafId = null;
        const sy = this.scrollY;

        // Orbs: use `top` to avoid conflicting with floating transform animations
        this.orbs.forEach(orb => {
            const offset = sy * orb.speed;
            orb.el.style.top = (orb.originTop - offset) + 'px';
        });

        // Ambient glow: subtle translateY (no existing animation on this element)
        if (this.ambientGlow) {
            const offset = sy * 0.15;
            this.ambientGlow.style.transform = `translateY(${-offset}px)`;
        }

        // Particle canvas: subtle translateY
        if (this.particleCanvas) {
            const offset = sy * 0.12;
            this.particleCanvas.style.transform = `translateY(${-offset}px)`;
        }
    }

    refresh() {
        // Re-read origin tops for orbs (in case theme change affects positioning)
        this.orbs.forEach(orb => {
            orb.originTop = parseFloat(getComputedStyle(orb.el).top) || 0;
        });
    }
}

// ========== BUTTON RIPPLE ==========
function initButtonRipple() {
    document.querySelectorAll('.settings-btn, .btn').forEach(btn => {
        btn.addEventListener('mousedown', function(e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
            const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
            this.style.setProperty('--ripple-x', x + '%');
            this.style.setProperty('--ripple-y', y + '%');
        });
    });
}


document.addEventListener("DOMContentLoaded", () => {
    // ========== INIT LUXURY FEATURES ==========
    const particles = new ParticleSystem('particleCanvas');
    const toastSystem = new ToastSystem();
    const ambientGlow = new AmbientGlow();
    const sparklines = new SparklineManager();
    const counter = new AnimatedCounter();
    const radialGauge = new RadialGauge('radialGauge');
    
    // Expose to global scope
    window.__toast = toastSystem;
    window.__sparklines = sparklines;
    window.__counter = counter;
    window.__radialGauge = radialGauge;
    window.__particles = particles;
    // ========== INTERNATIONALIZATION (i18n) ==========
    const translations = {
        en: {
            // Header
            header_subtitle: "Local Inverter Monitor",
            last_updated: "Last updated:",
            // Solar card
            solar_title: "Solar Production",
            todays_energy: "Today's Energy:",
            home_usage: "🏠 Home Usage:",
            consumption_today: "Today Consumption:",
            // Battery card
            battery_title: "Battery Status",
            voltage: "Voltage:",
            current: "Current:",
            temperature: "Temperature:",
            today_charged: "Today Charged:",
            today_discharged: "Today Discharged:",
            bat_charging: "CHARGING",
            bat_discharging: "DISCHARGING",
            bat_idle: "IDLE",
            charge_time_prefix: "To Full: ",
            discharge_time_prefix: "Remaining: ",
            idle_time_text: "No charge/discharge",
            // Grid card
            grid_title: "Grid Connection",
            frequency: "Frequency:",
            power_factor: "Power Factor:",
            today_imported: "Today Imported:",
            today_exported: "Today Exported:",
            total_import: "Total Import:",
            total_export: "Total Export:",
            grid_importing: "IMPORTING",
            grid_exporting: "EXPORTING",
            grid_connected: "CONNECTED",
            // Home Load card
            homeload_title: "Home Load",
            apparent_power: "Apparent Power:",
            load_voltage: "Load Voltage:",
            inverter_temp: "Inverter Temp:",
            today_home_consumption: "Today Home Consumption:",
            today_grid_import: "Today Grid Import:",
            today_eps_consumption: "Today EPS Consumption:",
            // Chart
            chart_title: "Power Analytics (Live Trends)",
            chart_solar: "Solar PV (W)",
            chart_load: "Home Load (W)",
            chart_battery: "Battery SOC (%)",
            chart_y_power: "Power (Watts)",
            chart_y_battery: "Battery %",
            // Settings modal
            settings_title: "Connection Settings",

            language_label: "Language / Ngôn ngữ",
            language_option_en: "English",
            language_option_vi: "Vietnamese",
            language_helper: "Choose the display language for this dashboard.",
            theme_label: "Theme",
            theme_dark: "Dark",
            theme_light: "Light",
            theme_cyber: "Cyber",
            theme_rosegold: "Rose Gold",
            theme_nature: "Nature",                            theme_glass: "Glass",
                            theme_synthwave: "Synthwave",
                            theme_cyberpunk: "Cyberpunk",
                            theme_ocean: "Ocean",
                            theme_sunset: "Sunset",
                            theme_hacker: "Hacker",
                            theme_win10: "Windows 10",
                            theme_win11: "Windows 11",
                            theme_system: "System",
            dongle_ip_label: "Wi-Fi Dongle IP Address",
            port_label: "Port",
            poll_interval_label: "Poll Interval (s)",
            dongle_serial_label: "Wi-Fi Dongle Serial (10 chars)",
            inverter_serial_label: "Inverter Serial (10 chars)",
            demo_mode_label: "Enable Simulated Demo Mode",
            battery_settings_title: "Battery & Efficiency Config",
            battery_capacity_label: "Battery Capacity (Ah)",
            soc_cutoff_label: "Discharge Cutoff SOC (%)",
            inverter_efficiency_label: "Inverter Efficiency (%)",
            cancel_btn: "Cancel",
            save_btn: "Save Settings"
        },
        vi: {
            // Header
            header_subtitle: "Giám sát Inverter",
            last_updated: "",
            // Solar card
            solar_title: "Sản lượng Solar",
            todays_energy: "Năng lượng hôm nay:",
            home_usage: "🏠 Nhà đang dùng:",
            consumption_today: "Tiêu thụ hôm nay:",
            // Battery card
            battery_title: "Trạng thái Pin",
            voltage: "Điện áp:",
            current: "Dòng điện:",
            temperature: "Nhiệt độ:",
            today_charged: "Sạc hôm nay:",
            today_discharged: "Xả hôm nay:",
            bat_charging: "ĐANG SẠC",
            bat_discharging: "ĐANG XẢ",
            bat_idle: "CHỜ",
            charge_time_prefix: "Sạc đầy: ",
            discharge_time_prefix: "Còn dùng: ",
            idle_time_text: "Chế độ chờ",
            // Grid card
            grid_title: "Kết nối lưới điện",
            frequency: "Tần số:",
            power_factor: "Hệ số CS:",
            today_imported: "Nhập hôm nay:",
            today_exported: "Xuất hôm nay:",
            total_import: "Tổng Import:",
            total_export: "Tổng Export:",
            grid_importing: "ĐANG NHẬP",
            grid_exporting: "ĐANG XUẤT",
            grid_connected: "KẾT NỐI",
            // Home Load card
            homeload_title: "Tải nhà",
            apparent_power: "CS biểu kiến:",
            load_voltage: "Điện áp tải:",
            inverter_temp: "Nhiệt độ Inverter:",
            today_home_consumption: "Tiêu thụ nhà hôm nay:",
            today_grid_import: "Nhập lưới hôm nay:",
            today_eps_consumption: "Tiêu thụ EPS hôm nay:",
            // Chart
            chart_title: "Phân tích công suất (Thời gian thực)",
            chart_solar: "Solar PV (W)",
            chart_load: "Tải nhà (W)",
            chart_battery: "Pin SOC (%)",
            chart_y_power: "Công suất (W)",
            chart_y_battery: "Pin %",
            // Settings modal
            settings_title: "Cài đặt kết nối",

            language_label: "Language / Ngôn ngữ",
            language_option_en: "Tiếng Anh",
            language_option_vi: "Tiếng Việt",
            language_helper: "Chọn ngôn ngữ hiển thị cho giao diện.",
            theme_label: "Giao diện",
            theme_dark: "Tối",
            theme_light: "Sáng",
            theme_cyber: "Cyber",
            theme_rosegold: "Rose Gold",
            theme_nature: "Nature",                            theme_glass: "Glass",
                            theme_synthwave: "Synthwave",
                            theme_cyberpunk: "Cyberpunk",
                            theme_ocean: "Đại dương",
                            theme_sunset: "Hoàng hôn",
                            theme_hacker: "Hacker",
                            theme_win10: "Windows 10",
                            theme_win11: "Windows 11",
                            theme_system: "Theo hệ thống",
            dongle_ip_label: "Địa chỉ IP Dongle Wi-Fi",
            port_label: "Cổng",
            poll_interval_label: "Chu kỳ cập nhật (s)",
            dongle_serial_label: "Serial Dongle Wi-Fi (10 ký tự)",
            inverter_serial_label: "Serial Inverter (10 ký tự)",
            demo_mode_label: "Bật chế độ Demo mô phỏng",
            battery_settings_title: "Cấu hình Pin & Hiệu suất",
            battery_capacity_label: "Dung lượng Pin (Ah)",
            soc_cutoff_label: "Ngưỡng ngắt xả (%)",
            inverter_efficiency_label: "Hiệu suất biến tần (%)",
            cancel_btn: "Hủy",
            save_btn: "Lưu cài đặt"
        }
    };

    // Get saved language or default to Vietnamese
    let currentLang = localStorage.getItem("luxpower_lang") || "vi";

    function t(key) {
        if (translations[currentLang] && translations[currentLang][key] !== undefined) {
            return translations[currentLang][key];
        }
        return translations.en[key] || key;
    }

    let lastInverterMetrics = null;

    function formatRemainingTime(totalMinutes) {
        if (!isFinite(totalMinutes) || totalMinutes < 0) return "--";
        
        const m = totalMinutes % 60;
        const totalHours = Math.floor(totalMinutes / 60);
        const isVi = currentLang === "vi";
        
        if (totalHours >= 24) {
            const d = Math.floor(totalHours / 24);
            const h = totalHours % 24;
            const dayLabel = isVi ? "ngày" : (d === 1 ? "day" : "days");
            const hourLabel = isVi ? "giờ" : (h === 1 ? "hour" : "hours");
            
            let result = `${d} ${dayLabel}`;
            if (h > 0) {
                result += ` ${h} ${hourLabel}`;
            }
            return result;
        } else if (totalHours > 0) {
            const hourLabel = isVi ? "giờ" : (totalHours === 1 ? "hour" : "hours");
            const minLabel = isVi ? "phút" : (m === 1 ? "min" : "mins");
            
            let result = `${totalHours} ${hourLabel}`;
            if (m > 0) {
                result += ` ${m} ${minLabel}`;
            }
            return result;
        } else {
            const minLabel = isVi ? "phút" : (m === 1 ? "min" : "mins");
            return `${m} ${minLabel}`;
        }
    }

    function updateChargeTimePrediction(metrics) {
        if (!chargeTimeBar || !chargeTimeText || !metrics) return;
        
        const soc = metrics.soc !== undefined ? metrics.soc : 0;
        const v_bat = metrics.v_bat || 51.2; // V
        const p_charge = Math.abs(metrics.p_charge || 0);
        const p_discharge = Math.abs(metrics.p_discharge || 0);

        // Retrieve config preferences from localStorage with defaults
        const savedCapacity = parseInt(localStorage.getItem("luxpower_bat_capacity"));
        const capacity = (!isNaN(savedCapacity) && savedCapacity > 0) ? savedCapacity : 314;
        
        const savedCutoff = parseInt(localStorage.getItem("luxpower_soc_cutoff"));
        const soc_cutoff = (!isNaN(savedCutoff) && savedCutoff >= 0) ? savedCutoff : 25;
        
        const savedEfficiency = parseFloat(localStorage.getItem("luxpower_inverter_efficiency"));
        const efficiency = (!isNaN(savedEfficiency) && savedEfficiency > 0) ? savedEfficiency : 0.95;

        if (p_charge > 0) {
            const remainingSoc = 100 - soc;
            if (remainingSoc <= 0) {
                chargeTimeText.innerText = currentLang === "vi" ? "Đầy pin" : "Battery Full";
                chargeTimeBar.style.width = "100%";
                chargeTimeBar.style.background = "linear-gradient(90deg, #10ac84, var(--color-battery, #2ecc71))";
            } else {
                const remainingWh = (capacity * v_bat) * (remainingSoc / 100);
                const hours = remainingWh / p_charge;
                if (isFinite(hours) && hours > 0) {
                    const totalMinutes = Math.round(hours * 60);
                    const timeStr = formatRemainingTime(totalMinutes);
                    const prefix = t("charge_time_prefix");
                    chargeTimeText.innerText = `${prefix}${timeStr}`;
                } else {
                    const prefix = t("charge_time_prefix");
                    chargeTimeText.innerText = `${prefix}--`;
                }
                chargeTimeBar.style.width = `${soc}%`;
                chargeTimeBar.style.background = "linear-gradient(90deg, #0be881, #05c46b)";
            }
        } else if (p_discharge > 0) {
            const deltaSoc = soc - soc_cutoff;
            if (deltaSoc <= 0) {
                chargeTimeText.innerText = currentLang === "vi" ? "Hết pin (Chạm ngưỡng ngắt)" : "Battery Empty (Cutoff Reached)";
                chargeTimeBar.style.width = "0%";
                chargeTimeBar.style.background = "linear-gradient(90deg, #ff3f34, #ea2027)";
            } else {
                const remainingWh = (capacity * v_bat) * (deltaSoc / 100) * efficiency;
                const hours = remainingWh / p_discharge;
                if (isFinite(hours) && hours > 0) {
                    const totalMinutes = Math.round(hours * 60);
                    const timeStr = formatRemainingTime(totalMinutes);
                    const prefix = t("discharge_time_prefix");
                    chargeTimeText.innerText = `${prefix}${timeStr}`;
                } else {
                    const prefix = t("discharge_time_prefix");
                    chargeTimeText.innerText = `${prefix}--`;
                }
                // Usable percent of the remaining range
                const usablePercent = Math.max(0, Math.min(100, Math.round((deltaSoc / (100 - soc_cutoff)) * 100)));
                chargeTimeBar.style.width = `${usablePercent}%`;
                chargeTimeBar.style.background = "linear-gradient(90deg, #ffaf40, #ff9f1a)";
            }
        } else {
            chargeTimeText.innerText = t("idle_time_text");
            chargeTimeBar.style.width = `${soc}%`;
            chargeTimeBar.style.background = "linear-gradient(90deg, #778ca3, #4b6584)";
        }
    }


    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem("luxpower_lang", lang);
        document.documentElement.lang = lang;

        // Update all elements with data-i18n attribute
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            const translated = t(key);
            if (translated) el.textContent = translated;
        });

        // Update chart labels if chart exists
        if (liveChart) {
            liveChart.data.datasets[0].label = t("chart_solar");
            liveChart.data.datasets[1].label = t("chart_load");
            liveChart.data.datasets[2].label = t("chart_battery");
            liveChart.options.scales.y.title.text = t("chart_y_power");
            liveChart.options.scales.y1.title.text = t("chart_y_battery");
            liveChart.update();
        }

        // Update language selector if it exists
        const langSelect = document.getElementById("ui_language");
        if (langSelect) langSelect.value = lang;

        // Update predictions translations
        if (lastInverterMetrics) {
            updateChargeTimePrediction(lastInverterMetrics);
        }
    }

    // ========== DOM Elements ==========
    const statusBadge = document.getElementById("statusBadge");
    const statusText = document.getElementById("statusText");
    const simulatedBadge = document.getElementById("simulatedBadge");
    const updateTime = document.getElementById("updateTime");
    const openSettingsBtn = document.getElementById("openSettingsBtn");
    const closeSettingsBtn = document.getElementById("closeSettingsBtn");
    const cancelSettingsBtn = document.getElementById("cancelSettingsBtn");
    const settingsModal = document.getElementById("settingsModal");
    const settingsForm = document.getElementById("settingsForm");
    const toggleChartBtn = document.getElementById("toggleChartBtn");
    
    // Solar Metrics
    const valSolarPower = document.getElementById("valSolarPower");
    const valSolarEnergy = document.getElementById("valSolarEnergy");
    const valPV1 = document.getElementById("valPV1");
    const valPV2 = document.getElementById("valPV2");
    const valHomeUsageW = document.getElementById("valHomeUsageW");
    const valHomeConsumDay = document.getElementById("valHomeConsumDay");
    
    // Battery Metrics
    const socBar = document.getElementById("socBar");
    const valSOC = document.getElementById("valSOC");
    const valBatPower = document.getElementById("valBatPower");
    const valBatStatus = document.getElementById("valBatStatus");
    const valBatVolt = document.getElementById("valBatVolt");
    const valBatCurr = document.getElementById("valBatCurr");
    const valBatTemp = document.getElementById("valBatTemp");
    const valBatChgDay = document.getElementById("valBatChgDay");
    const valBatDischgDay = document.getElementById("valBatDischgDay");
    const chargeTimeBar = document.getElementById("chargeTimeBar");
    const chargeTimeText = document.getElementById("chargeTimeText");
    
    // Grid Metrics
    const valGridPower = document.getElementById("valGridPower");
    const valGridStatus = document.getElementById("valGridStatus");
    const valGridVolt = document.getElementById("valGridVolt");
    const valGridFreq = document.getElementById("valGridFreq");
    const valGridPF = document.getElementById("valGridPF");
    const valGridImpDay = document.getElementById("valGridImpDay");
    const valGridExpDay = document.getElementById("valGridExpDay");
    
    // Home Load Metrics
    const valLoadPower = document.getElementById("valLoadPower");
    const valLoadVA = document.getElementById("valLoadVA");
    const valLoadVolt = document.getElementById("valLoadVolt");
    const valInvTemp = document.getElementById("valInvTemp");
    const valLoadEnergy = document.getElementById("valLoadEnergy");
    const valHomeGridImport = document.getElementById("valHomeGridImport");
    const valEPSEnergy = document.getElementById("valEPSEnergy");

    // Chart reference (declared early to avoid TDZ issues in theme code)
    let liveChart = null;
    // ========== Theme Toggle (Dark / Light / Cyber / System) ==========
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const themeIconSun = document.querySelector(".theme-icon-sun");
    const themeIconMoon = document.querySelector(".theme-icon-moon");
    const themeIconCyber = document.querySelector(".theme-icon-cyber");
    const themeIconRosegold = document.querySelector(".theme-icon-rosegold");
    const themeIconNature = document.querySelector(".theme-icon-nature");
    const themeIconGlass = document.querySelector(".theme-icon-glass");
    const themeIconSynthwave = document.querySelector(".theme-icon-synthwave");
    const themeIconCyberpunk = document.querySelector(".theme-icon-cyberpunk");
    const themeIconOcean = document.querySelector(".theme-icon-ocean");
    const themeIconSunset = document.querySelector(".theme-icon-sunset");
    const themeIconHacker = document.querySelector(".theme-icon-hacker");
    const themeIconWin11 = document.querySelector(".theme-icon-win11");
    const themeIconWin10 = document.querySelector(".theme-icon-win10");
    const themeSelect = document.getElementById("ui_theme");
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');

    // Order for 10-way cycling: dark → rosegold → light → cyber → nature → glass → ocean → sunset → synthwave → cyberpunk → dark
    const themeCycle = ["dark", "rosegold", "light", "cyber", "nature", "glass", "ocean", "sunset", "hacker", "win10", "win11", "synthwave", "cyberpunk"];

    // System preference media query listener
    const systemDarkMQ = window.matchMedia("(prefers-color-scheme: dark)");

    /** Resolve "system" to actual dark/light based on OS preference */
    function resolveTheme(theme) {
        if (theme === "system") {
            return systemDarkMQ.matches ? "dark" : "light";
        }
        return theme;
    }

    function getPreferredTheme() {
        const saved = localStorage.getItem("luxpower_theme");
        if (saved) return saved;
        return "dark";
    }

    function applyTheme(themePref) {
        const actual = resolveTheme(themePref);
        
        // Clear all theme classes, then apply the resolved one
        document.body.classList.remove("theme-light", "theme-cyber", "theme-rosegold", "theme-nature", "theme-glass", "theme-synthwave", "theme-cyberpunk", "theme-ocean", "theme-sunset", "theme-hacker", "theme-win11", "theme-win10");
        if (actual === "light") {
            document.body.classList.add("theme-light");
        } else if (actual === "cyber") {
            document.body.classList.add("theme-cyber");
        } else if (actual === "rosegold") {
            document.body.classList.add("theme-rosegold");
        } else if (actual === "nature") {
            document.body.classList.add("theme-nature");
        } else if (actual === "glass") {
            document.body.classList.add("theme-glass");
        } else if (actual === "synthwave") {
            document.body.classList.add("theme-synthwave");
        } else if (actual === "cyberpunk") {
            document.body.classList.add("theme-cyberpunk");
        } else if (actual === "ocean") {
            document.body.classList.add("theme-ocean");
        } else if (actual === "sunset") {
            document.body.classList.add("theme-sunset");
        } else if (actual === "hacker") {
            document.body.classList.add("theme-hacker");
        } else if (actual === "win11") {
            document.body.classList.add("theme-win11");
        } else if (actual === "win10") {
            document.body.classList.add("theme-win10");
        }
        // "dark" is default — no extra class needed
        
        localStorage.setItem("luxpower_theme", themePref);

        // Show the icon for the NEXT theme in the cycle
        // Dark → show sun (switch to light)
        // Light → show cyber (switch to cyber)
        // Cyber → show moon (switch to dark)
        const iconMap = {
            "dark":       { show: themeIconRosegold, hide: [themeIconSun, themeIconMoon, themeIconCyber, themeIconNature, themeIconGlass, themeIconSynthwave, themeIconOcean, themeIconHacker, themeIconWin11, themeIconWin10] },
            "rosegold":   { show: themeIconSun,      hide: [themeIconMoon, themeIconCyber, themeIconRosegold, themeIconNature, themeIconGlass, themeIconSynthwave, themeIconOcean, themeIconHacker, themeIconWin11, themeIconWin10] },
            "light":      { show: themeIconCyber,    hide: [themeIconSun, themeIconMoon, themeIconRosegold, themeIconNature, themeIconGlass, themeIconSynthwave, themeIconOcean, themeIconHacker, themeIconWin11, themeIconWin10] },
            "cyber":      { show: themeIconNature,   hide: [themeIconSun, themeIconMoon, themeIconCyber, themeIconRosegold, themeIconGlass, themeIconSynthwave, themeIconOcean, themeIconHacker, themeIconWin11, themeIconWin10] },
            "nature":     { show: themeIconGlass,    hide: [themeIconSun, themeIconMoon, themeIconCyber, themeIconRosegold, themeIconNature, themeIconSynthwave, themeIconOcean, themeIconHacker, themeIconWin11, themeIconWin10] },
            "glass":      { show: themeIconOcean,    hide: [themeIconSun, themeIconMoon, themeIconCyber, themeIconRosegold, themeIconNature, themeIconGlass, themeIconSynthwave, themeIconHacker, themeIconWin11, themeIconWin10] },
            "ocean":      { show: themeIconSunset,   hide: [themeIconSun, themeIconMoon, themeIconCyber, themeIconRosegold, themeIconNature, themeIconGlass, themeIconOcean, themeIconSynthwave, themeIconHacker, themeIconWin11, themeIconWin10] },
            "sunset":     { show: themeIconHacker,   hide: [themeIconSun, themeIconMoon, themeIconCyber, themeIconRosegold, themeIconNature, themeIconGlass, themeIconOcean, themeIconSunset, themeIconSynthwave, themeIconWin11, themeIconWin10] },
            "hacker":     { show: themeIconWin10,    hide: [themeIconSun, themeIconMoon, themeIconCyber, themeIconRosegold, themeIconNature, themeIconGlass, themeIconOcean, themeIconSunset, themeIconHacker, themeIconSynthwave, themeIconWin11, themeIconWin10] },
            "win10":      { show: themeIconWin11,    hide: [themeIconSun, themeIconMoon, themeIconCyber, themeIconRosegold, themeIconNature, themeIconGlass, themeIconOcean, themeIconSunset, themeIconHacker, themeIconWin10] },
            "win11":      { show: themeIconSynthwave, hide: [themeIconSun, themeIconMoon, themeIconCyber, themeIconRosegold, themeIconNature, themeIconGlass, themeIconOcean, themeIconSunset, themeIconHacker, themeIconWin11, themeIconWin10] },
            "synthwave":  { show: themeIconCyberpunk, hide: [themeIconSun, themeIconCyber, themeIconRosegold, themeIconNature, themeIconGlass, themeIconSynthwave, themeIconMoon, themeIconOcean, themeIconSunset, themeIconHacker, themeIconWin11, themeIconWin10] },
            "cyberpunk":  { show: themeIconMoon,      hide: [themeIconSun, themeIconCyber, themeIconRosegold, themeIconNature, themeIconGlass, themeIconSynthwave, themeIconCyberpunk, themeIconOcean, themeIconSunset, themeIconHacker, themeIconWin11, themeIconWin10] }
        };
        // Resolve again for icon display (system → actual)
        const iconTheme = resolveTheme(themePref);
        const icons = iconMap[iconTheme] || iconMap["dark"];
        if (icons) {
            icons.show.classList.remove("hidden");
            icons.hide.forEach(el => {
                if (el) el.classList.add("hidden");
            });
        }

        // Update tooltip with the theme name
        if (themeToggleBtn) {
            const themeNames = { dark: "Dark", rosegold: "Rose Gold", light: "Light", cyber: "Cyber", nature: "Nature", glass: "Glass", ocean: "Ocean", sunset: "Sunset", hacker: "Hacker", win10: "Windows 10", win11: "Windows 11", synthwave: "Synthwave", cyberpunk: "Cyberpunk" };
            const currentName = themeNames[actual] || actual;
            const nextIdx = (themeCycle.indexOf(actual) + 1) % themeCycle.length;
            const nextName = themeNames[themeCycle[nextIdx]] || themeCycle[nextIdx];
            themeToggleBtn.title = `Switch to ${nextName} Theme (${themePref === "system" ? "System" : currentName})`;
        }

        // Sync theme select dropdown if present
        if (themeSelect) {
            themeSelect.value = themePref;
        }

        // Update mobile status bar color via theme-color meta tag
        if (themeColorMeta) {
            const statusBarColors = {
                dark: "#0b0e14",
                rosegold: "#0f0b09",
                light: "#f0f4f8",
                cyber: "#0a0e1a",
                nature: "#0d1a12",
                glass: "#0c0e1a",
                ocean: "#060d1a",
                sunset: "#12080a",
                hacker: "#050805",
                win10: "#e6eaef",
                win11: "#f3f3f5",
                synthwave: "#0a0015",
                cyberpunk: "#0a0b0d"
            };
            themeColorMeta.setAttribute("content", statusBarColors[actual] || "#0b0e14");
        }

        // Refresh parallax orb positions after theme change
        if (window.__parallax && window.__parallax.refresh) {
            window.__parallax.refresh();
        }

        // Re-render chart with updated theme colors if chart exists
        if (liveChart) {
            const gridColor = actual === "light" ? "rgba(0, 0, 0, 0.06)"
                : actual === "cyber" ? "rgba(0, 180, 255, 0.06)"
                : actual === "rosegold" ? "rgba(212, 160, 86, 0.08)"
                : actual === "nature" ? "rgba(16, 185, 129, 0.08)"
                : actual === "glass" ? "rgba(129, 140, 248, 0.08)"
                : actual === "synthwave" ? "rgba(255, 45, 149, 0.08)"
                : actual === "cyberpunk" ? "rgba(255, 215, 0, 0.08)"
                : actual === "ocean" ? "rgba(45, 212, 191, 0.08)"
                : actual === "sunset" ? "rgba(245, 158, 11, 0.08)"
                : actual === "hacker" ? "rgba(0, 255, 65, 0.08)"
                : actual === "win10" ? "rgba(0, 120, 215, 0.08)"
                : actual === "win11" ? "rgba(0, 120, 212, 0.08)"
                : "rgba(255, 255, 255, 0.03)";
            liveChart.options.scales.x.grid.color = gridColor;
            liveChart.options.scales.y.grid.color = gridColor;
            liveChart.update();
        }
    }

    /** Listen for OS theme changes when in "system" mode */
    function onSystemThemeChange() {
        const saved = localStorage.getItem("luxpower_theme") || "dark";
        if (saved === "system") {
            applyTheme("system");
        }
    }
    systemDarkMQ.addEventListener("change", onSystemThemeChange);

    function runThemeTransition(fn) {
        if (document.startViewTransition) {
            const transition = document.startViewTransition(fn);
            document.body.classList.add("theme-transitioning");
            transition.finished.finally(() => {
                document.body.classList.remove("theme-transitioning");
            });
        } else {
            fn();
        }
    }

    function toggleTheme() {
        const saved = localStorage.getItem("luxpower_theme") || "dark";
        const actual = resolveTheme(saved);
        // Cycle to the next theme in the 3-way cycle (exits "system" mode)
        const idx = themeCycle.indexOf(actual);
        const next = themeCycle[(idx + 1) % themeCycle.length];
        runThemeTransition(() => applyTheme(next));
    }

    function setTheme(themePref) {
        runThemeTransition(() => applyTheme(themePref));
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", toggleTheme);
    }

    // Keyboard shortcut: Ctrl+Shift+T to cycle themes
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === "T") {
            e.preventDefault();
            toggleTheme();
        }
    });

    // Theme selector inside settings modal
    if (themeSelect) {
        themeSelect.addEventListener("change", (e) => {
            setTheme(e.target.value);
        });
    }

    // Apply saved theme on load
    applyTheme(getPreferredTheme());

    // ========== PARALLAX SCROLL INIT ==========
    // Initialize AFTER theme is applied so computed positions are correct
    const parallax = new ParallaxScroll();
    window.__parallax = parallax;

    // ========== Chart Configuration ==========
    const maxDataPoints = 30;
    const chartLabels = [];
    const solarData = [];
    const loadData = [];
    const batterySOCData = [];

    if (typeof Chart !== 'undefined') {
        try {
            const ctx = document.getElementById("liveChart").getContext("2d");
            liveChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartLabels,
                    datasets: [
                        {
                            label: t('chart_solar'),
                            data: solarData,
                            borderColor: '#ff9f43',
                            backgroundColor: 'rgba(255, 159, 67, 0.05)',
                            borderWidth: 2,
                            pointRadius: 2,
                            fill: true,
                            yAxisID: 'y'
                        },
                        {
                            label: t('chart_load'),
                            data: loadData,
                            borderColor: '#9c88ff',
                            backgroundColor: 'rgba(156, 136, 255, 0.05)',
                            borderWidth: 2,
                            pointRadius: 2,
                            fill: true,
                            yAxisID: 'y'
                        },
                        {
                            label: t('chart_battery'),
                            data: batterySOCData,
                            borderColor: '#1dd1a1',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            pointRadius: 0,
                            fill: false,
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.03)'
                            },
                            ticks: {
                                color: '#64748b',
                                font: {
                                    family: 'Outfit'
                                }
                            }
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: t('chart_y_power'),
                                color: '#64748b',
                                font: {
                                    family: 'Outfit'
                                }
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.03)'
                            },
                            ticks: {
                                color: '#64748b',
                                font: {
                                    family: 'Outfit'
                                }
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            min: 0,
                            max: 100,
                            title: {
                                display: true,
                                text: t('chart_y_battery'),
                                color: '#64748b',
                                font: {
                                    family: 'Outfit'
                                }
                            },
                            grid: {
                                drawOnChartArea: false
                            },
                            ticks: {
                                color: '#64748b',
                                font: {
                                    family: 'Outfit'
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        } catch (e) {
            console.error("Failed to initialize Chart.js: ", e);
        }
    }

    // ========== Polling function for telemetry data ==========
    function pollInverterData() {
        // Now handled by Firebase realtime listener below
    }

    onValue(systemRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
                const status = data.status || "Offline";
                const isSimulated = !!data.is_simulated;
                const lastUpdated = data.last_updated;
                const metrics = data.metrics || {};

                // 1. Update Connection Header details
                if (statusText) statusText.innerText = status;
                if (statusBadge) {
                    statusBadge.className = "status-badge";
                    if (status.includes("Connected")) {
                        statusBadge.classList.add("connected");
                    } else if (status.includes("Reconnecting")) {
                        statusBadge.classList.add("reconnecting");
                    } else {
                        statusBadge.classList.add("disconnected");
                    }
                }

                if (isSimulated) {
                    simulatedBadge.classList.remove("hidden");
                } else {
                    simulatedBadge.classList.add("hidden");
                }

                if (updateTime) {
                    const label = t('last_updated');
                    updateTime.innerText = label ? `${label} ${lastUpdated || '--:--:--'}` : (lastUpdated || '--:--:--');
                }

                // 2. Update Solar production card
                const p_pv = metrics.p_pv !== undefined ? metrics.p_pv : 0;
                if (valSolarPower) {
                    counter.updateValue('solarPower', p_pv);
                }
                if (valSolarEnergy) {
                    const e_pv_day = metrics.e_pv_day !== undefined ? metrics.e_pv_day : 0.0;
                    counter.updateValue('solarEnergy', e_pv_day);
                }
                
                if (valPV1) valPV1.innerText = `${metrics.p_pv_1 || 0} W / ${metrics.v_pv_1 !== undefined ? metrics.v_pv_1.toFixed(1) : 0.0}V`;
                if (valPV2) valPV2.innerText = `${metrics.p_pv_2 || 0} W / ${metrics.v_pv_2 !== undefined ? metrics.v_pv_2.toFixed(1) : 0.0}V`;

                // Calculate real-time home consumption in Watts
                // Dùng p_inv (AC output thực tế của inverter) thay vì p_pv (DC input)
                // Công thức: Nhà đang dùng = p_inv + lưới cấp - bán lưới
                const p_inv = metrics.p_inv || 0;
                const homeWatts = Math.max(0, p_inv + (metrics.p_to_user || 0) - (metrics.p_to_grid || 0));
                if (valHomeUsageW) {
                    counter.updateValue('homeUsage', homeWatts);
                }

                // 3. Update Battery status card
                const soc = metrics.soc !== undefined ? metrics.soc : 0;
                if (valSOC) {
                    counter.updateValue('batterySoc', soc);
                }
                if (socBar) socBar.style.width = `${soc}%`;
                
                // Update radial gauge
                if (radialGauge) radialGauge.setValue(soc);

                const p_charge = metrics.p_charge || 0;
                const p_discharge = metrics.p_discharge || 0;
                if (valBatPower) {
                    const counterEl = valBatPower.querySelector('[data-counter="batPower"]');
                    const currentDisplayed = counterEl ? parseFloat(counterEl.textContent) || 0 : 0;
                    if (p_charge > 0) {
                        valBatPower.innerHTML = `+<span data-counter="batPower">${currentDisplayed}</span>`;
                        const nc = valBatPower.querySelector('[data-counter="batPower"]');
                        if (nc) nc.dataset.currentValue = String(currentDisplayed);
                        counter.updateValue('batPower', p_charge);
                        valBatStatus.innerText = t('bat_charging');
                        valBatStatus.className = "status-badge-pill success";
                    } else if (p_discharge > 0) {
                        valBatPower.innerHTML = `-<span data-counter="batPower">${currentDisplayed}</span>`;
                        const nc = valBatPower.querySelector('[data-counter="batPower"]');
                        if (nc) nc.dataset.currentValue = String(currentDisplayed);
                        counter.updateValue('batPower', p_discharge);
                        valBatStatus.innerText = t('bat_discharging');
                        valBatStatus.className = "status-badge-pill warning";
                    } else {
                        valBatPower.innerHTML = `<span data-counter="batPower">${currentDisplayed}</span>`;
                        const nc = valBatPower.querySelector('[data-counter="batPower"]');
                        if (nc) nc.dataset.currentValue = String(currentDisplayed);
                        counter.updateValue('batPower', 0);
                        valBatStatus.innerText = t('bat_idle');
                        valBatStatus.className = "status-badge-pill";
                    }
                }

                if (valBatVolt) valBatVolt.innerText = `${metrics.v_bat !== undefined ? metrics.v_bat.toFixed(1) : 0.0} V`;
                if (valBatCurr) valBatCurr.innerText = `${metrics.bat_current !== undefined ? metrics.bat_current.toFixed(1) : 0.0} A`;
                if (valBatTemp) valBatTemp.innerText = `${metrics.t_bat !== undefined ? metrics.t_bat : 0} °C`;
                if (valBatChgDay) valBatChgDay.innerText = `${metrics.e_chg_day !== undefined ? metrics.e_chg_day.toFixed(1) : '0.0'} kWh`;
                if (valBatDischgDay) valBatDischgDay.innerText = `${metrics.e_dischg_day !== undefined ? metrics.e_dischg_day.toFixed(1) : '0.0'} kWh`;

                // Update predicted battery charge/discharge remaining time
                lastInverterMetrics = metrics;
                updateChargeTimePrediction(metrics);

                // 4. Update Grid card
                const p_to_user = metrics.p_to_user || 0;
                const p_to_grid = metrics.p_to_grid || 0;
                if (valGridPower) {
                    const counterEl = valGridPower.querySelector('[data-counter="gridPower"]');
                    const currentDisplayed = counterEl ? parseFloat(counterEl.textContent) || 0 : 0;
                    if (p_to_user > 0) {
                        valGridPower.innerHTML = `+<span data-counter="gridPower">${currentDisplayed}</span>`;
                        const nc = valGridPower.querySelector('[data-counter="gridPower"]');
                        if (nc) nc.dataset.currentValue = String(currentDisplayed);
                        counter.updateValue('gridPower', p_to_user);
                        valGridStatus.innerText = t('grid_importing');
                        valGridStatus.className = "status-badge-pill warning";
                    } else if (p_to_grid > 0) {
                        valGridPower.innerHTML = `-<span data-counter="gridPower">${currentDisplayed}</span>`;
                        const nc = valGridPower.querySelector('[data-counter="gridPower"]');
                        if (nc) nc.dataset.currentValue = String(currentDisplayed);
                        counter.updateValue('gridPower', p_to_grid);
                        valGridStatus.innerText = t('grid_exporting');
                        valGridStatus.className = "status-badge-pill success";
                    } else {
                        valGridPower.innerHTML = `<span data-counter="gridPower">${currentDisplayed}</span>`;
                        const nc = valGridPower.querySelector('[data-counter="gridPower"]');
                        if (nc) nc.dataset.currentValue = String(currentDisplayed);
                        counter.updateValue('gridPower', 0);
                        valGridStatus.innerText = t('grid_connected');
                        valGridStatus.className = "status-badge-pill";
                    }
                }

                if (valGridVolt) valGridVolt.innerText = `${metrics.vacr !== undefined ? metrics.vacr.toFixed(1) : 0.0} V`;
                if (valGridFreq) valGridFreq.innerText = `${metrics.fac !== undefined ? metrics.fac.toFixed(2) : 0.00} Hz`;
                if (valGridPF) valGridPF.innerText = `${metrics.pf !== undefined ? metrics.pf.toFixed(3) : '0.000'}`;
                if (valGridImpDay) valGridImpDay.innerText = `${metrics.e_to_user_day !== undefined ? metrics.e_to_user_day.toFixed(1) : '0.0'} kWh`;
                if (valGridExpDay) valGridExpDay.innerText = `${metrics.e_to_grid_day !== undefined ? metrics.e_to_grid_day.toFixed(1) : '0.0'} kWh`;

                // Total cumulative import/export
                const valGridImpAll = document.getElementById("valGridImpAll");
                const valGridExpAll = document.getElementById("valGridExpAll");
                if (valGridImpAll) valGridImpAll.innerText = `${metrics.e_to_user_all !== undefined ? metrics.e_to_user_all.toFixed(1) : '0.0'} kWh`;
                if (valGridExpAll) valGridExpAll.innerText = `${metrics.e_to_grid_all !== undefined ? metrics.e_to_grid_all.toFixed(1) : '0.0'} kWh`;

                // 5. Update Load card
                // "Nhà đang dùng" = tổng công suất nhà tiêu thụ
                if (valLoadPower) {
                    counter.updateValue('loadPower', homeWatts);
                }
                if (valLoadVA) valLoadVA.innerText = `${metrics.s_eps || 0} VA`;
                if (valLoadVolt) valLoadVolt.innerText = `${metrics.v_eps_r !== undefined ? metrics.v_eps_r.toFixed(1) : 0.0} V`;
                if (valInvTemp) valInvTemp.innerText = `${metrics.t_inner !== undefined ? metrics.t_inner : 0} °C`;
                
                // Always calculate the total Home Consumption dynamically
                const pv = metrics.e_pv_day || 0;
                const chg = metrics.e_chg_day || 0;
                const dis = metrics.e_dischg_day || 0;
                const imp = metrics.e_to_user_day || 0;
                const exp = metrics.e_to_grid_day || 0;
                const homeConsumption = Math.max(0, pv - chg + dis + imp - exp);
                
                if (valLoadEnergy) valLoadEnergy.innerText = `${homeConsumption.toFixed(1)} kWh`;
                if (valHomeConsumDay) valHomeConsumDay.innerText = `${homeConsumption.toFixed(1)} kWh`;

                // Display today's grid import (energy taken from grid)
                if (valHomeGridImport) valHomeGridImport.innerText = `${imp.toFixed(1)} kWh`;

                // Display EPS daily consumption directly
                if (valEPSEnergy) {
                    const epsEnergy = metrics.e_eps_day !== undefined ? metrics.e_eps_day : 0.0;
                    valEPSEnergy.innerText = `${epsEnergy.toFixed(1)} kWh`;
                }

                // Update sparklines
                if (sparklines) {
                    sparklines.pushData('solar', p_pv);
                    sparklines.pushData('load', homeWatts);
                    sparklines.pushData('battery', soc);
                    sparklines.pushData('grid', Math.max(p_to_user, p_to_grid));
                }

                // Update daily insights
                const insightSolar = document.getElementById('insightSolar');
                const insightBattery = document.getElementById('insightBattery');
                const insightGrid = document.getElementById('insightGrid');
                const insightHome = document.getElementById('insightHome');
                
                if (insightSolar) insightSolar.textContent = `${p_pv} W`;
                if (insightBattery) insightBattery.textContent = `${soc}%`;
                if (insightGrid) {
                    const gridVal = Math.max(p_to_user, p_to_grid);
                    insightGrid.textContent = `${gridVal} W`;
                }
                if (insightHome) insightHome.textContent = `${homeWatts} W`;

                // 6. Update chart
                if (liveChart) {
                    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    chartLabels.push(timeString);
                    solarData.push(p_pv);
                    loadData.push(homeWatts); // Tổng công suất nhà đang tiêu thụ
                    batterySOCData.push(soc);

                    if (chartLabels.length > maxDataPoints) {
                        chartLabels.shift();
                        solarData.shift();
                        loadData.shift();
                        batterySOCData.shift();
                    }
                    liveChart.update();
                }

                // Auto-scroll: khi PV = 0 (ban đêm) thì scroll xuống chart
                if (typeof window.__pvZeroCount === 'undefined') window.__pvZeroCount = 0;
                if (p_pv === 0) {
                    window.__pvZeroCount++;
                    if (window.__pvZeroCount >= 3) {
                        const chartSec = document.querySelector('.chart-section');
                        if (chartSec && liveChart) {
                            const rect = chartSec.getBoundingClientRect();
                            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                            if (!isVisible) {
                                chartSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }
                    }
                } else {
                    window.__pvZeroCount = 0;
                }
                // Hide skeleton overlays — data has arrived!
                hideSkeletons();
                
                // Show welcome toast on first successful data load
                if (!window.__skeletonWelcomeShown) {
                    window.__skeletonWelcomeShown = true;
                    setTimeout(() => {
                        
                    }, 500);
                }
        } else {
            console.warn("No data in Firebase.");
            if (statusText) statusText.innerText = "No Data in Firebase";
            if (statusBadge) statusBadge.className = "status-badge disconnected";
        }
    }, (error) => {
        console.error("Firebase error: ", error);
        if (statusText) statusText.innerText = "Firebase Error";
        if (statusBadge) statusBadge.className = "status-badge disconnected";
    });

    // pollInverterData is now a no-op, Firebase listener handles everything

    // ========== INIT LUXURY FEATURES PT 2 ==========
    // Init 3D card tilt
    setTimeout(() => {
        new CardTilt();
    }, 500);

    // Init button ripples
    initButtonRipple();

    // ========== SKELETON LOADING SYSTEM ==========
    let skeletonDataLoaded = false;
    
    function showSkeletons() {
        document.querySelectorAll('.skeleton-overlay').forEach(el => {
            el.classList.add('active');
        });
    }
    
    function hideSkeletons() {
        if (skeletonDataLoaded) return;
        skeletonDataLoaded = true;
        document.querySelectorAll('.skeleton-overlay').forEach(el => {
            el.classList.remove('active');
        });
        // Hide full-page loader with smooth fade
        const pageLoader = document.getElementById('pageLoader');
        if (pageLoader) {
            pageLoader.classList.add('hidden');
            // Remove from DOM after transition
            setTimeout(() => {
                if (pageLoader.parentNode) pageLoader.remove();
            }, 700);
        }
    }
    
    // Activate skeleton overlays immediately on page load
    showSkeletons();
    
    // Fallback: hide skeletons after 8 seconds even if API fails
    setTimeout(hideSkeletons, 8000);
    
    // Show welcome toast after data loads (or fallback)
    setTimeout(() => {
        if (!skeletonDataLoaded) {
            // quick initial toast, data may still be loading
        }
    }, 1500);
    
    setTimeout(() => {
        if (skeletonDataLoaded) {
            
        }
    }, 2000);

    // ========== Modal Control logic ==========
    function openModal() {
        document.getElementById("ui_language").value = currentLang;
        document.getElementById("bat_capacity").value = localStorage.getItem("luxpower_bat_capacity") || 314;
        document.getElementById("soc_cutoff").value = localStorage.getItem("luxpower_soc_cutoff") || 25;
        document.getElementById("inverter_efficiency").value = Math.round((parseFloat(localStorage.getItem("luxpower_inverter_efficiency")) || 0.95) * 100);
        settingsModal.classList.remove("hidden");
    }

    function closeModal() {
        settingsModal.classList.add("hidden");
    }

    openSettingsBtn.addEventListener("click", openModal);
    closeSettingsBtn.addEventListener("click", closeModal);
    cancelSettingsBtn.addEventListener("click", closeModal);

    // Language selector - apply immediately on change
    const langSelect = document.getElementById("ui_language");
    if (langSelect) {
        langSelect.addEventListener("change", (e) => {
            applyLanguage(e.target.value);
        });
    }

    // Save configurations
    settingsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const settings = {
            bat_capacity: parseInt(document.getElementById("bat_capacity").value, 10) || 314,
            soc_cutoff: parseInt(document.getElementById("soc_cutoff").value, 10) || 25,
            inverter_efficiency: (parseInt(document.getElementById("inverter_efficiency").value, 10) || 95) / 100
        };

        // Save locally first
        localStorage.setItem("luxpower_bat_capacity", settings.bat_capacity);
        localStorage.setItem("luxpower_soc_cutoff", settings.soc_cutoff);
        localStorage.setItem("luxpower_inverter_efficiency", settings.inverter_efficiency);

        // Save language preference (stored in localStorage, not server config)
        const selectedLang = document.getElementById("ui_language").value;
        applyLanguage(selectedLang);
        
        closeModal();
        alert("Settings saved locally! Note: hardware config changes require updating config.json manually.");
    });

    // ========== Initialize ==========
    // Apply saved language on page load
    applyLanguage(currentLang);

    // Chart Visibility Toggle
    let chartVisible = localStorage.getItem("luxpower_chart_visible") === "true";
    if (chartVisible) {
        document.body.classList.add("chart-visible");
    } else {
        document.body.classList.remove("chart-visible");
    }

    if (toggleChartBtn) {
        toggleChartBtn.addEventListener("click", () => {
            const isVisible = document.body.classList.toggle("chart-visible");
            localStorage.setItem("luxpower_chart_visible", isVisible ? "true" : "false");
            
            // Re-align and update the chart if it becomes visible
            if (isVisible && liveChart) {
                setTimeout(() => {
                    liveChart.resize();
                    liveChart.update();
                }, 100);
            }
        });
    }

    // ========== FLY-IN ENTRANCE ANIMATION ==========
    function initFlyInAnimation() {
        const elements = [
            { el: document.querySelector('.app-header'), dir: 'top', delay: 0.05 },
            { el: document.querySelector('.solar-card'), dir: 'left', delay: 0.15 },
            { el: document.querySelector('.battery-card'), dir: 'right', delay: 0.25 },
            { el: document.querySelector('.grid-card'), dir: 'left', delay: 0.35 },
            { el: document.querySelector('.load-card'), dir: 'right', delay: 0.45 },
            { el: document.querySelector('.insights-banner'), dir: 'bottom', delay: 0.55 },
            { el: document.querySelector('.chart-section'), dir: 'bottom', delay: 0.70 },
            { el: document.querySelector('.energy-flow-view'), dir: 'bottom', delay: 0.85 },
            { el: document.querySelector('.view-tabs'), dir: 'bottom', delay: 0.65 }
        ];

        // Assign fly-in classes and stagger delays
        elements.forEach((item) => {
            if (item.el) {
                item.el.classList.add('fly-in');
                item.el.classList.add('from-' + item.dir);
                item.el.style.setProperty('--anim-delay', item.delay + 's');
                
                // Trigger animation after a microtask (ensures CSS transition is registered)
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        item.el.classList.add('visible');
                    });
                });
            }
        });

        // Also animate the status badge and settings button with a slight delay
        const controls = document.querySelectorAll('.status-badge, .time-stamp, .settings-btn, #themeToggleBtn');
        controls.forEach((el, i) => {
            el.classList.add('fly-in');
            el.classList.add('from-top');
            el.style.setProperty('--anim-delay', (0.1 + i * 0.08) + 's');
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    el.classList.add('visible');
                });
            });
        });

        // Animate the radial gauge inside battery card
        const gaugeEl = document.getElementById('radialGauge') || document.querySelector('.radial-gauge');
        if (gaugeEl) {
            gaugeEl.classList.add('fly-in');
            gaugeEl.classList.add('scale-up');
            gaugeEl.style.setProperty('--anim-delay', '0.6s');
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    gaugeEl.classList.add('visible');
                });
            });
        }
    }

    // Initialize fly-in after a tiny delay to let everything render first
    setTimeout(initFlyInAnimation, 50);

    // Start polling immediately
    pollInverterData();
    let pollTimer = setInterval(pollInverterData, 5000);
});

