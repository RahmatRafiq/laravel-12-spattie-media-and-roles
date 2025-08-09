
import * as React from 'react';
import CustomSelect from '../../components/select';
import { Button } from '@/components/ui/button';

type UploadFormData = {
    file: File | null;
    visibility: 'public' | 'private';
    collection_name: string;
};

interface GalleryUploadFormProps {
    data: UploadFormData;
    setData: <K extends keyof UploadFormData>(field: K, value: UploadFormData[K]) => void;
    processing: boolean;
    collections: string[];
    submitUpload: (e: React.FormEvent) => void;
}

export default function GalleryUploadForm({ data, setData, processing, collections, submitUpload }: GalleryUploadFormProps) {
    return (
        <form onSubmit={submitUpload} className="flex items-center gap-2 mb-4">
            <input
                type="file"
                onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                required
            />
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
            <CustomSelect
                value={collections && data.collection_name ? { value: data.collection_name, label: data.collection_name } : null}
                className="rounded border px-2 py-1 min-w-[120px]"
                options={collections.map((c) => ({ value: c, label: c }))}
                onChange={(option) => {
                    if (option && !Array.isArray(option) && typeof option === 'object' && 'value' in option) {
                        setData('collection_name', option.value);
                    }
                }}
                placeholder="Collection"
                isClearable
            />
            <Button type="submit" disabled={processing}>Upload</Button>
        </form>
    );
}
