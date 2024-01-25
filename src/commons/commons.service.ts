import { lastValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios/dist';
import { DateTime, DateTimeOptions } from 'luxon';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { DATE_FORMATS } from './commons.constants';
interface IDateConversion {
  input: string;
  from?: string;
  to?: string;
  options?: DateTimeOptions;
}

@Injectable()
export class CommonsService {
  constructor(private readonly httpService: HttpService) {}

  async post(
    url: string,
    data: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    const observable = this.httpService.post(url, data, config);
    return await lastValueFrom(observable);
  }

  async get(url: string, data: AxiosRequestConfig): Promise<AxiosResponse> {
    const observable = this.httpService.get(url, data);
    return await lastValueFrom(observable);
  }

  generateRandomNumber(numberOfDigits = 4): number {
    let min = Math.pow(10, numberOfDigits - 1);
    let max = Math.pow(10, numberOfDigits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateFramerId(prefix = ''): string {
    return `${prefix}-${(Math.random() * Date.now()).toString().slice(0, 10)}`;
  }

  dateonly(input: Date, format = DATE_FORMATS.format1): string {
    return DateTime.fromJSDate(input).toFormat(format);
  }

  convertDates(dateConversion: IDateConversion): string {
    let { input, to, from, options } = dateConversion;

    options = options || {};
    to = to || DATE_FORMATS.format1;
    from = from || DATE_FORMATS.format2;

    return DateTime.fromFormat(input, from, options).toFormat(to);
  }
}
