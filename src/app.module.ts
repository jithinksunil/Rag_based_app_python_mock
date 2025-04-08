import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/primsa.module';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from './aws/aws.module';
import { PdfEmbeddingService } from './embedding.service';
import { GlobalHttpModule } from './global-http/global-http.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AwsModule,
    GlobalHttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, PdfEmbeddingService],
  exports: [PdfEmbeddingService],
})
export class AppModule {}
