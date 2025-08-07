import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { DynamicButton } from '@/components/dynamic-theme';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, ChangeEvent } from 'react';
import { toast } from '@/utils/toast';
import { AppSetting } from '../../types';


interface Props {
    settings: AppSetting;
    availableColors: Record<string, string>;
    themeOptions: Record<string, string>;
}

export default function AppSettings({ settings, availableColors, themeOptions }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        app_name: settings.app_name || '',
        app_description: settings.app_description || '',
        app_logo: settings.app_logo || '',
        app_favicon: settings.app_favicon || '',
        seo_title: settings.seo_title || '',
        seo_description: settings.seo_description || '',
        seo_keywords: settings.seo_keywords || '',
        seo_og_image: settings.seo_og_image || '',
        primary_color: settings.primary_color || '#3b82f6',
        secondary_color: settings.secondary_color || '#6b7280',
        accent_color: settings.accent_color || '#10b981',
        theme_mode: settings.theme_mode || 'light',
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        contact_address: settings.contact_address || '',
        social_links: {
            facebook: settings.social_links?.facebook || '',
            twitter: settings.social_links?.twitter || '',
            instagram: settings.social_links?.instagram || '',
            linkedin: settings.social_links?.linkedin || '',
            youtube: settings.social_links?.youtube || '',
        },
        maintenance_mode: settings.maintenance_mode || false,
        maintenance_message: settings.maintenance_message || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('app-settings.update'), {
            onSuccess: () => {
                toast.success('App settings updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update app settings');
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
        <AppLayout>
            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">App Settings</h2>
                        <p className="text-gray-600">Configure your application's basic settings and preferences</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Basic App Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>Configure your application's basic details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="app_name">App Name *</Label>
                                        <Input
                                            id="app_name"
                                            value={data.app_name}
                                            onChange={(e) => setData('app_name', e.target.value)}
                                            error={errors.app_name}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="theme_mode">Theme Mode</Label>
                                        <Select value={data.theme_mode} onValueChange={(value) => setData('theme_mode', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(themeOptions).map(([value, label]) => (
                                                    <SelectItem key={value} value={value}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="app_description">App Description</Label>
                                    <RichTextEditor
                                        value={data.app_description}
                                        onChange={(value) => setData('app_description', value || '')}
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
                                            value={data.app_logo}
                                            onChange={(e) => setData('app_logo', e.target.value)}
                                            error={errors.app_logo}
                                            placeholder="/logo.svg"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="app_favicon">Favicon Path</Label>
                                        <Input
                                            id="app_favicon"
                                            value={data.app_favicon}
                                            onChange={(e) => setData('app_favicon', e.target.value)}
                                            error={errors.app_favicon}
                                            placeholder="/favicon.ico"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* SEO Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>SEO Settings</CardTitle>
                                <CardDescription>Optimize your application for search engines</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="seo_title">SEO Title</Label>
                                    <Input
                                        id="seo_title"
                                        value={data.seo_title}
                                        onChange={(e) => setData('seo_title', e.target.value)}
                                        error={errors.seo_title}
                                        placeholder="Your app title for search engines"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="seo_description">SEO Description</Label>
                                    <RichTextEditor
                                        value={data.seo_description}
                                        onChange={(value) => setData('seo_description', value || '')}
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
                                        value={data.seo_keywords}
                                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setData('seo_keywords', e.target.value)}
                                        error={errors.seo_keywords}
                                        rows={2}
                                        placeholder="keyword1, keyword2, keyword3"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="seo_og_image">Open Graph Image</Label>
                                    <Input
                                        id="seo_og_image"
                                        value={data.seo_og_image}
                                        onChange={(e) => setData('seo_og_image', e.target.value)}
                                        error={errors.seo_og_image}
                                        placeholder="/og-image.jpg"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Theme Colors */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Theme Colors</CardTitle>
                                <CardDescription>Customize your application's color scheme</CardDescription>
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

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                                <CardDescription>Your application's contact details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="contact_email">Contact Email</Label>
                                        <Input
                                            id="contact_email"
                                            type="email"
                                            value={data.contact_email}
                                            onChange={(e) => setData('contact_email', e.target.value)}
                                            error={errors.contact_email}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="contact_phone">Contact Phone</Label>
                                        <Input
                                            id="contact_phone"
                                            value={data.contact_phone}
                                            onChange={(e) => setData('contact_phone', e.target.value)}
                                            error={errors.contact_phone}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="contact_address">Contact Address</Label>
                                    <Textarea
                                        id="contact_address"
                                        value={data.contact_address}
                                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setData('contact_address', e.target.value)}
                                        error={errors.contact_address}
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Social Media Links</CardTitle>
                                <CardDescription>Your social media presence</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="facebook">Facebook</Label>
                                        <Input
                                            id="facebook"
                                            value={data.social_links.facebook}
                                            onChange={(e) => setData('social_links', { ...data.social_links, facebook: e.target.value })}
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

                        {/* Maintenance Mode */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Maintenance Mode</CardTitle>
                                <CardDescription>Put your application in maintenance mode</CardDescription>
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
                                            value={data.maintenance_message}
                                            onChange={(value) => setData('maintenance_message', value || '')}
                                            error={errors.maintenance_message}
                                            placeholder="Message to display during maintenance (supports Markdown)..."
                                            height={150}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <DynamicButton type="submit" disabled={processing} variant="primary">
                                {processing ? 'Saving...' : 'Save Settings'}
                            </DynamicButton>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
