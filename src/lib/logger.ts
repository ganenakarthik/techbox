/**
 * Production Structured Logger for Google Cloud Logging
 * Formats output as JSON with severity and request context for automatic indexing.
 */

type LogSeverity = "DEBUG" | "INFO" | "NOTICE" | "WARNING" | "ERROR" | "CRITICAL";

interface LogPayload {
  message: string;
  severity?: LogSeverity;
  correlationId?: string;
  userId?: string;
  orderNumber?: string;
  context?: Record<string, any>;
  error?: Error | string;
}

export class Logger {
  private static isProduction = process.env.NODE_ENV === "production";

  private static log(severity: LogSeverity, payload: LogPayload) {
    const timestamp = new Date().toISOString();

    if (!this.isProduction) {
      // Human-readable dev output
      const prefix = `[${severity}] [${timestamp}]`;
      if (severity === "ERROR" || severity === "CRITICAL") {
        console.error(`${prefix} ${payload.message}`, payload.context || "", payload.error || "");
      } else if (severity === "WARNING") {
        console.warn(`${prefix} ${payload.message}`, payload.context || "");
      } else {
        console.log(`${prefix} ${payload.message}`, payload.context || "");
      }
      return;
    }

    // Single-line JSON formatted for Google Cloud Logging
    const gcpEntry: Record<string, any> = {
      severity,
      message: payload.message,
      timestamp,
      serviceContext: { service: "partsly-core", version: "0.1.1" },
      ...payload.context,
    };

    if (payload.correlationId) {
      gcpEntry["logging.googleapis.com/trace"] = payload.correlationId;
    }
    if (payload.userId) {
      gcpEntry["userId"] = payload.userId;
    }
    if (payload.orderNumber) {
      gcpEntry["orderNumber"] = payload.orderNumber;
    }
    if (payload.error) {
      gcpEntry["errorDetails"] =
        typeof payload.error === "string" ? payload.error : payload.error.stack || payload.error.message;
    }

    console.log(JSON.stringify(gcpEntry));
  }

  static info(message: string, context?: Record<string, any>) {
    this.log("INFO", { message, context });
  }

  static warn(message: string, context?: Record<string, any>) {
    this.log("WARNING", { message, context });
  }

  static error(message: string, error?: any, context?: Record<string, any>) {
    this.log("ERROR", { message, error, context });
  }

  static critical(message: string, error?: any, context?: Record<string, any>) {
    this.log("CRITICAL", { message, error, context });
  }
}
