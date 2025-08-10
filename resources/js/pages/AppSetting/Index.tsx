import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/ui/rich-text-editor';
import InputError from '@/components/input-error';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, ChangeEvent } from 'react';
import { toast } from '@/utils/toast';
import { AppSetting } from '../../types';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';


interface Props {
    settings: AppSetting;
    availableColors: Record<string, string>;
    themeOptions: Record<string, string>;
}

export default function AppSettings({ settings, availableColors }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        app_name: settings.app_name,
        app_description: settings.app_description,
        app_logo: settings.app_logo,
        app_favicon: settings.app_favicon,
        seo_title: settings.seo_title,
        seo_description: settings.seo_description,
        seo_keywords: settings.seo_keywords,
        seo_og_image: settings.seo_og_image,
        primary_color: settings.primary_color || '#3b82f6',
        secondary_color: settings.secondary_color || '#6b7280',
        accent_color: settings.accent_color || '#10b981',
        contact_email: settings.contact_email,
        contact_phone: settings.contact_phone,
        contact_address: settings.contact_address,
        social_links: {
            facebook: settings.social_links?.facebook || '',
            twitter: settings.social_links?.twitter || '',
            instagram: settings.social_links?.instagram || '',
            linkedin: settings.social_links?.linkedin || '',
            youtube: settings.social_links?.youtube || '',
        },
        maintenance_mode: settings.maintenance_mode || false,
        maintenance_message: settings.maintenance_message,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'App Settings', href: '/dashboard/app-settings' },
    ];

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        put(route('app-settings.update'), {
            onSuccess: () => {
                toast.success('App settings berhasil diperbarui!');
            },
            onError: () => {
                toast.error('Gagal memperbarui app settings');
            },
        });
    };

    const ColorPicker = ({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) => (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex gap-2">
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(availableColors).map(([hex, name]) => (
                            <SelectItem key={hex} value={hex}>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded-full border"
                                        style={{ backgroundColor: hex }}
                                    />
                                    {name}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div
                    className="w-10 h-10 rounded border border-gray-300"
                    style={{ backgroundColor: value }}
                />
            </div>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="App Settings" />
            <div className="px-4 py-6">
                <Heading title="App Settings" description="Manage your application's global configuration, SEO, theme, and contact info." />
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <Card>
                            <CardHeader>
                                <HeadingSmall title="Basic Information" description="Configure your application's basic details" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="app_name">App Name *</Label>
                                        <Input
                                            id="app_name"
                                            value={data.app_name || ''}
                                            onChange={(e) => setData('app_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.app_name} />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="app_description">App Description</Label>
                                    <RichTextEditor
                                        value={data.app_description || ''}
                                        onChange={(value) => setData('app_description', value || undefined)}
                                        error={errors.app_description}
                                        placeholder="Describe your application in detail..."
                                        height={150}
                                        preview="edit"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="app_logo">App Logo Path</Label>
                                        <Input
                                            id="app_logo"
                                            value={data.app_logo || ''}
                                            onChange={(e) => setData('app_logo', e.target.value || undefined)}
                                            placeholder="/logo.svg"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="app_favicon">Favicon Path</Label>
                                        <Input
                                            id="app_favicon"
                                            value={data.app_favicon || ''}
                                            onChange={(e) => setData('app_favicon', e.target.value || undefined)}
                                            placeholder="/favicon.ico"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <HeadingSmall title="SEO Settings" description="Optimize your application for search engines" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="seo_title">SEO Title</Label>
                                    <Input
                                        id="seo_title"
                                        value={data.seo_title || ''}
                                        onChange={(e) => setData('seo_title', e.target.value || undefined)}
                                        placeholder="Your app title for search engines"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="seo_description">SEO Description</Label>
                                    <RichTextEditor
                                        value={data.seo_description || ''}
                                        onChange={(value) => setData('seo_description', value || undefined)}
                                        error={errors.seo_description}
                                        placeholder="Brief description for search engines and social media..."
                                        height={120}
                                        preview="edit"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="seo_keywords">SEO Keywords</Label>
                                    <Textarea
                                        id="seo_keywords"
                                        value={data.seo_keywords || ''}
                                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setData('seo_keywords', e.target.value || undefined)}
                                        error={errors.seo_keywords}
                                        rows={2}
                                        placeholder="keyword1, keyword2, keyword3"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="seo_og_image">Open Graph Image</Label>
                                    <Input
                                        id="seo_og_image"
                                        value={data.seo_og_image || ''}
                                        onChange={(e) => setData('seo_og_image', e.target.value || undefined)}
                                        placeholder="/og-image.jpg"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <HeadingSmall title="Theme Colors" description="Customize your application's color scheme" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <ColorPicker
                                        value={data.primary_color}
                                        onChange={(value) => setData('primary_color', value)}
                                        label="Primary Color"
                                    />
                                    <ColorPicker
                                        value={data.secondary_color}
                                        onChange={(value) => setData('secondary_color', value)}
                                        label="Secondary Color"
                                    />
                                    <ColorPicker
                                        value={data.accent_color}
                                        onChange={(value) => setData('accent_color', value)}
                                        label="Accent Color"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <HeadingSmall title="Contact Information" description="Your application's contact details" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="contact_email">Contact Email</Label>
                                        <Input
                                            id="contact_email"
                                            type="email"
                                            value={data.contact_email || ''}
                                            onChange={(e) => setData('contact_email', e.target.value || undefined)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="contact_phone">Contact Phone</Label>
                                        <Input
                                            id="contact_phone"
                                            value={data.contact_phone || ''}
                                            onChange={(e) => setData('contact_phone', e.target.value || undefined)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="contact_address">Contact Address</Label>
                                    <Textarea
                                        id="contact_address"
                                        value={data.contact_address || ''}
                                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setData('contact_address', e.target.value || undefined)}
                                        error={errors.contact_address}
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <HeadingSmall title="Social Media Links" description="Your social media presence" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="facebook">Facebook</Label>
                                        <Input
                                            id="facebook"
                                            value={data.social_links.facebook}
                                            onChange={(e) => setData('social_links', { ...data.social_links, facebook: e.target.value || '' })}
                                            placeholder="https://facebook.com/yourpage"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="twitter">Twitter</Label>
                                        <Input
                                            id="twitter"
                                            value={data.social_links.twitter}
                                            onChange={(e) => setData('social_links', { ...data.social_links, twitter: e.target.value })}
                                            placeholder="https://twitter.com/youraccount"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="instagram">Instagram</Label>
                                        <Input
                                            id="instagram"
                                            value={data.social_links.instagram}
                                            onChange={(e) => setData('social_links', { ...data.social_links, instagram: e.target.value })}
                                            placeholder="https://instagram.com/youraccount"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="linkedin">LinkedIn</Label>
                                        <Input
                                            id="linkedin"
                                            value={data.social_links.linkedin}
                                            onChange={(e) => setData('social_links', { ...data.social_links, linkedin: e.target.value })}
                                            placeholder="https://linkedin.com/company/yourcompany"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="youtube">YouTube</Label>
                                        <Input
                                            id="youtube"
                                            value={data.social_links.youtube}
                                            onChange={(e) => setData('social_links', { ...data.social_links, youtube: e.target.value })}
                                            placeholder="https://youtube.com/@yourchannel"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <HeadingSmall title="Maintenance Mode" description="Put your application in maintenance mode" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="maintenance_mode"
                                        checked={data.maintenance_mode}
                                        onChange={(e) => setData('maintenance_mode', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Label htmlFor="maintenance_mode">Enable Maintenance Mode</Label>
                                </div>
                                {data.maintenance_mode && (
                                    <div>
                                        <Label htmlFor="maintenance_message">Maintenance Message</Label>
                                        <RichTextEditor
                                            value={data.maintenance_message || ''}
                                            onChange={(value) => setData('maintenance_message', value || undefined)}
                                            error={errors.maintenance_message}
                                            placeholder="Message to display during maintenance (supports Markdown)..."
                                            height={150}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        <div className="flex items-center space-x-4">
                            <Button disabled={processing}>
                                {processing ? 'Saving...' : 'Save Settings'}
                            </Button>
                            <Link href={route('dashboard')} className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
