'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import styles from './page.module.css';

const SHAPES = [
    { value: 'star', label: 'Star', icon: '✦' },
    { value: 'polygon', label: 'Polygon', icon: '⬡' },
    { value: 'circle', label: 'Circle', icon: '●' },
    { value: 'flower', label: 'Flower', icon: '✿' },
    { value: 'ring', label: 'Ring', icon: '◎' },
    { value: 'cross', label: 'Cross', icon: '✚' },
    { value: 'spiral', label: 'Spiral', icon: '◌' },
];

const PRESETS = [
    '#ffffff', '#cccccc', '#999999', '#666666',
    '#333333', '#000000', '#ff3b30', '#ff9500',
    '#ffcc00', '#34c759', '#007aff', '#af52de',
];

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
        rot += step;
        ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
}

function drawFlower(ctx, cx, cy, radius, petals, bulge) {
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 2; a += 0.01) {
        const r = radius + Math.sin(a * petals) * bulge;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
}

function drawPolygon(ctx, cx, cy, sides, radius) {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI / sides) - (Math.PI / 2);
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
}

function drawRing(ctx, cx, cy, outerR, innerR) {
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.arc(cx, cy, innerR, Math.PI * 2, 0, true);
    ctx.closePath();
}

function drawCross(ctx, cx, cy, size, thickness) {
    const t = size * thickness;
    ctx.beginPath();
    ctx.moveTo(cx - t, cy - size);
    ctx.lineTo(cx + t, cy - size);
    ctx.lineTo(cx + t, cy - t);
    ctx.lineTo(cx + size, cy - t);
    ctx.lineTo(cx + size, cy + t);
    ctx.lineTo(cx + t, cy + t);
    ctx.lineTo(cx + t, cy + size);
    ctx.lineTo(cx - t, cy + size);
    ctx.lineTo(cx - t, cy + t);
    ctx.lineTo(cx - size, cy + t);
    ctx.lineTo(cx - size, cy - t);
    ctx.lineTo(cx - t, cy - t);
    ctx.closePath();
}

function drawSpiral(ctx, cx, cy, radius, spoke) {
    ctx.beginPath();
    const loops = 3 + spoke * 5;
    const points = 600;
    for (let i = 0; i <= points; i++) {
        const t = i / points;
        const angle = t * loops * Math.PI * 2;
        const r = t * radius;
        const thickness = (1 - t * 0.4) * radius * 0.12;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    for (let i = points; i >= 0; i--) {
        const t = i / points;
        const angle = t * loops * Math.PI * 2;
        const r = t * radius + (1 - t * 0.4) * radius * 0.12;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        ctx.lineTo(x, y);
    }
    ctx.closePath();
}

/* ── Custom Dropdown ────────────────────────────────────── */
function CustomSelect({ value, options, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const current = options.find(o => o.value === value);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className={styles.customSelect} ref={ref}>
            <button className={styles.selectTrigger} onClick={() => setOpen(!open)}>
                <span className={styles.selectIcon}>{current?.icon}</span>
                <span>{current?.label}</span>
                <svg className={`${styles.selectChevron} ${open ? styles.selectChevronOpen : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            {open && (
                <div className={styles.selectMenu}>
                    {options.map(opt => (
                        <button key={opt.value} className={`${styles.selectOption} ${opt.value === value ? styles.selectOptionActive : ''}`}
                            onClick={() => { onChange(opt.value); setOpen(false); }}>
                            <span className={styles.selectIcon}>{opt.icon}</span>
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ── Custom Color Picker ────────────────────────────────── */
function ColorPicker({ value, onChange, label }) {
    const [open, setOpen] = useState(false);
    const [hex, setHex] = useState(value);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => { setHex(value); }, [value]);

    const handleHex = (v) => {
        setHex(v);
        if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v);
    };

    return (
        <div className={styles.colorPicker} ref={ref}>
            <button className={styles.colorSwatch} style={{ background: value }} onClick={() => setOpen(!open)}>
                {label && <span className={styles.colorLabel}>{label}</span>}
            </button>
            {open && (
                <div className={styles.colorPopover}>
                    <div className={styles.colorPresets}>
                        {PRESETS.map(c => (
                            <button key={c} className={`${styles.presetDot} ${c === value ? styles.presetDotActive : ''}`}
                                style={{ background: c }}
                                onClick={() => { onChange(c); setHex(c); }} />
                        ))}
                    </div>
                    <input className={styles.hexInput} value={hex} onChange={e => handleHex(e.target.value)}
                        placeholder="#000000" spellCheck={false} />
                </div>
            )}
        </div>
    );
}

/* ── Main Editor ────────────────────────────────────────── */
export default function EditorPage() {
    const canvasRef = useRef(null);
    const noiseCanvasRef = useRef(null);

    const [shape, setShape] = useState('star');
    const [corners, setCorners] = useState(4);
    const [size, setSize] = useState(180);
    const [rotation, setRotation] = useState(0);
    const [spoke, setSpoke] = useState(35);
    const [color1, setColor1] = useState('#ffffff');
    const [color2, setColor2] = useState('#888888');
    const [color3, setColor3] = useState('#333333');
    const [color4, setColor4] = useState('#000000');
    const [angle, setAngle] = useState(135);
    const [noise, setNoise] = useState(50);
    const [contrast, setContrast] = useState(65);

    const generateNoise = useCallback(() => {
        const nc = noiseCanvasRef.current;
        if (!nc) return;
        const ctx = nc.getContext('2d');
        const c = contrast / 100;
        const imgData = ctx.createImageData(1000, 1000);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
            const val = (Math.random() - 0.5) * 255 * (c * 2) + 128;
            d[i] = val; d[i + 1] = val; d[i + 2] = val; d[i + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
    }, [contrast]);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const nc = noiseCanvasRef.current;
        if (!canvas || !nc) return;

        const ctx = canvas.getContext('2d');
        const w = 1000, h = 1000;
        const cx = w / 2, cy = h / 2;
        const sz = size * 2;
        const rot = rotation * (Math.PI / 180);
        const spk = spoke / 100;
        const ang = angle * (Math.PI / 180);
        const noiseAlpha = noise / 100;

        ctx.clearRect(0, 0, w, h);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);

        switch (shape) {
            case 'star': drawStar(ctx, 0, 0, corners, sz, sz * spk); break;
            case 'polygon': drawPolygon(ctx, 0, 0, corners, sz); break;
            case 'circle': ctx.beginPath(); ctx.arc(0, 0, sz, 0, Math.PI * 2); break;
            case 'flower': drawFlower(ctx, 0, 0, sz, corners, sz * spk); break;
            case 'ring': drawRing(ctx, 0, 0, sz, sz * spk); break;
            case 'cross': drawCross(ctx, 0, 0, sz, spk * 0.5); break;
            case 'spiral': drawSpiral(ctx, 0, 0, sz, spk); break;
        }
        ctx.clip();

        const x1 = -Math.cos(ang) * sz;
        const y1 = -Math.sin(ang) * sz;
        const x2 = Math.cos(ang) * sz;
        const y2 = Math.sin(ang) * sz;
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(0.33, color2);
        gradient.addColorStop(0.66, color3);
        gradient.addColorStop(1, color4);
        ctx.fillStyle = gradient;
        ctx.fill();

        if (noiseAlpha > 0) {
            ctx.globalCompositeOperation = 'overlay';
            ctx.globalAlpha = noiseAlpha;
            ctx.drawImage(nc, -cx, -cy);
        }

        ctx.restore();
    }, [shape, size, rotation, spoke, corners, color1, color2, color3, color4, angle, noise, contrast]);

    useEffect(() => {
        const nc = document.createElement('canvas');
        nc.width = 1000; nc.height = 1000;
        noiseCanvasRef.current = nc;
        generateNoise();
        draw();
    }, []);

    useEffect(() => { generateNoise(); draw(); }, [contrast, generateNoise, draw]);
    useEffect(() => { draw(); }, [shape, size, rotation, spoke, corners, color1, color2, color3, color4, angle, noise, draw]);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.download = `shapeit-${Date.now()}.png`;
        link.href = canvasRef.current.toDataURL('image/png');
        link.click();
    };

    return (
        <>
            <Navbar />
            <div className={styles.layout}>
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <h2 className={styles.sidebarTitle}>Editor</h2>
                        <span className={styles.sidebarSub}>craft your shape</span>
                    </div>

                    <section className={styles.section}>
                        <label className={styles.label}>Shape</label>
                        <CustomSelect value={shape} options={SHAPES} onChange={setShape} />
                    </section>

                    <section className={styles.section}>
                        <label className={styles.label}>Size <span>{size}</span></label>
                        <input type="range" min="50" max="250" value={size} onChange={e => setSize(+e.target.value)} />

                        <label className={styles.label}>Rotation <span>{rotation}°</span></label>
                        <input type="range" min="0" max="360" value={rotation} onChange={e => setRotation(+e.target.value)} />

                        <label className={styles.label}>Spoke <span>{spoke}%</span></label>
                        <input type="range" min="10" max="100" value={spoke} onChange={e => setSpoke(+e.target.value)} />

                        <label className={styles.label}>Corners <span>{corners}</span></label>
                        <input type="range" min="3" max="32" value={corners} onChange={e => setCorners(+e.target.value)} />
                    </section>

                    <section className={styles.section}>
                        <label className={styles.label}>Gradient</label>
                        <div className={styles.colorGrid}>
                            <ColorPicker value={color1} onChange={setColor1} />
                            <ColorPicker value={color2} onChange={setColor2} />
                            <ColorPicker value={color3} onChange={setColor3} />
                            <ColorPicker value={color4} onChange={setColor4} />
                        </div>
                        <label className={styles.label}>Angle <span>{angle}°</span></label>
                        <input type="range" min="0" max="360" value={angle} onChange={e => setAngle(+e.target.value)} />
                    </section>

                    <section className={styles.section}>
                        <label className={styles.label}>Grain <span>{noise}%</span></label>
                        <input type="range" min="0" max="100" value={noise} onChange={e => setNoise(+e.target.value)} />

                        <label className={styles.label}>Contrast <span>{contrast}%</span></label>
                        <input type="range" min="0" max="100" value={contrast} onChange={e => setContrast(+e.target.value)} />
                    </section>

                    <button className={styles.downloadBtn} onClick={handleDownload}>
                        Export PNG
                    </button>
                </aside>

                <main className={styles.preview}>
                    <div className={styles.canvasFrame}>
                        <canvas ref={canvasRef} width={1000} height={1000} className={styles.canvas} />
                    </div>
                </main>
            </div>
        </>
    );
}
