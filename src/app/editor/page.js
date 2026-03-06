'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import styles from './page.module.css';

const SHAPES = [
    { value: 'star4', label: '4-Point Sparkle' },
    { value: 'star5', label: '5-Point Star' },
    { value: 'star8', label: '8-Point Burst' },
    { value: 'circle', label: 'Circle' },
    { value: 'square', label: 'Rounded Square' },
    { value: 'flower', label: 'Flower / Blob' },
    { value: 'hexagon', label: 'Hexagon' },
    { value: 'diamond', label: 'Diamond' },
];

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let step = Math.PI / spikes;
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

export default function EditorPage() {
    const canvasRef = useRef(null);
    const noiseCanvasRef = useRef(null);

    const [shape, setShape] = useState('star4');
    const [size, setSize] = useState(180);
    const [rotation, setRotation] = useState(0);
    const [spoke, setSpoke] = useState(35);
    const [color1, setColor1] = useState('#00f2fe');
    const [color2, setColor2] = useState('#4facfe');
    const [color3, setColor3] = useState('#ff4d6a');
    const [color4, setColor4] = useState('#ff6b35');
    const [angle, setAngle] = useState(45);
    const [noise, setNoise] = useState(45);
    const [contrast, setContrast] = useState(70);

    const generateNoise = useCallback(() => {
        const noiseCanvas = noiseCanvasRef.current;
        if (!noiseCanvas) return;
        const noiseCtx = noiseCanvas.getContext('2d');
        const c = contrast / 100;
        const imgData = noiseCtx.createImageData(1000, 1000);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
            const val = (Math.random() - 0.5) * 255 * (c * 2) + 128;
            data[i] = val;
            data[i + 1] = val;
            data[i + 2] = val;
            data[i + 3] = 255;
        }
        noiseCtx.putImageData(imgData, 0, 0);
    }, [contrast]);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const noiseCanvas = noiseCanvasRef.current;
        if (!canvas || !noiseCanvas) return;

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
            case 'star4': drawStar(ctx, 0, 0, 4, sz, sz * spk * 0.5); break;
            case 'star5': drawStar(ctx, 0, 0, 5, sz, sz * spk); break;
            case 'star8': drawStar(ctx, 0, 0, 8, sz, sz * spk); break;
            case 'circle': ctx.beginPath(); ctx.arc(0, 0, sz, 0, Math.PI * 2); break;
            case 'square': {
                ctx.beginPath();
                const r = sz * spk;
                ctx.roundRect(-sz, -sz, sz * 2, sz * 2, r);
                break;
            }
            case 'flower': drawFlower(ctx, 0, 0, sz, 8, sz * spk); break;
            case 'hexagon': drawPolygon(ctx, 0, 0, 6, sz); break;
            case 'diamond': drawPolygon(ctx, 0, 0, 4, sz); break;
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
            ctx.drawImage(noiseCanvas, -cx, -cy);
        }

        ctx.restore();
    }, [shape, size, rotation, spoke, color1, color2, color3, color4, angle, noise, contrast]);

    useEffect(() => {
        const nc = document.createElement('canvas');
        nc.width = 1000;
        nc.height = 1000;
        noiseCanvasRef.current = nc;
        generateNoise();
        draw();
    }, []);

    useEffect(() => { generateNoise(); draw(); }, [contrast, generateNoise, draw]);
    useEffect(() => { draw(); }, [shape, size, rotation, spoke, color1, color2, color3, color4, angle, noise, draw]);

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
                    <h2 className={styles.sidebarTitle}>
                        <span className="gradient-text">Shape Editor</span>
                    </h2>

                    <div className={styles.group}>
                        <label className="control-label">Shape</label>
                        <select value={shape} onChange={e => setShape(e.target.value)}>
                            {SHAPES.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.group}>
                        <label className="control-label">Size <span>{size}</span></label>
                        <input type="range" min="50" max="250" value={size} onChange={e => setSize(+e.target.value)} />

                        <label className="control-label">Rotation <span>{rotation}°</span></label>
                        <input type="range" min="0" max="360" value={rotation} onChange={e => setRotation(+e.target.value)} />

                        <label className="control-label">Spokes / Roundness <span>{spoke}%</span></label>
                        <input type="range" min="10" max="100" value={spoke} onChange={e => setSpoke(+e.target.value)} />
                    </div>

                    <div className={styles.group}>
                        <label className="control-label">Gradient Colors</label>
                        <div className={styles.colorRow}>
                            <input type="color" value={color1} onChange={e => setColor1(e.target.value)} />
                            <input type="color" value={color2} onChange={e => setColor2(e.target.value)} />
                            <input type="color" value={color3} onChange={e => setColor3(e.target.value)} />
                            <input type="color" value={color4} onChange={e => setColor4(e.target.value)} />
                        </div>

                        <label className="control-label">Gradient Angle <span>{angle}°</span></label>
                        <input type="range" min="0" max="360" value={angle} onChange={e => setAngle(+e.target.value)} />
                    </div>

                    <div className={styles.group}>
                        <label className="control-label">Grain / Noise <span>{noise}%</span></label>
                        <input type="range" min="0" max="100" value={noise} onChange={e => setNoise(+e.target.value)} />

                        <label className="control-label">Noise Contrast <span>{contrast}%</span></label>
                        <input type="range" min="0" max="100" value={contrast} onChange={e => setContrast(+e.target.value)} />
                    </div>

                    <button className={styles.downloadBtn} onClick={handleDownload}>
                        Download PNG ↓
                    </button>
                </aside>

                <main className={styles.preview}>
                    <div className={styles.canvasWrapper}>
                        <canvas ref={canvasRef} width={1000} height={1000} className={styles.canvas} />
                    </div>
                </main>
            </div>
        </>
    );
}
