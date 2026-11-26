import { useState, type ReactNode } from 'react'
import { Content, Theme } from '@carbon/react'
import { AppHeader } from './AppHeader'
import { AppSidebar } from './AppSidebar'

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(true);

  const handleToggleSideNav = () => {
    setIsSideNavExpanded((prev) => !prev);
  }

  const handleCloseSideNav = () => {
    setIsSideNavExpanded(false);
  }

  return (
    <>
      <Theme theme="g100">
        <AppHeader isSideNavExpanded={isSideNavExpanded} onClickSideNavExpand={handleToggleSideNav} />
        <AppSidebar isSideNavExpanded={isSideNavExpanded} onOverlayClick={handleCloseSideNav} />
      </Theme>

      <Content id="main-content" style={{ marginLeft: '16rem', minHeight: 'calc(100vh - 3rem)' }}>
        {children}
      </Content>
    </>
  );
};
