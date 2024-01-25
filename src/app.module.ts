import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

import config from './commons/config/config';
import { IAppConfig } from './commons/interface/interface';

import { AppController } from './app.controller';

import { UserModule } from './user/user.module';
import { TaskModule } from './tasks/tasks.module';
import { AdminModule } from './admin/admin.module';
import { BanksModule } from './banks/banks.module';
import { AuthModule } from './authentication/auth.module';
import { CommonsModule } from './commons/commons.module';
import { DocumentModule } from './document/document.module';
import { CompanyModule } from './company/company.module';
import { BalanceModule } from './balance/balance.module';
import { WalletsModule } from './wallets/wallets.module';
import { TransactionsModule } from './transactions/transactions.module';
import { EmailAndSmsManagementModule } from './email_sms_managements/email_sms_management.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ScheduleModule.forRoot(),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const appConfig = configService.get<IAppConfig>('config');
        return {
          dialect: 'postgres',
          host: appConfig.database.host,
          database: appConfig.database.name,
          username: appConfig.database.username,
          password: appConfig.database.password,
          autoLoadModels: true,
          define: {
            freezeTableName: true,
          },
        };
      },
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_secret'),
        signOptions: { expiresIn: '120m' }, // expires in 2 hours
        global: true,
      }),
      inject: [ConfigService],
    }),
    BanksModule,
    HttpModule,
    AuthModule,
    UserModule,
    TaskModule,
    AdminModule,
    CommonsModule,
    DocumentModule,
    CompanyModule,
    BalanceModule,
    WalletsModule,
    TransactionsModule,
    EmailAndSmsManagementModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
