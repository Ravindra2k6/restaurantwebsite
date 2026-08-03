import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "./components/Error/ErrorBoundary";
import { SettingsProvider } from "./context/SettingsContext";
import { ToastProvider } from "./context/ToastContext";
import { LanguageProvider } from "./context/LanguageContext";
import AppRoutes from "./routes/AppRoutes";
import AnalyticsListener from "./components/Analytics/AnalyticsListener";

/**
 * Provider order matters: ErrorBoundary is outermost so it can catch errors
 * from anything below it (including context providers). HelmetProvider must
 * wrap anything using <SEO />. SettingsProvider is needed by the Navbar,
 * Footer, and several pages, so it wraps the router. AnalyticsListener must
 * be *inside* BrowserRouter since it reads the current route via useLocation.
 */
function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <SettingsProvider>
          <LanguageProvider>
            <ToastProvider>
              <BrowserRouter>
                <AnalyticsListener />
                <AppRoutes />
              </BrowserRouter>
            </ToastProvider>
          </LanguageProvider>
        </SettingsProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
