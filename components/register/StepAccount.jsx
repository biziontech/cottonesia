'use client';

import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Lock, UserCircle2, MarsIcon, VenusIcon } from 'lucide-react';

/**
 * Step 1 — Data Diri
 *
 * Controlled component:
 *   value: { nama, email, hp, password, confirmPassword, gender }
 *   onChange: (next) => void
 *   errors?: { fieldKey: 'message' }
 */
export default function StepAccount({ value, onChange, errors = {} }) {
    const [showPwd, setShowPwd] = useState(false);
    const [showCfm, setShowCfm] = useState(false);

    const set = (key, v) => onChange({ ...value, [key]: v });

    const fields = [
        { k: 'nama', label: 'Nama Lengkap', placeholder: 'Andi Pratama', icon: User, type: 'text' },
        { k: 'email', label: 'Email', placeholder: 'andi@email.com', icon: Mail, type: 'email' },
        { k: 'hp', label: 'No. HP (WhatsApp)', placeholder: '08xx-xxxx-xxxx', icon: Phone, type: 'tel' },
    ];

    return (
        <div className="space-y-5">
            <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl">Buat Akun Kamu</h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                    Isi data dasar untuk mulai. Semua data dijaga aman.
                </p>
            </div>

            <div className="space-y-4">
                {fields.map((f) => (
                    <Field
                        key={f.k}
                        label={f.label}
                        icon={f.icon}
                        error={errors[f.k]}
                    >
                        <input
                            type={f.type}
                            value={value[f.k] || ''}
                            onChange={(e) => set(f.k, e.target.value)}
                            placeholder={f.placeholder}
                            className="w-full h-12 pl-11 pr-4 bg-background/40 border border-border rounded-xl text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition"
                        />
                    </Field>
                ))}

                {/* Password */}
                <Field label="Password" icon={Lock} error={errors.password} hint="Minimal 8 karakter">
                    <input
                        type={showPwd ? 'text' : 'password'}
                        value={value.password || ''}
                        onChange={(e) => set('password', e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-12 pl-11 pr-12 bg-background/40 border border-border rounded-xl text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPwd((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition"
                        aria-label={showPwd ? 'Sembunyikan password' : 'Tampilkan password'}
                    >
                        {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </Field>

                {/* Confirm */}
                <Field label="Konfirmasi Password" icon={Lock} error={errors.confirmPassword}>
                    <input
                        type={showCfm ? 'text' : 'password'}
                        value={value.confirmPassword || ''}
                        onChange={(e) => set('confirmPassword', e.target.value)}
                        placeholder="Ulangi password"
                        className="w-full h-12 pl-11 pr-12 bg-background/40 border border-border rounded-xl text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition"
                    />
                    <button
                        type="button"
                        onClick={() => setShowCfm((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition"
                        aria-label={showCfm ? 'Sembunyikan password' : 'Tampilkan password'}
                    >
                        {showCfm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </Field>

                {/* Gender */}
                <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-2">
                        Jenis Kelamin
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { v: 'L', label: 'Laki-laki' },
                            { v: 'P', label: 'Perempuan' },
                        ].map(({ v, label }) => {
                            const active = value.gender === v;
                            return (
                                <button
                                    key={v}
                                    type="button"
                                    onClick={() => set('gender', v)}
                                    className={[
                                        'h-12 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2',
                                        active
                                            ? 'bg-primary/15 border-2 border-primary text-primary'
                                            : 'bg-background/40 border-2 border-border text-muted-foreground hover:border-primary/30',
                                    ].join(' ')}
                                >
                                    {v == 'L' ? <MarsIcon className="h-4 w-4" /> : <VenusIcon className="h-4 w-4" />}
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <p className="text-xs text-muted-foreground/80 leading-relaxed pt-2">
                Dengan melanjutkan, kamu menyetujui{' '}
                <a href="#" className="text-primary hover:underline">Syarat &amp; Ketentuan</a> dan{' '}
                <a href="#" className="text-primary hover:underline">Kebijakan Privasi</a> BINSIK PRO.
            </p>
        </div>
    );
}

// ─── Field ───────────────────────────────────────────────────────────────────

function Field({ label, icon: Icon, error, hint, children }) {
    return (
        <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-2">
                {label}
            </label>
            <div className="relative">
                <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
                {children}
            </div>
            {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
            {!error && hint && <p className="mt-1.5 text-xs text-muted-foreground/70">{hint}</p>}
        </div>
    );
}
