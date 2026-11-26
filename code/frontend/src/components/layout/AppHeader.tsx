import { Header, HeaderName, HeaderMenuButton, HeaderGlobalBar, SkipToContent } from '@carbon/react'
import { PersonaSwitcher } from './PersonaSwitcher'

interface AppHeaderProps {
  isSideNavExpanded: boolean;
  onClickSideNavExpand: () => void;
}

export const AppHeader = ({ isSideNavExpanded, onClickSideNavExpand }: AppHeaderProps) => {
  return (
    <Header aria-label="Assessment System">
      <SkipToContent />
      <HeaderMenuButton
        aria-label={isSideNavExpanded ? 'Close menu' : 'Open menu'}
        onClick={onClickSideNavExpand}
        isActive={isSideNavExpanded}
        aria-expanded={isSideNavExpanded}
      />

      <HeaderName href="/" prefix="UEL">Assessment Manager</HeaderName>

      <HeaderGlobalBar>
        <PersonaSwitcher />
      </HeaderGlobalBar>
    </Header>
  )
}
