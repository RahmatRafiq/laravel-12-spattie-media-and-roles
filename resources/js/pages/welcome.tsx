import { AppSetting, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Shield,
    Database,
    Palette,
    Zap,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    ChevronRight,
    Sparkles,
    ArrowRight,
    Users
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
                    background: `linear-gradient(135deg, ${settings.primary_color}08 0%, ${settings.secondary_color}05 50%, ${settings.accent_color}08 100%)`
                }}
            >
                {/* Navigation */}
                <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                {settings.app_logo && (
                                    <img
                                        src={settings.app_logo}
                                        alt={settings.app_name}
                                        className="h-8 w-auto"
                                    />
                                )}
                                <span className="text-lg font-bold" style={{ color: settings.primary_color }}>
                                    {settings.app_name}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all hover:scale-105"
                                        style={{ backgroundColor: settings.primary_color }}
                                    >
                                        Dashboard
                                        <ArrowRight size={16} />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all hover:scale-105"
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
                <section className="px-6 py-20 lg:py-32 text-center relative">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center justify-center gap-2 mb-8 animate-pulse">
                            <div
                                className="p-2 rounded-full"
                                style={{ backgroundColor: `${settings.accent_color}20` }}
                            >
                                <Sparkles size={24} style={{ color: settings.accent_color }} />
                            </div>
                            <span className="text-base font-medium text-gray-600 bg-white/80 px-4 py-2 rounded-full shadow-sm">
                                Modern Web Application Platform
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none tracking-tight">
                            <span
                                className="bg-gradient-to-r bg-clip-text text-transparent"
                                style={{
                                    backgroundImage: `linear-gradient(135deg, ${settings.primary_color}, ${settings.accent_color})`
                                }}
                            >
                                {settings.app_name}
                            </span>
                        </h1>

                        <p className="text-2xl md:text-3xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                            {settings.app_description || 'Build amazing web applications with cutting-edge technology and powerful features.'}
                        </p>

                        {!auth.user && (
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                                <Link
                                    href={route('register')}
                                    className="group flex items-center justify-center gap-3 px-12 py-5 text-xl font-bold text-white rounded-2xl transition-all hover:scale-105 transform-gpu shadow-2xl hover:shadow-3xl"
                                    style={{
                                        backgroundColor: settings.primary_color,
                                        boxShadow: `0 20px 50px ${settings.primary_color}30`
                                    }}
                                >
                                    Mulai Sekarang
                                    <ChevronRight className="group-hover:translate-x-1 transition-transform" size={24} />
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="px-12 py-5 text-xl font-semibold rounded-2xl border-3 transition-all hover:scale-105 bg-white/80 backdrop-blur-sm shadow-lg"
                                    style={{
                                        borderColor: settings.secondary_color,
                                        color: settings.secondary_color
                                    }}
                                >
                                    Masuk
                                </Link>
                            </div>
                        )}

                        {/* Stats or badges */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
                            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
                                <div className="flex justify-center mb-2">
                                    <Sparkles size={32} style={{ color: settings.primary_color }} />
                                </div>
                                <div className="text-lg font-bold mb-1" style={{ color: settings.primary_color }}>
                                    Open Source
                                </div>
                                <div className="text-sm text-gray-600">Free for everyone</div>
                            </div>
                            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
                                <div className="flex justify-center mb-2">
                                    <Shield size={32} style={{ color: settings.accent_color }} />
                                </div>
                                <div className="text-lg font-bold mb-1" style={{ color: settings.accent_color }}>
                                    MIT Licensed
                                </div>
                                <div className="text-sm text-gray-600">Permissive & safe to use</div>
                            </div>
                            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
                                <div className="flex justify-center mb-2">
                                    <Palette size={32} style={{ color: settings.secondary_color }} />
                                </div>
                                <div className="text-lg font-bold mb-1" style={{ color: settings.secondary_color }}>
                                    Customizable
                                </div>
                                <div className="text-sm text-gray-600">Easy to adapt & extend</div>
                            </div>
                            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
                                <div className="flex justify-center mb-2">
                                    <Users size={32} style={{ color: settings.primary_color }} />
                                </div>
                                <div className="text-lg font-bold mb-1" style={{ color: settings.primary_color }}>
                                    Community Driven
                                </div>
                                <div className="text-sm text-gray-600">Built with contributors</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="px-6 py-20 bg-gradient-to-br from-white via-gray-50 to-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 mb-6">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: settings.primary_color }}
                                />
                                <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: settings.primary_color }}>
                                    Key Features
                                </span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                Why Choose
                                <span style={{ color: settings.accent_color }}> {settings.app_name}</span>?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Built with the latest technology and best practices for scalable and powerful web applications.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="group relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative">
                                    <div
                                        className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                                        style={{ backgroundColor: settings.primary_color }}
                                    >
                                        <Shield size={32} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Security & Role Permission
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Secure authentication system with role-based permission using <b>Spatie Role Permission</b> for user access management.
                                    </p>
                                </div>
                            </div>

                            <div className="group relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative">
                                    <div
                                        className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                                        style={{ backgroundColor: settings.accent_color }}
                                    >
                                        <Database size={32} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        File & Media Management
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Manage files and media efficiently with the powerful and flexible <b>Spatie Media Library</b>.
                                    </p>
                                </div>
                            </div>

                            <div className="group relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative">
                                    <div
                                        className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                                        style={{ backgroundColor: settings.secondary_color }}
                                    >
                                        <Palette size={32} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Dynamic Theme
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Customize the theme in real-time with a flexible and easy-to-use settings system.
                                    </p>
                                </div>
                            </div>

                            <div className="group relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative">
                                    <div
                                        className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                                        style={{ backgroundColor: settings.primary_color }}
                                    >
                                        <Zap size={32} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        High Performance
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Built with React, Inertia.js & Tailwind CSS for optimal performance and the best user experience.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact & Social */}
                {(settings.contact_email || settings.contact_phone || settings.contact_address ||
                    (settings.social_links && Object.values(settings.social_links).some(link => link))) && (
                        <section className="px-6 py-16" style={{ backgroundColor: `${settings.primary_color}05` }}>
                            <div className="max-w-5xl mx-auto">
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                        Let's Connect
                                    </h2>
                                    <p className="text-gray-600">
                                        Ready to start your journey? Get in touch with us.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-12 items-start">
                                    {/* Contact Info */}
                                    {(settings.contact_email || settings.contact_phone || settings.contact_address) && (
                                        <div className="space-y-6">
                                            {settings.contact_email && (
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                                                        style={{ backgroundColor: `${settings.accent_color}20` }}
                                                    >
                                                        <Mail size={20} style={{ color: settings.accent_color }} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">Email</h4>
                                                        <a
                                                            href={`mailto:${settings.contact_email}`}
                                                            className="text-gray-600 hover:underline"
                                                        >
                                                            {settings.contact_email}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}

                                            {settings.contact_phone && (
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                                                        style={{ backgroundColor: `${settings.accent_color}20` }}
                                                    >
                                                        <Phone size={20} style={{ color: settings.accent_color }} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">Phone</h4>
                                                        <a
                                                            href={`tel:${settings.contact_phone}`}
                                                            className="text-gray-600 hover:underline"
                                                        >
                                                            {settings.contact_phone}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}

                                            {settings.contact_address && (
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
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
                                    {settings.social_links && Object.values(settings.social_links).some(link => link) && (
                                        <div className="text-center md:text-left">
                                            <h3 className="font-semibold text-gray-900 mb-6">Follow Our Journey</h3>
                                            <div className="flex justify-center md:justify-start gap-4 flex-wrap">
                                                {settings.social_links.facebook && (
                                                    <a
                                                        href={settings.social_links.facebook}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white transition-transform hover:scale-110"
                                                    >
                                                        <Facebook size={20} />
                                                    </a>
                                                )}
                                                {settings.social_links.twitter && (
                                                    <a
                                                        href={settings.social_links.twitter}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center text-white transition-transform hover:scale-110"
                                                    >
                                                        <Twitter size={20} />
                                                    </a>
                                                )}
                                                {settings.social_links.instagram && (
                                                    <a
                                                        href={settings.social_links.instagram}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white transition-transform hover:scale-110"
                                                    >
                                                        <Instagram size={20} />
                                                    </a>
                                                )}
                                                {settings.social_links.linkedin && (
                                                    <a
                                                        href={settings.social_links.linkedin}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center text-white transition-transform hover:scale-110"
                                                    >
                                                        <Linkedin size={20} />
                                                    </a>
                                                )}
                                                {settings.social_links.youtube && (
                                                    <a
                                                        href={settings.social_links.youtube}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white transition-transform hover:scale-110"
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
                    className="relative py-16 text-white overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, ${settings.primary_color}, ${settings.secondary_color})`
                    }}
                >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative max-w-6xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <div className="flex items-center justify-center gap-4 mb-6">
                                {settings.app_logo && (
                                    <img
                                        src={settings.app_logo}
                                        alt={settings.app_name}
                                        className="h-10 w-auto filter brightness-0 invert"
                                    />
                                )}
                                <span className="text-2xl font-bold">{settings.app_name}</span>
                            </div>
                            <p className="text-lg opacity-90 max-w-2xl mx-auto">
                                {settings.app_description || 'Building the future of web applications with modern technology.'}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            <div className="text-center md:text-left">
                                <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
                                <div className="space-y-2">
                                    {!auth.user && (
                                        <>
                                            <Link href={route('login')} className="block opacity-90 hover:opacity-100 transition-opacity">
                                                Sign In
                                            </Link>
                                            <Link href={route('register')} className="block opacity-90 hover:opacity-100 transition-opacity">
                                                Get Started
                                            </Link>
                                        </>
                                    )}
                                    {auth.user && (
                                        <Link href={route('dashboard')} className="block opacity-90 hover:opacity-100 transition-opacity">
                                            Dashboard
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {settings.contact_email && (
                                <div className="text-center md:text-left">
                                    <h4 className="font-semibold mb-4 text-lg">Contact</h4>
                                    <div className="space-y-2">
                                        <a href={`mailto:${settings.contact_email}`} className="block opacity-90 hover:opacity-100 transition-opacity">
                                            {settings.contact_email}
                                        </a>
                                        {settings.contact_phone && (
                                            <a href={`tel:${settings.contact_phone}`} className="block opacity-90 hover:opacity-100 transition-opacity">
                                                {settings.contact_phone}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="text-center md:text-right">
                                <h4 className="font-semibold mb-4 text-lg">Follow Us</h4>
                                <div className="flex justify-center md:justify-end gap-4">
                                    {settings.social_links?.facebook && (
                                        <a
                                            href={settings.social_links.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                                        >
                                            <Facebook size={18} />
                                        </a>
                                    )}
                                    {settings.social_links?.twitter && (
                                        <a
                                            href={settings.social_links.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                                        >
                                            <Twitter size={18} />
                                        </a>
                                    )}
                                    {settings.social_links?.instagram && (
                                        <a
                                            href={settings.social_links.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                                        >
                                            <Instagram size={18} />
                                        </a>
                                    )}
                                    {settings.social_links?.linkedin && (
                                        <a
                                            href={settings.social_links.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
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
