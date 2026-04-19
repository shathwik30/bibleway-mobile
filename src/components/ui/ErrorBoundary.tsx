import React, { Component, type ErrorInfo, type ReactNode } from "react";
import ErrorState from "./ErrorState";
import { logger } from "@/utils/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error("[ErrorBoundary]", error.message, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <ErrorState
            message="Something went wrong"
            onRetry={this.handleRetry}
          />
        )
      );
    }
    return this.props.children;
  }
}
