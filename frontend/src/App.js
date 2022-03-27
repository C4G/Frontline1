// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
// providers
import { AuthenticatedUserProvider } from './providers/UserProvider';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <AuthenticatedUserProvider>
        <ScrollToTop />
        <GlobalStyles />
        <BaseOptionChartStyle />
        <Router />
      </AuthenticatedUserProvider>
    </ThemeConfig>
  );
}
