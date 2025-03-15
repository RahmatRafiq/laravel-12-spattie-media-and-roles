import { useEffect, useRef } from 'react';
import Dropzone from 'dropzone';
import 'dropzone/dist/dropzone.css';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

interface DropzoneUploaderProps {
  urlStore: string;
  urlDestroy: string;
  csrf: string;
  acceptedFiles?: string;
  maxFiles?: number;
  files?: { file_name: string; size: number; original_url: string }[];
  kind?: string;
  onSuccess?: (file: Dropzone.DropzoneFile, response: { name: string; size: number; path: string }) => void;
  onRemoved?: (file: Dropzone.DropzoneFile) => void;
}

const DropzoneUploader: React.FC<DropzoneUploaderProps> = ({
  urlStore,
  urlDestroy,
  csrf,
  acceptedFiles = 'image/*',
  maxFiles = 1,
  files = [],
  kind = 'image',
  onSuccess,
  onRemoved,
}) => {
  const dropzoneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!dropzoneRef.current) return;

    const myDropzone = new Dropzone(dropzoneRef.current, {
      url: urlStore,
      headers: { 'X-CSRF-TOKEN': csrf },
      acceptedFiles,
      maxFiles,
      addRemoveLinks: true,
      init: function () {
        if (files.length > 0) {
          files.forEach(file => {
            const mockFile = {
              name: file.file_name,
              size: file.size,
              accepted: true,
              kind,
              upload: {
                filename: file.file_name,
                size: file.size,
              },
              dataURL: file.original_url,
            };
            this.emit('addedfile', mockFile);
            this.emit('thumbnail', mockFile, file.original_url);
            this.emit('complete', mockFile);
          });
        }
      },
      success: function (file: Dropzone.DropzoneFile) {
        const response = file.xhr ? JSON.parse(file.xhr.responseText) : {};
        if (response && file.upload) {
          const upload = file.upload as unknown as { filename: string; size: number };
          upload.filename = response.name;
          upload.size = response.size;
        }
        if (onSuccess) {
          onSuccess(file, response);
        }
      },
      removedfile: function (file: Dropzone.DropzoneFile) {
        fetch(urlDestroy, {
          method: 'DELETE',
          headers: {
            'X-CSRF-TOKEN': csrf,
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({ filename: file.name }),
        })
          .then(response => response.json())
          .then(() => {
            if (file.previewElement) {
              file.previewElement.remove();
            }
            if (onRemoved) {
              onRemoved(file);
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      },
      error: function (file, response) {
        Toastify({
          text: response instanceof Error ? response.message : 'Upload error',
          duration: 5000,
          style: { background: 'red' },
        }).showToast();
        if (file.previewElement) {
          file.previewElement.remove();
        }
      },
    });

    return () => {
      myDropzone.destroy();
    };
  }, [
    dropzoneRef,
    urlStore,
    urlDestroy,
    csrf,
    acceptedFiles,
    maxFiles,
    files,
    kind,
    onSuccess,
    onRemoved,
  ]);

  return <div ref={dropzoneRef} className="dropzone border-dashed border-2 border-gray-300 p-5"></div>;
};

export default DropzoneUploader;
