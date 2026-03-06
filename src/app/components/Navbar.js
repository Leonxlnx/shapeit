'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Navbar.module.css';

const navItems = [
    { href: '/', label: 'Home' },
    { href: '/editor', label: 'Editor' },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className={styles.nav}>
            <Link href="/" className={styles.brand}>
                <span className={styles.brandText}>shapeit</span>
            </Link>

            <div className={styles.links}>
                {navItems.map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.link} ${pathname === item.href ? styles.active : ''}`}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
