import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { TranslateService } from './translate.service';

@Controller('translate')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Post()
  async translate(@Body() body: { text: string; targetLanguage: string }) {
    console.log('Received request:', body); // Log để kiểm tra request từ React

    if (!body.text || !body.targetLanguage) {
      throw new BadRequestException('Missing text or targetLanguage');
    }

    const translatedText = await this.translateService.translateText(
      body.text,
      body.targetLanguage,
    );
    return { translatedText };
  }
}
