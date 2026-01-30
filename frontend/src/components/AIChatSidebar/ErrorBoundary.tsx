'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Copy, Check } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      copied: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AI Chat Error Boundary caught an error:', error, errorInfo);
    
    // Log to error reporting service if available
    if (typeof window !== 'undefined' && typeof window.navigator?.sendBeacon === 'function') {
      try {
        // Could send to error tracking service
        // const errorData = {
        //   message: error.message,
        //   stack: error.stack,
        //   componentStack: errorInfo.componentStack,
        //   timestamp: new Date().toISOString(),
        //   userAgent: navigator.userAgent,
        //   url: window.location.href,
        // };
        // window.navigator.sendBeacon('/api/errors', JSON.stringify(errorData));
      } catch {
        // Silently fail if error reporting fails
      }
    }

    this.setState({ errorInfo });
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null,
      copied: false,
    });
  };

  handleCopyError = async () => {
    if (!this.state.error) return;
    
    const errorText = `
Error: ${this.state.error.message}
Stack: ${this.state.error.stack}
Component Stack: ${this.state.errorInfo?.componentStack || 'N/A'}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorText);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch (e) {
      console.error('Failed to copy error:', e);
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-red-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full border border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Something went wrong</h3>
                <p className="text-sm text-gray-600">The AI chat encountered an error</p>
              </div>
            </div>
            
            {this.state.error && (
              <div className="mb-4">
                <div className="p-3 bg-gray-50 rounded text-xs font-mono text-gray-700 overflow-auto max-h-32 mb-2">
                  <div className="font-semibold mb-1">Error Message:</div>
                  {this.state.error.message}
                </div>
                <button
                  onClick={this.handleCopyError}
                  className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  aria-label="Copy error details"
                >
                  {this.state.copied ? (
                    <>
                      <Check className="h-3 w-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy Error Details
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label="Try again"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Reload page"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

