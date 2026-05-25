import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as promClient from 'prom-client';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  private httpRequestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5],
  });

  private httpRequestTotal = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
  });

  private httpRequestSize = new promClient.Histogram({
    name: 'http_request_size_bytes',
    help: 'HTTP request size in bytes',
    labelNames: ['method', 'route'],
    buckets: [100, 1000, 10000, 100000],
  });

  private httpResponseSize = new promClient.Histogram({
    name: 'http_response_size_bytes',
    help: 'HTTP response size in bytes',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [100, 1000, 10000, 100000],
  });

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const requestSize = this.getRequestSize(req);

    // Track request size
    this.httpRequestSize
      .labels(req.method, req.route?.path || req.path)
      .observe(requestSize);

    // Intercept response
    const originalSend = res.send;
    res.send = function (data: any) {
      const duration = (Date.now() - startTime) / 1000;
      const statusCode = res.statusCode;
      const route = req.route?.path || req.path;

      // Record metrics
      this.httpRequestDuration
        .labels(req.method, route, statusCode)
        .observe(duration);

      this.httpRequestTotal
        .labels(req.method, route, statusCode)
        .inc();

      const responseSize = typeof data === 'string' ? 
        Buffer.byteLength(data) : 
        JSON.stringify(data).length;
      
      this.httpResponseSize
        .labels(req.method, route, statusCode)
        .observe(responseSize);

      return originalSend.call(this, data);
    }.bind(this);

    next();
  }

  private getRequestSize(req: Request): number {
    let size = 0;

    if (req.headers) {
      size += JSON.stringify(req.headers).length;
    }

    if (req.body) {
      size += typeof req.body === 'string' ? 
        Buffer.byteLength(req.body) : 
        JSON.stringify(req.body).length;
    }

    return size;
  }

  async getMetrics(): Promise<string> {
    return await promClient.register.metrics();
  }
}
