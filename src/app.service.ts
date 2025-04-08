import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PdfEmbeddingService } from './embedding.service';
import { AwsService } from './aws/aws.service';
import { InjestionStatus } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private injestion: PdfEmbeddingService,
    private aws: AwsService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async startInjestion(documentId: string) {
    try {
      const document = await this.prisma.documents.findUnique({
        where: { id: documentId },
        select: { s3BucketKey: true, s3BucketLocation: true, fileName: true },
      });
      const buffer = await this.aws.getBufferOfFile(document.s3BucketKey);
      const content = await this.injestion.extractTextFromPdf(buffer);
      // const embeddingArray =
      //   await this.injestion.createEmbeddingFromText(content);
      // const embeddingString = JSON.stringify(embeddingArray);
      await this.prisma.documents.update({
        where: { id: documentId },
        data: {
          // embedding: [],
          content,
          injestionStatus: InjestionStatus.COMPLETED,
        },
      });
      return 'Job Completed';
    } catch (error) {
      await this.prisma.documents.update({
        where: { id: documentId },
        data: {
          injestionStatus: InjestionStatus.FAILED,
        },
      });
      return 'Job Failed';
    }
  }

  async askQuestion({
    documentId,
    question,
  }: {
    question: string;
    documentId: string;
  }) {
    const document = await this.prisma.documents.findUnique({
      where: { id: documentId },
      select: { content: true },
    });
    const characters = this.getFirst100Characters(document.content);
    if (!characters)
      return { answer: 'Cannot extract any details for document' };
    const answer = `This mock api will always return your question and first 100 characters of the document: \nQuestion: ${question}\n First 300 characters: ${characters}`;
    return { answer };
  }

  getFirst100Characters(text: string): string {
    if (!text || text.trim().length === 0) {
      return '';
    }
    return text.slice(0, 300);
  }
}
