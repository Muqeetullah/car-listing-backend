import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CarService } from './car.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCarDto, UpdateCarDto } from './dto/car.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('car')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateCarDto) {
    return this.carService.create(req.user.userId, dto);
  }

  @Get(':categoryId')
  findAllByCategory(@Req() req: any, @Param('categoryId') categoryId: string) {
    return this.carService.findAllByCategory(req.user.userId, categoryId);
  }

  @Get('car-by-id/:id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.carService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateCarDto) {
    return this.carService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.carService.remove(req.user.userId, id);
  }
}
