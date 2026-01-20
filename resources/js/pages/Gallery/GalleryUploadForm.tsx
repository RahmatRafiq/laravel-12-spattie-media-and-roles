import * as React from 'react';
import CustomSelect from '../../components/select';
import { Button } from '@/components/ui/button';

type UploadFormData = {
    file: File | null;
    visibility: 'public' | 'private';
};

interface GalleryUploadFormProps {
    data: UploadFormData;
    setData: <K extends keyof UploadFormData>(field: K, value: UploadFormData[K]) => void;
    processing: boolean;
    submitUpload: (e: React.FormEvent) => void;
}

export default function GalleryUploadForm({ data, setData, processing, submitUpload }: GalleryUploadFormProps) {
    const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain', 'application/zip', 'application/x-rar-compressed',
        'video/mp4', 'video/quicktime', 'video/x-msvideo'
    ];

    const maxFileSize = 10240000;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            setData('file', null);
            return;
        }

        if (file.size > maxFileSize) {
            alert('File size exceeds 10MB limit. Please choose a smaller file.');
            e.target.value = '';
            setData('file', null);
            return;
        }

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            alert('Invalid file type. Allowed types: Images (JPG, PNG, GIF, WebP, SVG), Documents (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT), Archives (ZIP, RAR), Videos (MP4, MOV, AVI)');
            e.target.value = '';
            setData('file', null);
            return;
        }

        setData('file', file);
    };

    return (
        <form onSubmit={submitUpload} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
            <input
                type="file"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.mp4,.mov,.avi"
                required
                className="w-full sm:flex-1 text-sm"
            />
            <div className="w-full sm:w-auto sm:min-w-[140px]">
                <CustomSelect
                    value={{ value: data.visibility, label: data.visibility === 'public' ? 'Public' : 'Private' }}
                    className="rounded border px-2 py-1"
                    options={[
                        { value: 'public', label: 'Public' },
                        { value: 'private', label: 'Private' }
                    ]}
                    onChange={(option) => {
                        if (option && !Array.isArray(option) && typeof option === 'object' && 'value' in option) {
                            setData('visibility', option.value as 'public' | 'private');
                        }
                    }}
                />
            </div>
            <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                {processing ? 'Uploading...' : 'Upload'}
            </Button>
        </form>
    );
}
