import Dropzone from 'dropzone';
import 'dropzone/dist/dropzone.css';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

Dropzone.autoDiscover = false;

interface FileData {
    file_name: string;
    size: number;
    original_url: string;
}

interface DropzoneOptions {
    urlStore: string;
    urlDestroy: string;
    csrf: string;
    acceptedFiles: string;
    maxSizeMB: number;
    minSizeMB?: number;
    maxFiles: number;
    minFiles?: number;
    files?: FileData[];
    kind: string;
    urlDestroyPermanent: string;
}

const Dropzoner = (
    element: HTMLElement | null,
    key: string,
    {
        urlStore,
        urlDestroy,
        csrf,
        acceptedFiles,
        files = [],
        maxFiles,
        kind,
        maxSizeMB,
        minFiles = 0,
        minSizeMB = 0,
        urlDestroyPermanent,
    }: DropzoneOptions,
): Dropzone => {
    if (!element) throw new Error('Element not found');
    if (!urlStore) throw new Error('URL Store not found');
    if (!urlDestroy) throw new Error('URL Destroy not found');
    if (!csrf) throw new Error('CSRF not found');
    if (!acceptedFiles) throw new Error('Accepted Files not found');
    if (!maxFiles) throw new Error('Max Files not found');
    if (!kind) throw new Error('Kind not found');

    const minSizeBytes = minSizeMB * 1024 * 1024;

    const myDropzone = new Dropzone(element, {
        url: urlStore,
        headers: { 'X-CSRF-TOKEN': csrf },
        acceptedFiles,
        maxFiles,
        maxFilesize: maxSizeMB,
        addRemoveLinks: true,
        init: function () {
            files.forEach((file) => {
                const mockFile = {
                    name: file.file_name,
                    size: file.size,
                    accepted: true,
                    kind,
                    upload: { filename: file.file_name, size: file.size },
                    dataURL: file.original_url,
                } as unknown as Dropzone.DropzoneFile;

                this.emit('addedfile', mockFile);
                this.emit('thumbnail', mockFile, file.original_url);
                this.emit('complete', mockFile);

                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = `${key}[]`;
                input.value = file.file_name;
                mockFile.previewElement?.appendChild(input);
            });

            this.on('sending', () => {
                const total = this.getAcceptedFiles().length + files.length;
                if (total < minFiles) {
                    const msg = `Minimal upload ${minFiles} file(s).`;
                    Toastify({ text: msg, className: 'error', duration: 3000 }).showToast();
                    this.removeAllFiles(true);
                    throw new Error(msg);
                }
            });

            this.on('maxfilesexceeded', (file) => {
                const msg = `Maksimal ${maxFiles} file saja.`;
                Toastify({ text: msg, className: 'error', duration: 3000 }).showToast();
                this.removeFile(file);
            });
        },
        accept: (file, done) => {
            if (file.size < minSizeBytes) {
                const msg = `File "${file.name}" terlalu kecil (min ${minSizeMB} MB).`;
                Toastify({ text: msg, className: 'error', duration: 4000 }).showToast();
                done(msg);
            } else {
                done();
            }
        },
        error: (file, message) => {
            const msg = typeof message === 'string' ? message : message.message;
            Toastify({ text: `Error "${file.name}": ${msg}`, className: 'error', duration: 5000 }).showToast();
            file.previewElement?.parentNode?.removeChild(file.previewElement);
        },
        success: (file: Dropzone.DropzoneFile & { upload?: { filename: string; size: number } | undefined }) => {
            const res = file.xhr ? JSON.parse(file.xhr.responseText) : null;
            if (res && file.upload) {
                file.upload.filename = res.name;
                file.upload.size = res.size || file.size;
            }
            Toastify({ text: `Berhasil upload "${file.name}".`, duration: 3000 }).showToast();
            console.log('Upload successful');
        },
        removedfile: function (file: Dropzone.DropzoneFile) {
            // tentukan URL berdasarkan apakah ini file mock lama atau file baru di temp
            const isInitial = files?.some((f) => f.file_name === file.name);
            const deleteUrl = isInitial ? urlDestroyPermanent : urlDestroy;
            const payloadKey = isInitial ? 'filename' : 'filename'; // tetap sama

            fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrf,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [payloadKey]: file.name }),
            })
                .then((res) => res.json())
                .then(() => {
                    Toastify({
                        text: isInitial ? `Permanent file "${file.name}" deleted` : `Temporary file "${file.name}" deleted`,
                        duration: 3000,
                    }).showToast();
                })
                .catch((error) => {
                    Toastify({
                        text: `Error deleting "${file.name}"`,
                        className: 'error',
                        duration: 3000,
                    }).showToast();
                    console.error(error);
                });

            // bersihkan preview di UI
            file.previewElement?.parentNode?.removeChild(file.previewElement);
        },
    });

    return myDropzone;
};

export default Dropzoner;
