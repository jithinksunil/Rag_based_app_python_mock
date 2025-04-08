import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('/injestion/start')
  startInjestion(@Body() body: { documentId: string }) {
    return this.appService.startInjestion(body.documentId);
  }

  @Post('/conversation/document/:documentId/ask-question')
  askQuestion(
    @Param('documentId') documentId: string,
    @Body() body: { question: string },
  ) {
    return this.appService.askQuestion({
      documentId,
      question: body.question,
    });
  }
}
