import { useMemo, type ComponentType } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { SideNav, SideNavItems, SideNavLink, SideNavDivider } from '@carbon/react'
import { UserMultiple, Education, Catalog, DocumentTasks, TaskComplete } from '@carbon/icons-react'
import { useUserMode, type ViewMode } from '../../context/UserModeContext'

interface NavItemConfig {
  path: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
  allowedModes: ViewMode[];
  dividerBefore?: boolean;
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    path: '/assignments',
    label: 'Assignments',
    icon: TaskComplete,
    allowedModes: ['ALL', 'TEACHER', 'STUDENT'],
  },
  {
    path: '/assessments',
    label: 'Assessments',
    icon: DocumentTasks,
    allowedModes: ['ALL', 'TEACHER'],
  },
  {
    path: '/questions',
    label: 'Question Bank',
    icon: Catalog,
    allowedModes: ['ALL', 'TEACHER'],
  },
  {
    path: '/classes',
    label: 'Class Groups',
    icon: Education,
    allowedModes: ['ALL', 'TEACHER'],
  },
  {
    path: '/users',
    label: 'Users Directory',
    icon: UserMultiple,
    allowedModes: ['ALL'],
    dividerBefore: true,
  }
];

interface AppSidebarProps {
  isSideNavExpanded: boolean;
  onOverlayClick: () => void;
}

export const AppSidebar = ({ isSideNavExpanded, onOverlayClick }: AppSidebarProps) => {
  const { mode } = useUserMode();
  const location = useLocation();
  const navigate = useNavigate();

  const visibleItems = useMemo(
    () => NAV_ITEMS.filter((item) => item.allowedModes.includes(mode)),
    [mode]
  );

  const handleNavigate = (path: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(path);
    onOverlayClick();
  }

  return (
    <SideNav aria-label="Side navigation" expanded={isSideNavExpanded} onOverlayClick={onOverlayClick} isRail={false}>
      <SideNavItems>
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

          return (
            <div key={item.path}>
              {item.dividerBefore && <SideNavDivider />}
              <SideNavLink renderIcon={item.icon} href={item.path} isActive={isActive} onClick={handleNavigate(item.path)}>
                {item.label}
              </SideNavLink>
            </div>
          );
        })}
      </SideNavItems>
    </SideNav>
  )
}