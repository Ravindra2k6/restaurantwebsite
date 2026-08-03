import { Component } from "react";
import { FiAlertOctagon } from "react-icons/fi";

/**
 * Class-based Error Boundary (required — hooks can't catch render errors).
 * Wraps the whole app in App.jsx so a bug in one page/component doesn't
 * take down the entire site with a blank white screen.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("Uncaught error in component tree:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-6 text-center">
          <FiAlertOctagon className="text-primary-500" size={48} />
          <h1 className="text-2xl font-display font-bold text-charcoal-900">
            Something went wrong
          </h1>
          <p className="max-w-md text-charcoal-500">
            We hit an unexpected error. Please try reloading the page — if the problem
            continues, contact us directly.
          </p>
          <button onClick={this.handleReload} className="btn-primary mt-2">
            Back to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
