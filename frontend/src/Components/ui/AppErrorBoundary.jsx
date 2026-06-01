import { Component } from "react";
import Button from "./Button";

class AppErrorBoundary extends Component {
   constructor(props) {
      super(props);
      this.state = { hasError: false };
   }

   static getDerivedStateFromError() {
      return { hasError: true };
   }

   componentDidCatch(error, errorInfo) {
      console.error("App crashed:", error, errorInfo);
   }

   handleReset = () => {
      this.setState({ hasError: false });
      window.location.href = "/";
   };

   render() {
      if (this.state.hasError) {
         return (
            <div className="flex min-h-screen items-center justify-center bg-app-bg px-4">
               <div className="max-w-md rounded-card border border-app-border bg-app-sidebar p-6 text-center">
                  <h1 className="text-xl font-semibold text-app-text-primary">
                     Something broke on this page
                  </h1>
                  <p className="mt-2 text-sm text-app-text-secondary">
                     Try refreshing. If the issue continues, sign out and sign in again.
                  </p>
                  <Button className="mt-5" onClick={this.handleReset}>
                     Back to Home
                  </Button>
               </div>
            </div>
         );
      }

      return this.props.children;
   }
}

export default AppErrorBoundary;
