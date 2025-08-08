
import AppLogoIcon from './app-logo-icon';
import { usePage } from '@inertiajs/react';
import { AppSetting } from '@/types';

type PageProps = { appSettings: AppSetting };

export default function AppLogo() {
    const { appSettings } = usePage<PageProps>().props;
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                {appSettings.app_logo ? (
                    <img src={appSettings.app_logo} alt={appSettings.app_name} className="size-5 rounded object-contain" />
                ) : (
                    <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                )}
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">{appSettings.app_name}</span>
            </div>
        </>
    );
}
