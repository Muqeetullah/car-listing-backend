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
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateCategoryDto) {
    return this.categoryService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.categoryService.remove(req.user.userId, id);
  }
}
