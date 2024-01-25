import { AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

import { Wathq } from './wathq.model';

import { IWathq } from './wathq.interface';
import { IAppConfig } from 'src/commons/interface/interface';

import { CommonsService } from 'src/commons/commons.service';

@Injectable()
export class WathqService {
  constructor(
    @InjectModel(Wathq)
    private readonly wathqRepository: typeof Wathq,
    private readonly configService: ConfigService,
    private readonly commonsService: CommonsService,
  ) {}

  async create(data: IWathq): Promise<Wathq> {
    return this.wathqRepository.create<Wathq>(data);
  }

  async update(data: IWathq, cr_number: string): Promise<any> {
    return this.wathqRepository.update<Wathq>(data, {
      where: { cr_number },
    });
  }

  async findByCr(cr: string): Promise<null | Wathq> {
    return this.wathqRepository.findOne<Wathq>({
      where: { cr_number: cr },
    });
  }

  async getManagers(cr: string): Promise<AxiosResponse> {
    const { wathq } = this.configService.get<IAppConfig>('config');
    return await this.commonsService.get(`${wathq.baseUrl}/managers/${cr}`, {
      headers: { apiKey: wathq.key },
    });
  }

  async getOwners(cr: string): Promise<AxiosResponse> {
    const { wathq } = this.configService.get<IAppConfig>('config');
    return await this.commonsService.get(`${wathq.baseUrl}/owners/${cr}`, {
      headers: { apiKey: wathq.key },
    });
  }

  async getWathqInfo(cr: string): Promise<AxiosResponse> {
    const { wathq } = this.configService.get<IAppConfig>('config');
    return await this.commonsService.get(`${wathq.baseUrl}/info/${cr}`, {
      headers: { apiKey: this.getKey() },
    });
  }

  getKey(): string {
    const { wathq } = this.configService.get<IAppConfig>('config');
    const keyPool = JSON.parse(wathq.freeKeys) || [];
    const wathqPool = [];

    for (const key of keyPool) {
      wathqPool.push({ key: key, counter: 0 });
    }

    const obj = wathqPool.find((o) => o.counter < 30);
    if (obj) {
      obj.counter++;
      return obj.key;
    }

    return wathq.key;
  }

  async sendElm(oid: string): Promise<AxiosResponse> {
    const { elm } = this.configService.get<IAppConfig>('config');
    const headers = { headers: { api_key: elm.key } };
    return this.commonsService.post(elm.ip, { oid }, headers);
  }
}
