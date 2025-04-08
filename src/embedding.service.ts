import { Injectable } from '@nestjs/common';
import * as pdf from 'pdf-parse';
import { OpenAI } from 'openai';

@Injectable()
export class PdfEmbeddingService {
  async extractTextFromPdf(buffer: Buffer): Promise<string> {
    const data = await pdf(buffer);
    return data.text;
  }

  async createEmbeddingFromText(text: string): Promise<number[]> {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // or inject using ConfigService
    });
    const trimmedText = text.slice(0, 8000); // truncate to avoid token limit
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small', // or text-embedding-3-large
      input: trimmedText,
    });

    return response.data[0].embedding;
  }

  async processPdfToEmbedding(pdfBuffer: Buffer): Promise<number[]> {
    const text = await this.extractTextFromPdf(pdfBuffer);
    return await this.createEmbeddingFromText(text);
    
  }
}
