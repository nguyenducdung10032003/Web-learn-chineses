import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { AuthGuard } from '@nestjs/passport';
import { OptionalJwtAuthGuard } from '../auth/jwt-auth.guard';
import { RecordStudyDto } from './dto/record-study.dto';
import { Request } from '@nestjs/common';

@Controller('decks')
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req: any, @Body() dto: CreateDeckDto) {
    return this.decksService.createDeck(req.user.id, dto);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  findAll(@Req() req: any) {
    const userId = req.user?.id;
    return this.decksService.findAll(userId ?? 0);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('record-study')
  async recordStudy(@Req() req: any, @Body() dto: RecordStudyDto) {
    const userId = req.user?.id;
    return this.decksService.recordStudy(userId, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.decksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeckDto: UpdateDeckDto) {
    return this.decksService.update(+id, updateDeckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.decksService.remove(+id);
  }
}
