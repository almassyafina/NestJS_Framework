import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BooksModule } from './books/books.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { LogMiddlewareMiddleware } from './middleware/log-middleware/log-middleware.middleware.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi, { valid } from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module.js';
import { CategoriesController } from './categories/categories.controller.js';
import { CategoriesModule } from './categories/categories.module.js';
import { PublishersModule } from './publishers/publishers.module.js';
import { AuthorsModule } from './authors/authors.module.js';
import { BookAuthorsModule } from './book-authors/book-authors.module.js';
import { CustomersModule } from './customers/customers.module.js';
import { CustomerAddressesModule } from './customer-addresses/customer-addresses.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { OrderItemsModule } from './order-items/order-items.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { ShipmentsModule } from './shipments/shipments.module.js';

@Module({
  imports: [BooksModule, 
    AuthModule, 
    UserModule,
    ConfigModule.forRoot({
      isGlobal:true,
      validationSchema:Joi.object({
        PORT:Joi.number().default(3000),
        NODE_ENV:Joi.string().valid('development', 'staging', 'production').default('development'),
        DB_HOST:Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME:Joi.string().required(),
        DB_PASSWORD:Joi.string().required(),
        DB_DATABASE:Joi.string().required(),
      })
    }),
    
TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),

    autoLoadEntities: true,

    synchronize: configService.get<string>('NODE_ENV') === 'development'
  })
}),
    
UsersModule,
    
CategoriesModule,
    
PublishersModule,
    
AuthorsModule,
    
BookAuthorsModule,
    
CustomersModule,
    
CustomerAddressesModule,
    
OrdersModule,
    
OrderItemsModule,
    
PaymentsModule,
    
ShipmentsModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddlewareMiddleware)
    .forRoutes('*')
  }
}

