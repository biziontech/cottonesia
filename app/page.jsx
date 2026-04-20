'use client';

import Script from 'next/script';
import { toast } from "sonner";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettings } from '@/contexts/SettingsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export default function AdminLoginPage() {
    const router = useRouter();
    const { loginAdmin } = useAuth();
    const recaptchaRef = useRef(null);
    const { settings } = useSettings();

    const data = {
        app: {
            name: settings?.site_name || '',
            logo_type: settings?.logo_type || '',
            logo_url: settings?.logo_url || '',
            logo_icon: settings?.logo_icon ? LucideIcons[settings?.logo_icon] : LucideIcons.Box,
            logo_rectangle_url: settings?.logo_rectangle_url || '',
            description: settings?.site_description || '',
            tagline: settings?.site_tagline || '',
        }
    };

    console.log(data);

    // Cek apakah reCAPTCHA diaktifkan dari environment variable
    const isRecaptchaEnabled = process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === 'true';
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [recaptchaToken, setRecaptchaToken] = useState(null);

    useEffect(() => {
        // Hanya load reCAPTCHA jika diaktifkan
        if (!isRecaptchaEnabled) return;

        window.onRecaptchaLoad = () => {
            if (window.grecaptcha && recaptchaRef.current) {
                window.grecaptcha.render(recaptchaRef.current, {
                    sitekey: recaptchaSiteKey,
                    callback: (token) => {
                        setRecaptchaToken(token);
                    },
                    "expired-callback": () => {
                        setRecaptchaToken(null);
                    }
                });
            }
        };
    }, [isRecaptchaEnabled, recaptchaSiteKey]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFieldErrors({});

        // Validasi reCAPTCHA hanya jika diaktifkan
        if (isRecaptchaEnabled && !recaptchaToken) {
            toast.error('Silakan centang "I\'m not a robot" terlebih dahulu');
            setLoading(false);
            return;
        }

        const loginPromise = (async () => {
            const result = await loginAdmin(
                formData.email,
                formData.password,
                isRecaptchaEnabled ? recaptchaToken : null
            );

            if (result.success) {
                return result;
            }
            throw result;
        })();

        toast.promise(loginPromise, {
            loading: "Processing login...",
            success: () => {
                setLoading(false);
                router.push('/app/panel/dashboard');
                return "Login successful. Redirecting...";
            },
            error: (err) => {
                if (err.errors) {
                    setFieldErrors(err.errors);
                }

                // Reset reCAPTCHA hanya jika diaktifkan
                if (isRecaptchaEnabled && window.grecaptcha) {
                    window.grecaptcha.reset();
                }
                setRecaptchaToken(null);
                setLoading(false);

                return err.message || "Login failed";
            },
        });
    };

    const isImageLogo = (data?.app?.logo_type == 'image' && data?.app?.logo_url);

    return (
        <>
            {/* Load Script reCAPTCHA hanya jika diaktifkan */}
            {isRecaptchaEnabled && (
                <Script
                    src="https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
                    strategy="afterInteractive"
                />
            )}

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-950 dark:to-zinc-800 p-4">
                <Card className="w-full max-w-sm shadow-lg relative overflow-hidden rounded-3xl">
                    <div className="bg-card-login absolute inset-0 z-0 -top-px -left-px pointer-events-none"></div>
                    <CardHeader className="space-y-1 z-1">
                        <div className='px-3 py-2 rounded w-fit mx-auto mt-7 flex items-center gap-2'>
                            <div className={`flex aspect-square size-8 items-center justify-center rounded-lg ${isImageLogo ? '' : 'overflow-hidden'}`}>
                                {isImageLogo ? (
                                    <img
                                        src={data?.app?.logo_url}
                                        className='object-cover scale-90'
                                    />
                                ) : (
                                    <data.app.logo_icon className="size-6" />
                                )}
                            </div>
                            <div className="flex flex-1 text-left text-sm leading-tight items-center">
                                {data.app.name ? (
                                    <span className="truncate font-semibold font-poppins text-lg text-zinc-700 dark:text-zinc-100">
                                        {data.app.name}
                                    </span>
                                ) : (
                                    <Skeleton className="h-[18px] mt-2 w-30 mb-1.5" />
                                )}
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center mt-4">Login Staff</CardTitle>
                        <CardDescription className="text-center">
                            Silakan masukkan email dan password Anda untuk mengakses dashboard staff
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                    className={fieldErrors.email ? 'border-red-500' : ''}
                                />
                                {fieldErrors.email && (
                                    <p className="text-sm text-red-500">{fieldErrors.email[0]}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        required
                                        className={fieldErrors.password ? 'border-red-500 pr-10' : 'pr-10'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        disabled={loading}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {fieldErrors.password && (
                                    <p className="text-sm text-red-500">{fieldErrors.password[0]}</p>
                                )}
                            </div>

                            {/* Tampilkan reCAPTCHA hanya jika diaktifkan */}
                            {isRecaptchaEnabled && (
                                <div className="flex justify-center items-center">
                                    <div className="scale-[0.8] origin-top-left w-fit h-16 mx-auto">
                                        <div ref={recaptchaRef}></div>
                                    </div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full rounded-lg"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </Button>
                        </form>

                        {/* Tampilkan text reCAPTCHA hanya jika diaktifkan */}
                        {isRecaptchaEnabled && (
                            <p className="text-xs text-center text-gray-500 mt-10">
                                Dilindungi oleh reCAPTCHA Google
                            </p>
                        )}

                        <div className={`${isRecaptchaEnabled ? 'mt-1.5' : 'mt-10'} text-center text-sm text-gray-600`}>
                            <p>Lupa password? Hubungi administrator</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}