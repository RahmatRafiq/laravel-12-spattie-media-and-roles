import { useEffect, useRef } from 'react';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import Dropzoner from '@/components/dropzoner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Profile settings',
    href: '/settings/profile',
  },
];

interface ProfileForm {
  name: string;
  email: string;
  'profile-images': string[];
  [key: string]: string | string[];
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
  const { auth, profileImage } = usePage<SharedData & { profileImage: { file_name: string; size: number; original_url?: string; url?: string } }>().props;

  const initialImages: string[] = profileImage ? [profileImage.file_name] : [];

  const initialFiles = profileImage
    ? [
      {
        file_name: profileImage.file_name,
        size: profileImage.size,
        original_url: profileImage.original_url || profileImage.url || '',
      },
    ]
    : [];

  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<ProfileForm>({
    name: auth.user.name,
    email: auth.user.email,
    'profile-images': initialImages,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    patch(route('profile.update'), { preserveScroll: true });
  };

  const csrf_token = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

  const dropzoneRef = useRef<HTMLDivElement>(null);
  const dzInstance = useRef<Dropzone | null>(null);

  useEffect(() => {
    if (dropzoneRef.current) {
      if (dzInstance.current) {
        dzInstance.current.destroy();
      }
      dzInstance.current = Dropzoner(dropzoneRef.current, 'profile-images', {
        urlStore: route('storage.store'),
        urlDestroy: route('storage.destroy'),
        csrf: csrf_token,
        acceptedFiles: 'image/jpeg,image/png',
        maxSizeMB: 1,
        minSizeMB: 0.05,
        maxFiles: 1,
        minFiles: 1,
        files: initialFiles,
        kind: 'image',
      });



      dzInstance.current.on('success', (file, response: { name: string; url: string }) => {
        setData('profile-images', [...(data['profile-images'] || []), response.name]);
        const thumb = file.previewElement?.querySelector('[data-dz-thumbnail]') as HTMLImageElement;
        if (thumb) thumb.src = response.url;
      });


      dzInstance.current.on('removedfile', (file) => {
        setData('profile-images',
          (data['profile-images'] || []).filter(name => name !== file.name)
        );

        fetch(route('storage.destroy'), {
          method: 'DELETE',
          headers: { 'X-CSRF-TOKEN': csrf_token, 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name }),
        });
      });

    }
  }, [csrf_token]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Profile settings" />
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="Profile information" description="Update your name and email address" />
          <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                className="mt-1 block w-full"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
                autoComplete="name"
                placeholder="Full name"
              />
              <InputError className="mt-2" message={errors.name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                className="mt-1 block w-full"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
                autoComplete="username"
                placeholder="Email address"
              />
              <InputError className="mt-2" message={errors.email} />
            </div>
            {mustVerifyEmail && auth.user.email_verified_at === null && (
              <div>
                <p className="text-muted-foreground -mt-4 text-sm">
                  Your email address is unverified.{' '}
                  <Link
                    href={route('verification.send')}
                    method="post"
                    as="button"
                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                  >
                    Click here to resend the verification email.
                  </Link>
                </p>
                {status === 'verification-link-sent' && (
                  <div className="mt-2 text-sm font-medium text-green-600">
                    A new verification link has been sent to your email address.
                  </div>
                )}
              </div>
            )}
            <div className="mb-4">
              <Label htmlFor="profile-image">Profile Images</Label>
              <div
                ref={dropzoneRef}
                className="dropzone border-dashed border-2 rounded p-4 dark:text-black"
              ></div>

            </div>
            <div className="flex items-center gap-4">
              <Button disabled={processing}>Save</Button>
              <Transition
                show={recentlySuccessful}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
              >
                <p className="text-sm text-neutral-600">Saved</p>
              </Transition>
            </div>
          </form>
        </div>
        <DeleteUser />
      </SettingsLayout>
    </AppLayout>
  );
}
