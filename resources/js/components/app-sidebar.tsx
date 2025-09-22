import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Activity,
    FileText,
    Github,
    Key,
    LayoutDashboard,
    Settings,
    Shield,
    UserCheck,
    Users,
    type LucideIcon,
    // Navigation & Layout
    Menu,
    Home,
    Archive,
    Folder,
    FolderOpen,
    Grid3X3,
    Layers,
    Navigation,
    Sidebar as SidebarIcon,
    // User & Profile
    User,
    UserPlus,
    UserMinus,
    UserX,
    UserCog,
    User2,
    UsersRound,
    Contact,
    // Business & Finance
    Building,
    Building2,
    Briefcase,
    Calculator,
    CreditCard,
    DollarSign,
    Wallet,
    TrendingUp,
    TrendingDown,
    BarChart,
    BarChart2,
    BarChart3,
    BarChart4,
    LineChart,
    PieChart,
    // Communication
    Mail,
    MailOpen,
    MessageCircle,
    MessageSquare,
    Send,
    Phone,
    PhoneCall,
    Video,
    Mic,
    MicOff,
    // Media & Files
    Image,
    Camera,
    Film,
    Music,
    Upload,
    Download,
    File,
    Files,
    FilePlus,
    FileX,
    FileEdit,
    // Tools & Utilities
    Search,
    Filter,
    Calendar,
    Clock,
    Timer,
    Bookmark,
    Tag,
    Tags,
    Bell,
    BellOff,
    // Actions
    Plus,
    Minus,
    X,
    Check,
    CheckCircle,
    XCircle,
    AlertCircle,
    AlertTriangle,
    Info,
    HelpCircle,
    // Navigation
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsUp,
    ChevronsDown,
    ChevronsLeft,
    ChevronsRight,
    // Edit & Content
    Edit,
    Edit2,
    Edit3,
    Pen,
    PenTool,
    Type,
    Bold,
    Italic,
    Underline,
    // System & Settings
    Cog,
    Sliders,
    Power,
    RefreshCcw,
    RotateCcw,
    RotateCw,
    Lock,
    Unlock,
    Eye,
    EyeOff,
    // Shopping & E-commerce
    ShoppingCart,
    ShoppingBag,
    Store,
    Package,
    Package2,
    Truck,
    // Technology
    Monitor,
    Smartphone,
    Tablet,
    Laptop,
    Server,
    Database,
    HardDrive,
    Wifi,
    WifiOff,
    // Social & Sharing
    Share,
    Share2,
    Heart,
    HeartHandshake,
    Star,
    ThumbsUp,
    ThumbsDown,
    // Location & Map
    Map,
    MapPin,
    Navigation2,
    Compass,
    Globe,
    // Weather
    Sun,
    Moon,
    Cloud,
    CloudRain,
    Zap,
    // Health & Medical
    Stethoscope,
    Pill,
    Cross,
    Thermometer,
    // Gaming & Entertainment
    Gamepad,
    Gamepad2,
    Trophy,
    Award,
    Medal,
    // Transportation
    Car,
    Plane,
    Train,
    Bike,
    Bus,
    // Food & Drink
    Coffee,
    Cookie,
    Pizza,
    Wine,
    // Nature
    Flower,
    Trees,
    Leaf,
    // Miscellaneous
    Gift,
    Lightbulb,
    Flame,
    Snowflake,
    Umbrella,
    Glasses,
    Crown,
    Gem,
    Palette,
    Brush,
    // Development
    Code,
    Code2,
    Terminal,
    Bug,
    Wrench,
    Hammer,
    // Analytics
    Target,
    Focus,
    Crosshair,
    Radar,
    // Security
    ShieldCheck,
    ShieldAlert,
    ShieldX,
    KeyRound,
    Fingerprint,
    Scan,
    // Time & Date
    CalendarDays,
    CalendarCheck,
    CalendarX,
    Watch,
    Hourglass,
    // Text & Typography
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    // Shapes & Design
    Circle,
    Square,
    Triangle,
    Diamond,
    Hexagon,
    // Status & Indicators
    Loader,
    Loader2,
    CheckCircle2,
    XCircle as XCircleIcon,
    AlertOctagon,
    MinusCircle,
    PlusCircle,
    // Movement & Direction
    Move,
    MoveHorizontal,
    MoveVertical,
    MousePointer,
    MousePointer2,
    Hand,
    // Organization
    Kanban,
    GitBranch,
    GitCommit,
    GitMerge,
    Workflow,
    // Print & Export
    Printer,
    FileOutput,
    FileInput,
    Import,
    // Quality & Rating
    BadgeCheck,
    Badge,
    Verified,
    // Accessibility
    Accessibility,
    Volume,
    Volume1,
    Volume2,
    VolumeOff,
    VolumeX,
} from 'lucide-react';
import AppLogo from './app-logo';
import { usePage } from '@inertiajs/react';

type MenuItem = {
    id: number;
    title: string;
    route?: string | null;
    icon?: string | null;
    permission?: string | null;
    parent_id?: number | null;
    order?: number;
    children?: MenuItem[];
};

const iconMap: Record<string, LucideIcon> = {
    // Original icons
    LayoutDashboard,
    Activity,
    Users,
    Shield,
    Key,
    UserCheck,
    Settings,
    FileText,
    Github,

    // Navigation & Layout
    Menu,
    Home,
    Archive,
    Folder,
    FolderOpen,
    Grid3X3,
    Layers,
    Navigation,
    SidebarIcon,

    // User & Profile
    User,
    UserPlus,
    UserMinus,
    UserX,
    UserCog,
    User2,
    UsersRound,
    Contact,

    // Business & Finance
    Building,
    Building2,
    Briefcase,
    Calculator,
    CreditCard,
    DollarSign,
    Wallet,
    TrendingUp,
    TrendingDown,
    BarChart,
    BarChart2,
    BarChart3,
    BarChart4,
    LineChart,
    PieChart,

    // Communication
    Mail,
    MailOpen,
    MessageCircle,
    MessageSquare,
    Send,
    Phone,
    PhoneCall,
    Video,
    Mic,
    MicOff,

    // Media & Files
    Image,
    Camera,
    Film,
    Music,
    Upload,
    Download,
    File,
    Files,
    FilePlus,
    FileX,
    FileEdit,

    // Tools & Utilities
    Search,
    Filter,
    Calendar,
    Clock,
    Timer,
    Bookmark,
    Tag,
    Tags,
    Bell,
    BellOff,

    // Actions
    Plus,
    Minus,
    X,
    Check,
    CheckCircle,
    XCircle,
    AlertCircle,
    AlertTriangle,
    Info,
    HelpCircle,

    // Navigation
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsUp,
    ChevronsDown,
    ChevronsLeft,
    ChevronsRight,

    // Edit & Content
    Edit,
    Edit2,
    Edit3,
    Pen,
    PenTool,
    Type,
    Bold,
    Italic,
    Underline,

    // System & Settings
    Cog,
    Sliders,
    Power,
    RefreshCcw,
    RotateCcw,
    RotateCw,
    Lock,
    Unlock,
    Eye,
    EyeOff,

    // Shopping & E-commerce
    ShoppingCart,
    ShoppingBag,
    Store,
    Package,
    Package2,
    Truck,

    // Technology
    Monitor,
    Smartphone,
    Tablet,
    Laptop,
    Server,
    Database,
    HardDrive,
    Wifi,
    WifiOff,

    // Social & Sharing
    Share,
    Share2,
    Heart,
    HeartHandshake,
    Star,
    ThumbsUp,
    ThumbsDown,

    // Location & Map
    Map,
    MapPin,
    Navigation2,
    Compass,
    Globe,

    // Weather
    Sun,
    Moon,
    Cloud,
    CloudRain,
    Zap,

    // Health & Medical
    Stethoscope,
    Pill,
    Cross,
    Thermometer,

    // Gaming & Entertainment
    Gamepad,
    Gamepad2,
    Trophy,
    Award,
    Medal,

    // Transportation
    Car,
    Plane,
    Train,
    Bike,
    Bus,

    // Food & Drink
    Coffee,
    Cookie,
    Pizza,
    Wine,

    // Nature
    Flower,
    Trees,
    Leaf,

    // Miscellaneous
    Gift,
    Lightbulb,
    Flame,
    Snowflake,
    Umbrella,
    Glasses,
    Crown,
    Gem,
    Palette,
    Brush,

    // Development
    Code,
    Code2,
    Terminal,
    Bug,
    Wrench,
    Hammer,

    // Analytics
    Target,
    Focus,
    Crosshair,
    Radar,

    // Security
    ShieldCheck,
    ShieldAlert,
    ShieldX,
    KeyRound,
    Fingerprint,
    Scan,

    // Time & Date
    CalendarDays,
    CalendarCheck,
    CalendarX,
    Watch,
    Hourglass,

    // Text & Typography
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,

    // Shapes & Design
    Circle,
    Square,
    Triangle,
    Diamond,
    Hexagon,

    // Status & Indicators
    Loader,
    Loader2,
    CheckCircle2,
    XCircleIcon,
    AlertOctagon,
    MinusCircle,
    PlusCircle,

    // Movement & Direction
    Move,
    MoveHorizontal,
    MoveVertical,
    MousePointer,
    MousePointer2,
    Hand,

    // Organization
    Kanban,
    GitBranch,
    GitCommit,
    GitMerge,
    Workflow,

    // Print & Export
    Printer,
    FileOutput,
    FileInput,
    Import,

    // Quality & Rating
    BadgeCheck,
    Badge,
    Verified,

    // Accessibility
    Accessibility,
    Volume,
    Volume1,
    Volume2,
    VolumeOff,
    VolumeX
};

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Github,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: FileText,
    },
];

function mapMenuToNavItem(menu: MenuItem): NavItem {
    return {
        title: menu.title,
        href: menu.route ? route(menu.route) : '#',
        icon: menu.icon && iconMap[menu.icon] ? iconMap[menu.icon] : undefined,
        children: menu.children ? menu.children.map(mapMenuToNavItem) : undefined,
    };
}

export function AppSidebar() {
    const { sidebarMenus = [] } = usePage().props as { sidebarMenus?: MenuItem[] };
    const navItems = (sidebarMenus ?? []).map(mapMenuToNavItem);
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}