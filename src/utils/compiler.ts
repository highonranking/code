// Compiler utilities for executing JavaScript code

interface ExecutionResult {
  output: string;
  error: string | null;
  logs: string[];
}

export const compiler = {
  executeCode: async (jsCode: string, htmlCode: string, cssCode: string): Promise<ExecutionResult> => {
    try {
      // Create a sandbox iframe to execute code safely
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('Could not access iframe document');

      // Capture console logs
      const logs: string[] = [];

      if (iframeDoc.defaultView) {
        iframeDoc.defaultView.console.log = (...args: any[]) => {
          logs.push(args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' '));
        };
        iframeDoc.defaultView.console.error = (...args: any[]) => {
          logs.push(`Error: ${args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ')}`);
        };
      }

      // Construct HTML with CSS and JS
      const fullHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              ${cssCode}
            </style>
          </head>
          <body>
            ${htmlCode}
            <script>
              try {
                ${jsCode}
              } catch (err) {
                console.error(err.message);
              }
            </script>
          </body>
        </html>
      `;

      iframeDoc.open();
      iframeDoc.write(fullHTML);
      iframeDoc.close();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 100);

      return {
        output: '',
        error: null,
        logs,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        output: '',
        error: errorMessage,
        logs: [],
      };
    }
  },

  executeJavaScript: async (code: string): Promise<ExecutionResult> => {
    const logs: string[] = [];

    try {
      // Create a new function to execute code in a controlled scope
      const originalLog = console.log;
      const originalError = console.error;

      console.log = (...args: any[]) => {
        logs.push(args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg))).join(' '));
      };

      console.error = (...args: any[]) => {
        logs.push(`Error: ${args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ')}`);
      };

      // Execute code
      const func = new Function(code);
      func();

      console.log = originalLog;
      console.error = originalError;

      return {
        output: logs.join('\n'),
        error: null,
        logs,
      };
    } catch (error) {
      console.log = console.log;
      console.error = console.error;

      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        output: '',
        error: errorMessage,
        logs,
      };
    }
  },
};
