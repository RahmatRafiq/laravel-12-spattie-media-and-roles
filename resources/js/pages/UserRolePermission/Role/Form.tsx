import { Head, useForm, Link } from '@inertiajs/react';
import { FormEvent } from 'react';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Role } from '@/types/UserRolePermission';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Separator } from '@/components/ui/separator';

export default function RoleForm({ role }: { role?: Role }) {
  const isEdit = !!role;
  const { data, setData, post, put, processing, errors } = useForm({
    name: role ? role.name : '',
  });

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Settings', href: '/settings' },
    { title: 'Role Management', href: '/roles' },
    { title: isEdit ? 'Edit Role' : 'Create Role', href: '#' },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      put(route('roles.update', role!.id));
    } else {
      post(route('roles.store'));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={isEdit ? 'Edit Role' : 'Create Role'} />
      <div className="px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Settings</h1>

        <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
          {/* Sidebar */}
          <aside className="w-full max-w-xl lg:w-48">
            <nav className="flex flex-col space-y-1">
              <Button asChild variant="ghost" size="sm" className="justify-start bg-muted">
                <Link href="/roles">Role Management</Link>
              </Button>
              {/* Sidebar lain jika ada */}
            </nav>
          </aside>

          <Separator className="my-6 md:hidden" />

          {/* Content */}
          <div className="flex-1 md:max-w-2xl space-y-6">
            <HeadingSmall
              title={isEdit ? 'Edit Role' : 'Create Role'}
              description="Fill in the details below"
            />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  required
                />
                <InputError message={errors.name} />
              </div>

              <div className="flex items-center space-x-4">
                <Button disabled={processing}>
                  {isEdit ? 'Update Role' : 'Create Role'}
                </Button>
                <Link
                  href={route('roles.index')}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
