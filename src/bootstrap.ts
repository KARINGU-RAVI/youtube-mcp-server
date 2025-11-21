// Bootstrap file to silence unwanted stdout output from third-party modules
// Runs before the main application to ensure stdout is not polluted.

// Redirect console.log to stderr to keep stdout clean for JSON-RPC
const originalConsoleLog = console.log.bind(console);
console.log = (...args: any[]) => {
  console.error(...args);
};

// Intercept direct writes to stdout. If the message appears to be a
// diagnostic from a module (e.g., starts with "[dotenv@"), forward it to stderr
// instead of stdout. Otherwise, write to stdout as normal.
const origStdoutWrite = process.stdout.write.bind(process.stdout);
process.stdout.write = ((chunk: any, encoding?: any, cb?: any) => {
  try {
    const str = typeof chunk === 'string' ? chunk : chunk.toString(encoding);
    if (str && str.indexOf('[dotenv@') !== -1) {
      // Send to stderr so JSON-RPC on stdout is not corrupted
      process.stderr.write(str, encoding, cb);
      return true;
    }
  } catch (e) {
    // ignore and fall through
  }
  return origStdoutWrite(chunk, encoding, cb);
}) as typeof process.stdout.write;

// Now import the real application entrypoint.
import './index';
