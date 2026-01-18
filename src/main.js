// Custom Cursor and Mouse Glow
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const glow = document.querySelector('.mouse-glow');

document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    cursor.style.transform = `translate(${x}px, ${y}px)`;
    follower.style.transform = `translate(${x - 10}px, ${y - 10}px)`;

    document.documentElement.style.setProperty('--x', `${x}px`);
    document.documentElement.style.setProperty('--y', `${y}px`);
});

// Typing Effect
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

const heroTag = document.querySelector('.hero-tag');
if (heroTag) {
    typeWriter(heroTag, '[ MISSION: INITIALIZE_EXPLOITATION_PHASE ]', 100);
}

// Real-time Clock
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
}
setInterval(updateClock, 1000);
updateClock();

// Visitor Counter Logic
async function updateVisitorCount() {
    const countElement = document.getElementById('v-count');
    if (!countElement) return;

    try {
        // Using a reliable public API to fetch/increment counts
        // Note: In local development, this might stay static or error out.
        // On a deployed site, this will hit a real counter service.
        const response = await fetch('https://api.counterapi.dev/v1/cyberwithkt/visits/up');
        const data = await response.json();

        if (data && data.count) {
            let current = 0;
            const target = data.count;
            const duration = 2000; // 2 seconds animation
            const step = Math.ceil(target / (duration / 20));

            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    countElement.textContent = target.toLocaleString();
                    clearInterval(counter);
                } else {
                    countElement.textContent = current.toLocaleString();
                }
            }, 20);
        }
    } catch (error) {
        // Fallback for local testing if API fails
        console.log("Visitor counter API unreachable. Using fallback.");
        const localVisits = localStorage.getItem('local_visits') || 1024;
        const newVal = parseInt(localVisits) + 1;
        localStorage.setItem('local_visits', newVal);
        countElement.textContent = newVal.toLocaleString();
    }
}

window.addEventListener('load', updateVisitorCount);

// Hero Canvas Animation (Matrix/Grid Effect)
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    let width, height;
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const dots = [];
    const dotCount = 100;

    for (let i = 0; i < dotCount; i++) {
        dots.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = '#00ff9d22';
        ctx.fillStyle = '#00ff9d44';

        dots.forEach((dot, i) => {
            dot.x += dot.vx;
            dot.y += dot.vy;

            if (dot.x < 0 || dot.x > width) dot.vx *= -1;
            if (dot.y < 0 || dot.y > height) dot.vy *= -1;

            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2);
            ctx.fill();

            for (let j = i + 1; j < dots.length; j++) {
                const other = dots[j];
                const dx = dot.x - other.x;
                const dy = dot.y - other.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(dot.x, dot.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.lineWidth = 1 - dist / 150;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// Scroll Reveal Logic
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section, .skill-card, .project-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Contact Form Submission (Web3Forms)
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.textContent;

        // Change button state to loading
        btn.textContent = 'ENCRYPTING_PACKET...';
        btn.disabled = true;

        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });

            const result = await response.json();

            if (response.status === 200) {
                btn.textContent = 'PACKET_TRANSMITTED_SUCCESSFULLY';
                btn.style.background = '#00d4ff'; // Success Blue
                form.reset();
            } else {
                btn.textContent = 'TRANSMISSION_FAILED';
                btn.style.background = '#ff4b2b'; // Error Red
            }
        } catch (error) {
            btn.textContent = 'SYSTEM_ERROR';
            btn.style.background = '#ff4b2b';
        }

        // Reset button after 4 seconds
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 4000);
    });
}

// Click to Copy Logic
const copyItems = document.querySelectorAll('.copy-item');
copyItems.forEach(item => {
    item.addEventListener('click', () => {
        const textToCopy = item.getAttribute('data-copy');
        const tag = item.querySelector('.copy-tag');
        const originalTagText = tag.textContent;

        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalOpacity = tag.style.opacity;
            tag.textContent = '[EMAIL_COPIED]';
            tag.style.color = '#00ff9d';
            tag.style.opacity = '1';

            setTimeout(() => {
                tag.textContent = originalTagText;
                tag.style.color = '';
                tag.style.opacity = '';
            }, 2000);
        });
    });
});

// --- Credentials & Badges Section Logic ---
console.log("Credentials logic initialized.");

const credTabs = document.querySelectorAll('.cred-tab');
const tabContents = document.querySelectorAll('.tab-content');
const certItems = document.querySelectorAll('.cert-badge-card');
const loadMoreBtn = document.getElementById('load-more-certs');
const showLessBtn = document.getElementById('show-less-certs');
let initialItems = 9;
let currentItems = initialItems;

// --- Tab Switching ---
function switchTab(targetId) {
    console.log("Switching to tab:", targetId);
    const targetContent = document.getElementById(targetId);
    if (!targetContent) {
        console.error("Target content not found:", targetId);
        return;
    }

    credTabs.forEach(t => {
        t.classList.toggle('active', t.getAttribute('data-tab') === targetId);
    });

    tabContents.forEach(c => {
        c.classList.toggle('active', c.id === targetId);
        // Explicitly force display to be sure
        if (c.id === targetId) {
            c.style.display = 'block';
            console.log("Set display:block for", targetId);
        } else {
            c.style.display = 'none';
        }
    });

    if (targetId === 'badges') initializeBadges();
    if (targetId === 'certs') updateCertsDisplay();
}

if (credTabs.length > 0) {
    credTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.getAttribute('data-tab'));
        });
    });
}

// --- Certification Logic ---
function updateCertsDisplay() {
    const certSection = document.getElementById('certs');
    if (!certSection) return;

    const activeBtn = certSection.querySelector('.filter-btn.active');
    const activeFilter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

    let visibleCount = 0;
    let totalMatchCount = 0;

    certItems.forEach((item) => {
        const matchesFilter = activeFilter === 'all' || item.getAttribute('data-category') === activeFilter;

        if (matchesFilter) {
            totalMatchCount++;
            if (activeFilter === 'all') {
                if (visibleCount < currentItems) {
                    showItem(item);
                    visibleCount++;
                } else {
                    hideItem(item);
                }
            } else {
                showItem(item);
                visibleCount++;
            }
        } else {
            hideItem(item);
        }
    });

    const actionContainer = document.getElementById('cert-load-more-container');
    if (actionContainer) {
        if (activeFilter === 'all') {
            actionContainer.style.display = 'flex';
            if (loadMoreBtn) loadMoreBtn.style.display = (totalMatchCount > currentItems) ? 'block' : 'none';
            if (showLessBtn) showLessBtn.style.display = (currentItems > initialItems) ? 'block' : 'none';
        } else {
            actionContainer.style.display = 'none';
        }
    }
}

function showItem(item) {
    item.style.display = 'flex';
    setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
    }, 10);
}

function hideItem(item) {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.95)';
    setTimeout(() => {
        item.style.display = 'none';
    }, 300);
}

// Cert Filter Events
document.querySelectorAll('#certs .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('#certs .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentItems = initialItems;
        updateCertsDisplay();
    });
});

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        currentItems += 6;
        updateCertsDisplay();
    });
}

if (showLessBtn) {
    showLessBtn.addEventListener('click', () => {
        currentItems = initialItems;
        updateCertsDisplay();
        const section = document.getElementById('credentials-section');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    });
}

// --- Badge Logic ---
function initializeBadges() {
    console.log("Initializing badges...");
    const badgeGroups = document.querySelectorAll('.badge-group');
    const activeBtn = document.querySelector('.badge-filter-btn.active');
    const filter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

    if (badgeGroups.length === 0) {
        console.log("No badge groups found yet.");
    }

    badgeGroups.forEach(group => {
        const isMatch = filter === 'all' || group.getAttribute('data-category') === filter;
        if (isMatch) {
            group.style.display = 'block';
            setTimeout(() => {
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
            }, 10);
        } else {
            group.style.opacity = '0';
            group.style.transform = 'translateY(20px)';
            setTimeout(() => {
                group.style.display = 'none';
            }, 300);
        }
    });
}

const badgeFilterBtns = document.querySelectorAll('.badge-filter-btn');
badgeFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        console.log("Badge filter clicked:", btn.getAttribute('data-filter'));
        badgeFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        initializeBadges();
    });
});

// Modal Logic
const modal = document.getElementById('cert-modal');
const modalImg = document.getElementById('cert-viewer');
const closeBtn = document.querySelector('.close-modal');
const viewLinks = document.querySelectorAll('.view-cert-link, .view-badge-link');
const credBtns = document.querySelectorAll('.view-cred-btn');

function openModal(url) {
    if (modal && modalImg) {
        modal.style.display = "block";
        modalImg.src = url;
        document.body.style.overflow = "hidden";
    }
}

if (viewLinks.length > 0) {
    viewLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(encodeURI(link.getAttribute('href')));
        });
    });
}

if (closeBtn) {
    closeBtn.onclick = () => {
        modal.style.display = "none";
        modalImg.src = "";
        document.body.style.overflow = "auto";
    };
}

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
        modalImg.src = "";
        document.body.style.overflow = "auto";
    }
};

// Initial call
updateCertsDisplay();
initializeBadges();

// Stats Counting Animation
function animateStats() {
    const counters = document.querySelectorAll('.count');
    const duration = 2000; // 2 seconds

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const startValue = 0;
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            counter.innerText = Math.floor(progress * (target - startValue) + startValue);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                counter.innerText = target;
            }
        }
        window.requestAnimationFrame(step);
    });
}

const statsSection = document.querySelector('.stats');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateStats();
            observer.unobserve(statsSection);
        }
    }, { threshold: 0.5 });
    observer.observe(statsSection);
}

// --- Text Scramble Effect ---
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => (this.resolve = resolve));
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud" style="color: var(--accent-primary); opacity: 0.7;">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

const scrambleTargets = document.querySelectorAll('.scramble-target');
scrambleTargets.forEach(target => {
    const fx = new TextScramble(target);
    const originalText = target.innerText;
    let isScrambling = false;

    target.addEventListener('mouseenter', () => {
        if (isScrambling) return;
        isScrambling = true;
        fx.setText(originalText).then(() => {
            isScrambling = false;
        });
    });
});

// --- Projects Section Particles (Neural Network) ---
function initProjectsParticles() {
    const canvas = document.getElementById('projects-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const section = document.getElementById('projects');

    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resize() {
        if (!canvas || !section) return;
        canvas.width = section.offsetWidth;
        canvas.height = section.offsetHeight;
    }

    window.addEventListener('resize', resize);
    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    section.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
            this.density = (Math.random() * 30) + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    let directionX = (dx / distance) * force * this.density;
                    let directionY = (dy / distance) * force * this.density;
                    this.x -= directionX;
                    this.y -= directionY;
                }
            }
        }

        draw() {
            ctx.fillStyle = 'rgba(0, 255, 157, 0.8)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        const numberOfParticles = (canvas.width * canvas.height) / 1500;
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    function connect() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    let opacity = 1 - (distance / 120);
                    ctx.strokeStyle = `rgba(0, 255, 157, ${opacity * 0.2})`;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        connect();
        requestAnimationFrame(animate);
    }

    resize();
    init();
    animate();
}

initProjectsParticles();

// --- LIVE Mission Status ---
function initMissionStatus() {
    const statusText = document.getElementById('mission-status-text');
    if (!statusText) return;

    const missions = [
        "HANDS-ON PENTESTING VIA HTB LABS",
        "SEEKING FOR A CYBERSECURITY INTERNSHIP",
        "LEARNING REAL-WORLD WEB SECURITY EXPLOITS",
        "AI-POWERED AUTOMATION THROUGH CLI",
        "BUILDING CUSTOM SECURITY AUTOMATION TOOLS",
        "ACTIVELY SHARPENING CYBERSECURITY SKILLS",
        "STRENGTHENING OFFENSIVE SECURITY FUNDAMENTALS"
    ];

    let currentIdx = 0;

    function nextMission() {
        const text = missions[currentIdx];
        let i = 0;
        statusText.textContent = '';

        function type() {
            if (i < text.length) {
                statusText.textContent += text.charAt(i);
                i++;
                setTimeout(type, 50);
            } else {
                setTimeout(() => {
                    currentIdx = (currentIdx + 1) % missions.length;
                    nextMission();
                }, 4000);
            }
        }
        type();
    }

    nextMission();
}

initMissionStatus();

// Scroll to Top Functionality
function initScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    const progressBar = scrollBtn.querySelector('.scroll-progress');

    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
        // Show button after scrolling 300px
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }

        // Update progress bar
        const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / scrollTotal) * 100;
        progressBar.style.width = `${progress}%`;
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

initScrollToTop();

