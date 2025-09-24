import { useCallback } from "react";

interface LogLevel {
  error: "error";
  warn: "warn";
  info: "info";
  debug: "debug";
}

type LogLevelType = keyof LogLevel;

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

interface Logger {
  error: (
    message: string,
    error?: Error | unknown,
    context?: LogContext
  ) => void;
  warn: (message: string, context?: LogContext) => void;
  info: (message: string, context?: LogContext) => void;
  debug: (message: string, context?: LogContext) => void;
}

const isDevelopment = process.env.NODE_ENV === "development";

const formatLogMessage = (
  level: LogLevelType,
  message: string,
  context?: LogContext,
  error?: Error | unknown
): string => {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` [${JSON.stringify(context)}]` : "";
  const errorStr = error
    ? ` - Error: ${error instanceof Error ? error.message : String(error)}`
    : "";

  return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}${errorStr}`;
};

export const useLogger = (): Logger => {
  const log = useCallback(
    (
      level: LogLevelType,
      message: string,
      error?: Error | unknown,
      context?: LogContext
    ) => {
      const formattedMessage = formatLogMessage(level, message, context, error);

      // Solo log en desarrollo
      if (isDevelopment) {
        switch (level) {
          case "error":
            console.error(formattedMessage);
            if (error instanceof Error && error.stack) {
              console.error("Stack trace:", error.stack);
            }
            break;
          case "warn":
            console.warn(formattedMessage);
            break;
          case "info":
            console.info(formattedMessage);
            break;
          case "debug":
            console.debug(formattedMessage);
            break;
          default:
            console.log(formattedMessage);
        }
      }

      // En producción, podrías enviar a un servicio de logging como Sentry, LogRocket, etc.
      // if (!isDevelopment && level === 'error') {
      //   // Enviar a servicio de logging
      // }
    },
    []
  );

  const logger: Logger = {
    error: (message: string, error?: Error | unknown, context?: LogContext) => {
      log("error", message, error, context);
    },
    warn: (message: string, context?: LogContext) => {
      log("warn", message, undefined, context);
    },
    info: (message: string, context?: LogContext) => {
      log("info", message, undefined, context);
    },
    debug: (message: string, context?: LogContext) => {
      log("debug", message, undefined, context);
    },
  };

  return logger;
};

export default useLogger;
