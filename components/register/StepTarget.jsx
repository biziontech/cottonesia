'use client';

import { Check, Crosshair, ShieldCheck, Medal } from 'lucide-react';

const TARGET_GROUPS = [
    {
        id: 'tni',
        title: 'TNI',
        icon: Crosshair,
        accent: 'emerald',
        items: ['Akmil', 'AAL', 'AAU', 'Bintara TNI', 'Tamtama TNI'],
    },
    {
        id: 'polri',
        title: 'POLRI',
        icon: ShieldCheck,
        accent: 'sky',
        items: ['Akpol', 'Bintara Polri', 'Tamtama Polri'],
    },
    {
        id: 'kedinasan',
        title: 'KEDINASAN',
        icon: Medal,
        accent: 'amber',
        items: ['IPDN', 'STAN', 'STIN', 'STMKG', 'Poltekim', 'Poltekip'],
    },
];

/**
 * Step 2 — Pilih Target Sekolah
 *
 * value: string[]    selected target labels
 * onChange: (next) => void
 */
export default function StepTarget({ value = [], onChange }) {
    const toggle = (item) => {
        const next = value.includes(item) ? value.filter((x) => x !== item) : [...value, item];
        onChange(next);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl">Pilih Target Sekolah</h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                    Pilih satu atau lebih instansi yang ingin kamu tuju. Bisa diubah nanti.
                </p>
            </div>

            {/* Counter */}
            <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                <span className="text-sm text-muted-foreground">Target dipilih</span>
                <span className="font-display font-bold text-lg text-primary">
                    {value.length}{' '}
                    <span className="text-xs font-medium text-muted-foreground">target</span>
                </span>
            </div>

            {/* Groups */}
            <div className="space-y-5">
                {TARGET_GROUPS.map((group) => (
                    <TargetGroup key={group.id} group={group} value={value} onToggle={toggle} />
                ))}
            </div>
        </div>
    );
}

// ─── Group ───────────────────────────────────────────────────────────────────

function TargetGroup({ group, value, onToggle }) {
    const Icon = group.icon;
    const selectedInGroup = group.items.filter((i) => value.includes(i)).length;

    return (
        <div className="rounded-2xl border border-border bg-card/40 p-5">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-lg bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                    <div className="font-display font-bold text-base tracking-wide">{group.title}</div>
                </div>
                {selectedInGroup > 0 && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                        {selectedInGroup} dipilih
                    </span>
                )}
            </div>

            <div className="flex flex-wrap gap-2">
                {group.items.map((item) => {
                    const active = value.includes(item);
                    return (
                        <button
                            key={item}
                            type="button"
                            onClick={() => onToggle(item)}
                            className={[
                                'group inline-flex items-center gap-2 px-4 h-10 rounded-full text-sm font-medium transition',
                                'border',
                                active
                                    ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                                    : 'bg-background/40 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground',
                            ].join(' ')}
                        >
                            <span
                                className={[
                                    'inline-flex items-center justify-center h-4 w-4 rounded-full transition',
                                    active
                                        ? 'bg-primary-foreground/20'
                                        : 'border border-border group-hover:border-primary/40',
                                ].join(' ')}
                            >
                                {active && <Check className="h-3 w-3" />}
                            </span>
                            {item}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
