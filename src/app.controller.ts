import {
  Get,
  Body,
  Post,
  Query,
  UsePipes,
  Controller,
  ValidationPipe,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { AppService } from './app.service';
import { Question, FileType } from './app.types';
import { CreateQuestionDto } from './dto/create-question.dto';
import { OperationsInterceptor } from './interceptors/operations.interceptor';
import { FileTypeValidationPipe } from './pipes/file-type.validation.pipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('questions')
  @UsePipes(new FileTypeValidationPipe())
  @ApiQuery({
    name: 'type',
    description: 'The file type of questions',
    required: false,
  })
  @ApiResponse({
    status: 201,
    description: 'questions',
    type: [Question],
  })
  getQuestions(@Query('type') type?: FileType): Promise<Question[]> {
    return this.appService.getQuestions(type);
  }

  @Post('questions')
  @UseInterceptors(OperationsInterceptor)
  @ApiOperation({ summary: 'Create question' })
  @ApiBody({ type: CreateQuestionDto })
  @ApiResponse({ status: 201, description: 'operation status' })
  @HttpCode(201)
  createQuestion(@Body(ValidationPipe) createQuestionDto: CreateQuestionDto) {
    return this.appService.createQuestion(createQuestionDto);
  }
}
