import { AppSetting, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    ChevronRight,
    Database,
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Palette,
    Phone,
    Shield,
    Sparkles,
    Twitter,
    Users,
    Youtube,
    Zap,
} from 'lucide-react';

export default function Welcome() {
    const { auth, settings } = usePage<{ auth: SharedData['auth']; settings: AppSetting }>().props;

    return (
        <>
            <Head>
                <title>{settings.seo_title || settings.app_name}</title>
                <meta name="description" content={settings.seo_description || `Welcome to ${settings.app_name}`} />
                <meta name="keywords" content={settings.seo_keywords || 'laravel,react,web app'} />
                <meta property="og:title" content={settings.seo_title || settings.app_name} />
                <meta property="og:description" content={settings.seo_description || `Welcome to ${settings.app_name}`} />
                <meta property="og:type" content="website" />
                {settings.seo_og_image && <meta property="og:image" content={settings.seo_og_image} />}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={settings.seo_title || settings.app_name} />
                <meta name="twitter:description" content={settings.seo_description || `Welcome to ${settings.app_name}`} />
                {settings.seo_og_image && <meta name="twitter:image" content={settings.seo_og_image} />}
                <link rel="icon" href={settings.app_favicon || '/favicon.ico'} />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </Head>

            <div
                className="min-h-screen"
                style={{
                    background: `linear-gradient(135deg, ${settings.primary_color}08 0%, ${settings.secondary_color}05 50%, ${settings.accent_color}08 100%)`,
                }}
            >
                {/* Navigation */}
                <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-md">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-3">
                                {settings.app_logo && <img src={settings.app_logo} alt={settings.app_name} className="h-8 w-auto" />}
                                <span className="text-lg font-bold" style={{ color: settings.primary_color }}>
                                    {settings.app_name}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:scale-105"
                                        style={{ backgroundColor: settings.primary_color }}
                                    >
                                        Dashboard
                                        <ArrowRight size={16} />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:scale-105"
                                            style={{ backgroundColor: settings.accent_color }}
                                        >
                                            Get Started
                                            <ArrowRight size={16} />
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero */}
                <section className="relative px-6 py-20 text-center lg:py-32">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-8 flex animate-pulse items-center justify-center gap-2">
                            <div className="rounded-full p-2" style={{ backgroundColor: `${settings.accent_color}20` }}>
                                <Sparkles size={24} style={{ color: settings.accent_color }} />
                            </div>
                            <span className="rounded-full bg-white/80 px-4 py-2 text-base font-medium text-gray-600 shadow-sm">
                                Modern Web Application Platform
                            </span>
                        </div>

                        <h1 className="mb-8 text-6xl leading-none font-black tracking-tight md:text-8xl">
                            <span
                                className="bg-gradient-to-r bg-clip-text text-transparent"
                                style={{
                                    backgroundImage: `linear-gradient(135deg, ${settings.primary_color}, ${settings.accent_color})`,
                                }}
                            >
                                {settings.app_name}
                            </span>
                        </h1>

                        <p className="mx-auto mb-12 max-w-4xl text-2xl leading-relaxed font-light text-gray-700 md:text-3xl">
                            {settings.app_description || 'Build amazing web applications with cutting-edge technology and powerful features.'}
                        </p>

                        {!auth.user && (
                            <div className="mb-16 flex flex-col items-center justify-center gap-6 sm:flex-row">
                                <Link
                                    href={route('register')}
                                    className="group hover:shadow-3xl flex transform-gpu items-center justify-center gap-3 rounded-2xl px-12 py-5 text-xl font-bold text-white shadow-2xl transition-all hover:scale-105"
                                    style={{
                                        backgroundColor: settings.primary_color,
                                        boxShadow: `0 20px 50px ${settings.primary_color}30`,
                                    }}
                                >
                                    Mulai Sekarang
                                    <ChevronRight className="transition-transform group-hover:translate-x-1" size={24} />
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="rounded-2xl border-3 bg-white/80 px-12 py-5 text-xl font-semibold shadow-lg backdrop-blur-sm transition-all hover:scale-105"
                                    style={{
                                        borderColor: settings.secondary_color,
                                        color: settings.secondary_color,
                                    }}
                                >
                                    Masuk
                                </Link>
                            </div>
                        )}

                        {/* Stats or badges */}
                        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
                            <div className="rounded-2xl bg-white/60 p-6 text-center shadow-lg backdrop-blur-sm">
                                <div className="mb-2 flex justify-center">
                                    <Sparkles size={32} style={{ color: settings.primary_color }} />
                                </div>
                                <div className="mb-1 text-lg font-bold" style={{ color: settings.primary_color }}>
                                    Open Source
                                </div>
                                <div className="text-sm text-gray-600">Free for everyone</div>
                            </div>
                            <div className="rounded-2xl bg-white/60 p-6 text-center shadow-lg backdrop-blur-sm">
                                <div className="mb-2 flex justify-center">
                                    <Shield size={32} style={{ color: settings.accent_color }} />
                                </div>
                                <div className="mb-1 text-lg font-bold" style={{ color: settings.accent_color }}>
                                    MIT Licensed
                                </div>
                                <div className="text-sm text-gray-600">Permissive & safe to use</div>
                            </div>
                            <div className="rounded-2xl bg-white/60 p-6 text-center shadow-lg backdrop-blur-sm">
                                <div className="mb-2 flex justify-center">
                                    <Palette size={32} style={{ color: settings.secondary_color }} />
                                </div>
                                <div className="mb-1 text-lg font-bold" style={{ color: settings.secondary_color }}>
                                    Customizable
                                </div>
                                <div className="text-sm text-gray-600">Easy to adapt & extend</div>
                            </div>
                            <div className="rounded-2xl bg-white/60 p-6 text-center shadow-lg backdrop-blur-sm">
                                <div className="mb-2 flex justify-center">
                                    <Users size={32} style={{ color: settings.primary_color }} />
                                </div>
                                <div className="mb-1 text-lg font-bold" style={{ color: settings.primary_color }}>
                                    Community Driven
                                </div>
                                <div className="text-sm text-gray-600">Built with contributors</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="bg-gradient-to-br from-white via-gray-50 to-white px-6 py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <div className="mb-6 inline-flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: settings.primary_color }} />
                                <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: settings.primary_color }}>
                                    Key Features
                                </span>
                            </div>
                            <h2 className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
                                Why Choose
                                <span style={{ color: settings.accent_color }}> {settings.app_name}</span>?
                            </h2>
                            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
                                Built with the latest technology and best practices for scalable and powerful web applications.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            <div className="group relative rounded-3xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="relative">
                                    <div
                                        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110"
                                        style={{ backgroundColor: settings.primary_color }}
                                    >
                                        <Shield size={32} className="text-white" />
                                    </div>
                                    <h3 className="mb-4 text-xl font-bold text-gray-900">Security & Role Permission</h3>
                                    <p className="leading-relaxed text-gray-600">
                                        Secure authentication system with role-based permission using <b>Spatie Role Permission</b> for user access
                                        management.
                                    </p>
                                </div>
                            </div>

                            <div className="group relative rounded-3xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="relative">
                                    <div
                                        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110"
                                        style={{ backgroundColor: settings.accent_color }}
                                    >
                                        <Database size={32} className="text-white" />
                                    </div>
                                    <h3 className="mb-4 text-xl font-bold text-gray-900">File & Media Management</h3>
                                    <p className="leading-relaxed text-gray-600">
                                        Manage files and media efficiently with the powerful and flexible <b>Spatie Media Library</b>.
                                    </p>
                                </div>
                            </div>

                            <div className="group relative rounded-3xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="relative">
                                    <div
                                        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110"
                                        style={{ backgroundColor: settings.secondary_color }}
                                    >
                                        <Palette size={32} className="text-white" />
                                    </div>
                                    <h3 className="mb-4 text-xl font-bold text-gray-900">Dynamic Theme</h3>
                                    <p className="leading-relaxed text-gray-600">
                                        Customize the theme in real-time with a flexible and easy-to-use settings system.
                                    </p>
                                </div>
                            </div>

                            <div className="group relative rounded-3xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-50 to-yellow-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="relative">
                                    <div
                                        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110"
                                        style={{ backgroundColor: settings.primary_color }}
                                    >
                                        <Zap size={32} className="text-white" />
                                    </div>
                                    <h3 className="mb-4 text-xl font-bold text-gray-900">High Performance</h3>
                                    <p className="leading-relaxed text-gray-600">
                                        Built with React, Inertia.js & Tailwind CSS for optimal performance and the best user experience.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact & Social */}
                {(settings.contact_email ||
                    settings.contact_phone ||
                    settings.contact_address ||
                    (settings.social_links && Object.values(settings.social_links).some((link) => link))) && (
                    <section className="px-6 py-16" style={{ backgroundColor: `${settings.primary_color}05` }}>
                        <div className="mx-auto max-w-5xl">
                            <div className="mb-12 text-center">
                                <h2 className="mb-4 text-3xl font-bold text-gray-900">Let's Connect</h2>
                                <p className="text-gray-600">Ready to start your journey? Get in touch with us.</p>
                            </div>

                            <div className="grid items-start gap-12 md:grid-cols-2">
                                {/* Contact Info */}
                                {(settings.contact_email || settings.contact_phone || settings.contact_address) && (
                                    <div className="space-y-6">
                                        {settings.contact_email && (
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                                                    style={{ backgroundColor: `${settings.accent_color}20` }}
                                                >
                                                    <Mail size={20} style={{ color: settings.accent_color }} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Email</h4>
                                                    <a href={`mailto:${settings.contact_email}`} className="text-gray-600 hover:underline">
                                                        {settings.contact_email}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {settings.contact_phone && (
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                                                    style={{ backgroundColor: `${settings.accent_color}20` }}
                                                >
                                                    <Phone size={20} style={{ color: settings.accent_color }} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Phone</h4>
                                                    <a href={`tel:${settings.contact_phone}`} className="text-gray-600 hover:underline">
                                                        {settings.contact_phone}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {settings.contact_address && (
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                                                    style={{ backgroundColor: `${settings.accent_color}20` }}
                                                >
                                                    <MapPin size={20} style={{ color: settings.accent_color }} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Address</h4>
                                                    <p className="text-gray-600">{settings.contact_address}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Social Links */}
                                {settings.social_links && Object.values(settings.social_links).some((link) => link) && (
                                    <div className="text-center md:text-left">
                                        <h3 className="mb-6 font-semibold text-gray-900">Follow Our Journey</h3>
                                        <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                                            {settings.social_links.facebook && (
                                                <a
                                                    href={settings.social_links.facebook}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white transition-transform hover:scale-110"
                                                >
                                                    <Facebook size={20} />
                                                </a>
                                            )}
                                            {settings.social_links.twitter && (
                                                <a
                                                    href={settings.social_links.twitter}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500 text-white transition-transform hover:scale-110"
                                                >
                                                    <Twitter size={20} />
                                                </a>
                                            )}
                                            {settings.social_links.instagram && (
                                                <a
                                                    href={settings.social_links.instagram}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white transition-transform hover:scale-110"
                                                >
                                                    <Instagram size={20} />
                                                </a>
                                            )}
                                            {settings.social_links.linkedin && (
                                                <a
                                                    href={settings.social_links.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-white transition-transform hover:scale-110"
                                                >
                                                    <Linkedin size={20} />
                                                </a>
                                            )}
                                            {settings.social_links.youtube && (
                                                <a
                                                    href={settings.social_links.youtube}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white transition-transform hover:scale-110"
                                                >
                                                    <Youtube size={20} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer
                    className="relative overflow-hidden py-16 text-white"
                    style={{
                        background: `linear-gradient(135deg, ${settings.primary_color}, ${settings.secondary_color})`,
                    }}
                >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative mx-auto max-w-6xl px-6">
                        <div className="mb-12 text-center">
                            <div className="mb-6 flex items-center justify-center gap-4">
                                {settings.app_logo && (
                                    <img src={settings.app_logo} alt={settings.app_name} className="h-10 w-auto brightness-0 invert filter" />
                                )}
                                <span className="text-2xl font-bold">{settings.app_name}</span>
                            </div>
                            <p className="mx-auto max-w-2xl text-lg opacity-90">
                                {settings.app_description || 'Building the future of web applications with modern technology.'}
                            </p>
                        </div>

                        <div className="mb-12 grid gap-8 md:grid-cols-3">
                            <div className="text-center md:text-left">
                                <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>
                                <div className="space-y-2">
                                    {!auth.user && (
                                        <>
                                            <Link href={route('login')} className="block opacity-90 transition-opacity hover:opacity-100">
                                                Sign In
                                            </Link>
                                            <Link href={route('register')} className="block opacity-90 transition-opacity hover:opacity-100">
                                                Get Started
                                            </Link>
                                        </>
                                    )}
                                    {auth.user && (
                                        <Link href={route('dashboard')} className="block opacity-90 transition-opacity hover:opacity-100">
                                            Dashboard
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {settings.contact_email && (
                                <div className="text-center md:text-left">
                                    <h4 className="mb-4 text-lg font-semibold">Contact</h4>
                                    <div className="space-y-2">
                                        <a
                                            href={`mailto:${settings.contact_email}`}
                                            className="block opacity-90 transition-opacity hover:opacity-100"
                                        >
                                            {settings.contact_email}
                                        </a>
                                        {settings.contact_phone && (
                                            <a
                                                href={`tel:${settings.contact_phone}`}
                                                className="block opacity-90 transition-opacity hover:opacity-100"
                                            >
                                                {settings.contact_phone}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="text-center md:text-right">
                                <h4 className="mb-4 text-lg font-semibold">Follow Us</h4>
                                <div className="flex justify-center gap-4 md:justify-end">
                                    {settings.social_links?.facebook && (
                                        <a
                                            href={settings.social_links.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 transition-colors hover:bg-white/30"
                                        >
                                            <Facebook size={18} />
                                        </a>
                                    )}
                                    {settings.social_links?.twitter && (
                                        <a
                                            href={settings.social_links.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 transition-colors hover:bg-white/30"
                                        >
                                            <Twitter size={18} />
                                        </a>
                                    )}
                                    {settings.social_links?.instagram && (
                                        <a
                                            href={settings.social_links.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 transition-colors hover:bg-white/30"
                                        >
                                            <Instagram size={18} />
                                        </a>
                                    )}
                                    {settings.social_links?.linkedin && (
                                        <a
                                            href={settings.social_links.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 transition-colors hover:bg-white/30"
                                        >
                                            <Linkedin size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-white/20 pt-8 text-center">
                            <p className="opacity-75">
                                © {new Date().getFullYear()} {settings.app_name}. Made with ❤️ using Laravel & React.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
