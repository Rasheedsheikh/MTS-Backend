import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DigitalMarketingService } from './digital-marketing.service';
import { CreateDigitalMarketingDto } from './dto/create-digital-marketing.dto';
import { UpdateDigitalMarketingDto } from './dto/update-digital-marketing.dto';

@Controller('digital-marketing')
export class DigitalMarketingController {
  constructor(private readonly digitalMarketingService: DigitalMarketingService) {}

  @Post()
  create(@Body() dto: CreateDigitalMarketingDto) {
    return this.digitalMarketingService.create(dto);
  }

  @Get()
  findAll() {
    return this.digitalMarketingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.digitalMarketingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDigitalMarketingDto) {
    return this.digitalMarketingService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.digitalMarketingService.remove(id);
  }
}
