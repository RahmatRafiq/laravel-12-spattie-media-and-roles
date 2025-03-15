import { useEffect, useRef } from 'react';
import Dropzone from 'dropzone';
import 'dropzone/dist/dropzone.css';

interface ProfileDropzoneProps {
  onUploadSuccess?: (response: { [key: string]: string }) => void;
  onUploadError?: (error: string) => void;
  userId: number; // properti userId untuk mengangkut id user
}

export default function ProfileDropzone({ onUploadSuccess, onUploadError, userId }: ProfileDropzoneProps) {
  const dropzoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropzoneRef.current) return;

    const dz = new Dropzone(dropzoneRef.current, {
      url: route('profile.upload'),
      paramName: 'profile-images',
      maxFiles: 1,
      maxFilesize: 2,
      withCredentials: true,
      acceptedFiles: 'image/jpeg,image/jpg,image/png',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      init: function () {
        this.on('sending', function (file, xhr, formData) {
          formData.append('id', String(userId));
        });
        this.on('success', function (file, response: { [key: string]: string }) {
          console.log('Upload berhasil:', response);
          if (onUploadSuccess) {
            onUploadSuccess(response);
          }
        });
        this.on('error', function (file, errorMessage) {
          console.error('Upload error:', errorMessage);
          if (onUploadError) {
            onUploadError(errorMessage instanceof Error ? errorMessage.message : errorMessage);
          }
        });
      },
    });

    return () => {
      dz.destroy();
    };
  }, [onUploadSuccess, onUploadError, userId]);

  return (
    <div className="mt-4">
      <div ref={dropzoneRef} className="dropzone p-4 border-2 border-dashed rounded cursor-pointer">
        <div className="dz-message text-center text-gray-500">
          Drag &amp; drop foto disini, atau klik untuk memilih file.
        </div>
      </div>
    </div>
  );
}
