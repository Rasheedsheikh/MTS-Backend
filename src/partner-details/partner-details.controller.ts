import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PartnerDetailsService } from './partner-details.service';
import { CreatePartnerDetailDto } from './dto/create-partner-detail.dto';
import { UpdatePartnerDetailDto } from './dto/update-partner-detail.dto';

@Controller('partner-details')
export class PartnerDetailsController {
	constructor(private readonly service: PartnerDetailsService) {}

	@Post()
	create(@Body() dto: CreatePartnerDetailDto) {
		return this.service.create(dto);
	}

	@Get()
	findAll() {
		return this.service.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.service.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() dto: UpdatePartnerDetailDto) {
		return this.service.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.service.remove(id);
	}
}


