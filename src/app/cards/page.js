'use client';
import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import styles from './page.module.css';

const CARD_STYLES = ['thermal', 'white', 'coral', 'dark', 'red'];
const PATH_TYPES = ['Loop', 'Wave', 'Curly', 'Stripes'];
const NUM_CARDS = 140;

function getPathCoordinates(type, t, index, repeatCount, w, h) {
    t = ((t % 1.0) + 1.0) % 1.0;
    let x = 0, y = 0;

    if (type === 'Wave') {
        const spread = w + 1000;
        const cx = -500 + t * spread;
        const angle = t * Math.PI * 2 * repeatCount;
        x = cx;
        y = h / 2 + Math.sin(angle) * 250;
    } else if (type === 'Curly') {
        const spread = w + 1200;
        const cx = -600 + t * spread;
        const angle = t * Math.PI * 2 * repeatCount;
        const radius = 160;
        x = cx - radius * Math.sin(angle);
        y = h / 2 - radius * Math.cos(angle);
    } else if (type === 'Loop') {
        const angle = t * Math.PI * 2;
        const scale = Math.min(w, h) * 0.4;
        const trackOffset = ((index % repeatCount) - (repeatCount - 1) / 2) * 40;
        const s = scale + trackOffset;
        const den = 1 + Math.sin(angle) * Math.sin(angle);
        x = w / 2 + (s * Math.cos(angle)) / den;
        y = h / 2 + (s * Math.sin(angle) * Math.cos(angle)) / den;
    } else if (type === 'Stripes') {
        const stripeIndex = index % repeatCount;
        const offset = (stripeIndex - (repeatCount - 1) / 2) * 220;
        const spreadX = w + 1400;
        const spreadY = h + 1400;
        x = -700 + t * spreadX + offset;
        y = h + 700 - t * spreadY + offset;
    }

    return { x, y };
}

export default function CardsPage() {
    const sceneRef = useRef(null);
    const cardsRef = useRef([]);
    const timeRef = useRef(0);
    const animRef = useRef(null);
    const [currentPath, setCurrentPath] = useState('Curly');
    const [speed, setSpeed] = useState(5);
    const [repeat, setRepeat] = useState(4);
    const pathRef = useRef('Curly');
    const speedRef = useRef(5);
    const repeatRef = useRef(4);

    useEffect(() => { pathRef.current = currentPath; }, [currentPath]);
    useEffect(() => { speedRef.current = speed; }, [speed]);
    useEffect(() => { repeatRef.current = repeat; }, [repeat]);

    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene) return;

        // Create cards
        const cards = [];
        for (let i = 0; i < NUM_CARDS; i++) {
            const card = document.createElement('div');
            card.className = `${styles.card} ${styles['c_' + CARD_STYLES[i % CARD_STYLES.length]]}`;
            scene.appendChild(card);
            cards.push(card);
        }
        cardsRef.current = cards;

        function render() {
            const w = window.innerWidth;
            const h = window.innerHeight;
            timeRef.current += speedRef.current * 0.0003;

            cards.forEach((card, i) => {
                let base_t;
                if (pathRef.current === 'Stripes') {
                    const cardsPerStripe = NUM_CARDS / repeatRef.current;
                    base_t = Math.floor(i / repeatRef.current) / cardsPerStripe;
                } else {
                    base_t = i / NUM_CARDS;
                }

                const t = timeRef.current + base_t;
                const dt = 0.001;
                const p1 = getPathCoordinates(pathRef.current, t, i, repeatRef.current, w, h);
                const p2 = getPathCoordinates(pathRef.current, t + dt, i, repeatRef.current, w, h);
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const angle = Math.atan2(dy, dx);

                card.style.transform = `translate(${p1.x}px, ${p1.y}px) translate(-50%, -50%) rotate(${angle}rad)`;
            });

            animRef.current = requestAnimationFrame(render);
        }

        animRef.current = requestAnimationFrame(render);

        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
            cards.forEach(c => c.remove());
        };
    }, []);

    return (
        <>
            <Navbar />
            <div ref={sceneRef} className={styles.scene} />

            <div className={styles.controls}>
                <div className={styles.btnGroup}>
                    {PATH_TYPES.map(path => (
                        <button
                            key={path}
                            className={`${styles.pathBtn} ${currentPath === path ? styles.pathBtnActive : ''}`}
                            onClick={() => setCurrentPath(path)}
                        >
                            {path}
                        </button>
                    ))}
                </div>

                <div className={styles.controlGroup}>
                    <span className={styles.controlLabel}>SPEED</span>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={speed}
                        onChange={e => setSpeed(parseInt(e.target.value))}
                        className={styles.slider}
                    />
                    <span className={styles.controlVal}>{speed}</span>
                </div>

                <div className={styles.controlGroup}>
                    <span className={styles.controlLabel}>REPEAT</span>
                    <div className={styles.stepper}>
                        <button
                            className={styles.stepBtn}
                            onClick={() => setRepeat(r => Math.max(1, r - 1))}
                        >−</button>
                        <span className={styles.controlVal} style={{ width: 20 }}>{repeat}</span>
                        <button
                            className={styles.stepBtn}
                            onClick={() => setRepeat(r => Math.min(10, r + 1))}
                        >+</button>
                    </div>
                </div>
            </div>
        </>
    );
}
