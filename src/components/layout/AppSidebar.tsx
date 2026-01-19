import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileBarChart,
  PieChart,
  Users,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Target,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface NavItem {
  title: string;
  icon: React.ElementType;
  path?: string;
  badge?: number;
  children?: { title: string; path: string; badge?: number }[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    children: [
      { title: 'Overview', path: '/' },
      { title: 'Quick Stats', path: '/stats', badge: 5 },
      { title: 'Key Metrics', path: '/metrics' },
    ],
  },
  {
    title: 'Reports',
    icon: FileBarChart,
    children: [
      { title: 'RFM Analysis', path: '/reports/rfm' },
      { title: 'CLV Report', path: '/reports/clv' },
    ],
  },
  {
    title: 'Segments',
    icon: PieChart,
    path: '/segments',
  },
  {
    title: 'Customers',
    icon: Users,
    path: '/customers',
  },
  {
    title: 'Analytics',
    icon: TrendingUp,
    path: '/analytics',
  },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Dashboard']);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActivePath = (path: string) => location.pathname === path;
  const isActiveParent = (item: NavItem) => {
    if (item.path) return isActivePath(item.path);
    return item.children?.some(child => isActivePath(child.path));
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen gradient-primary flex flex-col relative"
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-secondary transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-foreground" />
        )}
      </button>

      {/* Logo Area */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sidebar-primary/20 flex items-center justify-center">
          <Activity className="w-5 h-5 text-sidebar-foreground" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-semibold text-sidebar-foreground text-lg"
            >
              Analytics
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.title}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpanded(item.title)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                      isActiveParent(item)
                        ? 'bg-sidebar-primary/20 text-sidebar-foreground'
                        : 'text-sidebar-muted hover:bg-sidebar-primary/10 hover:text-sidebar-foreground'
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <AnimatePresence>
                      {!collapsed && (
                        <>
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 text-left text-sm font-medium"
                          >
                            {item.title}
                          </motion.span>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <ChevronDown
                              className={cn(
                                'w-4 h-4 transition-transform',
                                expandedItems.includes(item.title) && 'rotate-180'
                              )}
                            />
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </button>
                  
                  <AnimatePresence>
                    {expandedItems.includes(item.title) && !collapsed && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-8 mt-1 space-y-1 overflow-hidden"
                      >
                        {item.children.map((child) => (
                          <li key={child.path}>
                            <NavLink
                              to={child.path}
                              className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all',
                                isActivePath(child.path)
                                  ? 'bg-sidebar-primary/20 text-sidebar-foreground font-medium'
                                  : 'text-sidebar-muted hover:bg-sidebar-primary/10 hover:text-sidebar-foreground'
                              )}
                            >
                              <span
                                className={cn(
                                  'w-1.5 h-1.5 rounded-full',
                                  isActivePath(child.path)
                                    ? 'bg-sidebar-foreground'
                                    : 'bg-sidebar-muted'
                                )}
                              />
                              {child.title}
                              {child.badge && (
                                <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                                  {child.badge}
                                </span>
                              )}
                            </NavLink>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink
                  to={item.path!}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                    isActivePath(item.path!)
                      ? 'bg-sidebar-primary/20 text-sidebar-foreground'
                      : 'text-sidebar-muted hover:bg-sidebar-primary/10 hover:text-sidebar-foreground'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-medium"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile Section */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 border-t border-sidebar-border/30"
          >
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-12 h-12 border-2 border-sidebar-foreground/20">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=sourav" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sidebar-foreground font-medium text-sm">Sourav Chandak</p>
                <p className="text-sidebar-muted text-xs">sourav@company.com</p>
              </div>
              <span className="px-2 py-0.5 bg-success text-success-foreground text-xs rounded-full">
                Active
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-sidebar-muted">Finish Setup</span>
                <span className="text-sidebar-foreground font-medium">80%</span>
              </div>
              <Progress value={80} className="h-1.5 bg-sidebar-border" />
              <Button
                variant="secondary"
                size="sm"
                className="w-full mt-2 bg-sidebar-foreground text-sidebar-background hover:bg-sidebar-foreground/90"
              >
                Update Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
