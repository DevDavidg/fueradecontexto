import { useCallback, useMemo } from "react";

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
    error?: Error | Record<string, unknown>,
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
  error?: Error | Record<string, unknown>
): string => {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` [${JSON.stringify(context)}]` : "";
  const errorMessage =
    error instanceof Error ? error.message : JSON.stringify(error);
  const errorStr = error ? ` - Error: ${errorMessage}` : "";

  return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}${errorStr}`;
};

export const useLogger = (): Logger => {
  const log = useCallback(
    (
      level: LogLevelType,
      message: string,
      error?: Error | Record<string, unknown>,
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

  const logger: Logger = useMemo(
    () => ({
      error: (
        message: string,
        error?: Error | Record<string, unknown>,
        context?: LogContext
      ) => {
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
    }),
    [log]
  );

  return logger;
};

export default useLogger;
