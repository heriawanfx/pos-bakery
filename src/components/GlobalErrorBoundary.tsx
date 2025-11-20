import React from "react";
import { Button } from "./ui/Button";
import { AlertTriangle } from "lucide-react";

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
}

interface GlobalErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class GlobalErrorBoundary extends React.Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): GlobalErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Bisa kirim ke logging service di sini nanti
    console.error("GlobalErrorBoundary caught an error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h1 className="text-base font-semibold">
                  Something went wrong
                </h1>
                <p className="text-xs text-muted-foreground">
                  An unexpected error occurred. You can try reloading the app.
                </p>
              </div>
            </div>

            {this.state.error?.message && (
              <div className="rounded-lg bg-muted px-3 py-2">
                <p className="text-[11px] font-mono text-muted-foreground break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="button" onClick={this.handleReload}>
                Reload app
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
