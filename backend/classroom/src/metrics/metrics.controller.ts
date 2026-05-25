import { Controller, Get } from '@nestjs/common';
import * as promClient from 'prom-client';

@Controller('metrics')
export class MetricsController {
  private readonly register: promClient.Registry;

  constructor() {
    this.register = new promClient.Registry();
    promClient.collectDefaultMetrics({ register: this.register });
  }

  @Get()
  async getMetrics() {
    return this.register.metrics();
  }
}
