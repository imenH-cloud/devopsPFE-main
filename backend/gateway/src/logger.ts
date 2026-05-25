import { Injectable, LoggerService } from '@nestjs/common';

interface LogContext {
  timestamp: string;
  level: 'INFO' | 'ERROR' | 'WARN' | 'DEBUG';
  service: string;
  message: string;
  context?: string;
  error?: string;
  stack?: string;
  traceId?: string;
  userId?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

@Injectable()
export class StructuredLogger implements LoggerService {
  private serviceName = process.env.SERVICE_NAME || 'api-service';
  private logFormat = process.env.LOG_FORMAT || 'json';

  private formatLog(log: LogContext): string {
    if (this.logFormat === 'json') {
      return JSON.stringify(log);
    }
    // Text format
    return `[${log.timestamp}] [${log.level}] [${log.service}] ${log.message} ${
      log.context ? `(${log.context})` : ''
    } ${log.error ? `Error: ${log.error}` : ''}`;
  }

  log(message: string, context?: string) {
    const log: LogContext = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      service: this.serviceName,
      message,
      context,
      traceId: this.getTraceId(),
    };
    console.log(this.formatLog(log));
  }

  error(message: string, trace?: string, context?: string) {
    const log: LogContext = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      service: this.serviceName,
      message,
      context,
      error: message,
      stack: trace,
      traceId: this.getTraceId(),
    };
    console.error(this.formatLog(log));
  }

  warn(message: string, context?: string) {
    const log: LogContext = {
      timestamp: new Date().toISOString(),
      level: 'WARN',
      service: this.serviceName,
      message,
      context,
      traceId: this.getTraceId(),
    };
    console.warn(this.formatLog(log));
  }

  debug(message: string, context?: string) {
    const log: LogContext = {
      timestamp: new Date().toISOString(),
      level: 'DEBUG',
      service: this.serviceName,
      message,
      context,
      traceId: this.getTraceId(),
    };
    console.debug(this.formatLog(log));
  }

  verbose(message: string, context?: string) {
    this.debug(message, context);
  }

  private getTraceId(): string {
    // In production, extract from request context
    // For now, generate a simple trace ID
    return Math.random().toString(36).substring(7);
  }
}
