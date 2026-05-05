'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = ['Program', 'Jadwal', 'Coach', 'Testimoni', 'FAQ'];

/**
 * Reusable Navbar.
 *
 * @param {Object}  props
 * @param {'transparent'|'solid'} [props.variant='transparent']
 *        transparent → blends into hero (sticky w/ blur)
 *        solid       → for inner pages (filled bg)
 * @param {string}  [props.ctaHref='/register']
 * @param {string}  [props.ctaLabel='Daftar Assessment']
 * @param {boolean} [props.showLinks=true]   hide links on minimal pages (e.g. register)
 */
export default function Navbar({
    variant = 'transparent',
    ctaHref = '/register',
    ctaLabel = 'Daftar Assessment',
    showLinks = true,
    ctaClassName = ''
}) {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const isSolid = variant === 'solid';

    return (
        <header
            className={[
                'sticky top-0 z-50 transition-colors duration-300',
                isSolid
                    ? 'bg-card/80 backdrop-blur-xl border-b border-border/50'
                    : scrolled
                        ? 'bg-background/80 backdrop-blur-xl border-b border-border/40'
                        : 'bg-transparent border-b border-transparent',
            ].join(' ')}
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="relative h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                        <span className="font-display font-bold text-xl text-primary-foreground">B</span>
                        <div className="absolute inset-0 rounded-lg ring-1 ring-primary/40" />
                    </div>
                    <div className="leading-none">
                        <div className="font-display font-bold text-lg tracking-wide">
                            BINSIK <span className="text-primary">PRO</span>
                        </div>
                        <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground/80 mt-0.5">
                            Train Hard. Pass Strong.
                        </div>
                    </div>
                </Link>

                {/* Desktop Nav */}
                {showLinks && (
                    <nav className="hidden lg:flex items-center gap-9">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link}
                                href={`/#${link.toLowerCase()}`}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                            >
                                {link}
                                <span className="absolute -bottom-1.5 left-0 right-0 mx-auto h-px w-0 bg-primary group-hover:w-full transition-all duration-300" />
                            </a>
                        ))}
                    </nav>
                )}

                {/* CTA Desktop */}
                <Link
                    href={ctaHref}
                    className={cn("hidden lg:inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition shadow-lg shadow-primary/20", ctaClassName)}
                >
                    {ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                </Link>

                {/* Mobile menu toggle */}
                {showLinks && (
                    <button
                        aria-label="menu"
                        onClick={() => setOpen(!open)}
                        className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-lg border border-border hover:bg-accent transition"
                    >
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                )}

                {/* Mobile CTA-only fallback when links hidden */}
                {!showLinks && (
                    <Link
                        href={ctaHref}
                        className="lg:hidden inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
                    >
                        {ctaLabel}
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                )}
            </div>

            {/* Mobile menu */}
            {showLinks && open && (
                <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
                    <div className="px-6 py-4 flex flex-col gap-1">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link}
                                href={`/#${link.toLowerCase()}`}
                                onClick={() => setOpen(false)}
                                className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                            >
                                {link}
                            </a>
                        ))}
                        <Link
                            href={ctaHref}
                            onClick={() => setOpen(false)}
                            className={cn("mt-2 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold", ctaClassName)}
                        >
                            {ctaLabel} <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}