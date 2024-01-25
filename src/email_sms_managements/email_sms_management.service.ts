import {
  Transporter,
  createTransport,
  SendMailOptions,
  SentMessageInfo,
} from 'nodemailer';
import { join, parse } from 'path';
import Handlebars from 'handlebars';
import { google } from 'googleapis';
import { AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { readdirSync, readFileSync, readFile } from 'fs';
import * as handlebarsLayouts from 'handlebars-layouts';

import { CommonsService } from 'src/commons/commons.service';

import { IAppConfig } from 'src/commons/interface/interface';
import { IEmailSmsManagement } from './email_sms_management.interface';

import { EmailAndSmsManagement } from './email_sms_management.model';

type TSendEmailData = {
  from: string;
  to: string;
  template: string;
  subject: string;
  replacements: string;
};

const handlebars = Handlebars.create();
handlebars.registerHelper(handlebarsLayouts(handlebars));

@Injectable()
export class EmailAndSmsManagementService {
  constructor(
    @InjectModel(EmailAndSmsManagement)
    private readonly emailSmsRepository: typeof EmailAndSmsManagement,
    private readonly configService: ConfigService,
    private readonly commonsService: CommonsService,
  ) {}

  async create(data: IEmailSmsManagement): Promise<EmailAndSmsManagement> {
    return this.emailSmsRepository.create<EmailAndSmsManagement>(data);
  }

  async update(
    data: IEmailSmsManagement,
    whereOption: Record<string, any>,
  ): Promise<any[]> {
    return this.emailSmsRepository.update<EmailAndSmsManagement>(data, {
      where: whereOption,
    });
  }

  async sendSMS(message: any, phone: string): Promise<AxiosResponse> {
    const appConfig = this.configService.get<IAppConfig>('config');
    return await this.commonsService.post(appConfig.unifonic.baseUrl, {
      Recipient: phone,
      AppSid: appConfig.unifonic.appsId,
      SenderID: appConfig.unifonic.senderId,
      Body: message,
      baseEncode: true,
      responseType: 'JSON',
      async: false,
      CorrelationId: 'splyd' + this.commonsService.generateRandomNumber(),
    });
  }

  async sendEmail(data: TSendEmailData): Promise<SentMessageInfo> {
    let htmlToSend = data.replacements;

    const partialsDirectory = process.cwd() + '/src/templates/_partials';
    this.registerPartials(partialsDirectory);

    if (data.template) {
      const templatePath = this.getTemplate(data.template);
      const html = await this.readHTMLFile(templatePath);
      let templateMethod = handlebars.compile(html);
      const replacements = JSON.parse(data.replacements);
      htmlToSend = templateMethod(replacements);
    }

    const myAccessToken = await this.getAccessToken();

    const { google } = this.configService.get<IAppConfig>('config');

    const transport: Transporter = createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: google.user,
        clientId: google.clientId,
        clientSecret: google.clientSecret,
        refreshToken: google.refreshToken,
        accessToken: myAccessToken,
      },
    });

    const mailOptions: SendMailOptions = {
      to: data.to,
      from: data.from,
      html: htmlToSend,
      subject: data.subject,
    };

    return transport.sendMail(mailOptions);
  }

  async getAccessToken(): Promise<string | null | undefined> {
    const OAuth2 = google.auth.OAuth2;

    const appConfig = this.configService.get<IAppConfig>('config');

    const myOAuth2Client = new OAuth2(
      appConfig.google.clientId,
      appConfig.google.clientSecret,
    );

    myOAuth2Client.setCredentials({
      refresh_token: appConfig.google.refreshToken,
    });

    const tokenObject = await myOAuth2Client.getAccessToken();
    return tokenObject?.token;
  }

  getTemplate(template: string): string {
    return process.cwd() + '/src/templates/emails' + '/' + template + '.html';
  }

  async readHTMLFile(path: string): Promise<any> {
    return new Promise((res, rej) => {
      readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
          console.log(err);
          return rej(err);
        } else {
          return res(html);
        }
      });
    });
  }

  registerPartials(partialsDirectory: string): void {
    /**
     Register all partial files

     Partials are normal Handlebars templates 
     that may be called directly by other templates.
     All partial files are stored in the folder below:
     process.cwd() + "/src/templates/_partials"
  */

    for (const file of readdirSync(partialsDirectory)) {
      const filePath = join(partialsDirectory, file);
      const fileName = parse(file).name;
      const partialTemplate = readFileSync(filePath, 'utf-8');
      handlebars.registerPartial(fileName, partialTemplate);
    }
  }
}
