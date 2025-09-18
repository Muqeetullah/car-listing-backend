import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        cars: true, // include cars under each category
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { cars: true },
    });
  }

  async create(userId: string, dto: { name: string }) {
    return this.prisma.category.create({
      data: { name: dto.name, userId },
    });
  }

  async update(userId: string, id: string, dto: { name: string }) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    if (category.userId !== userId)
      throw new ForbiddenException('You cannot update this category');

    return this.prisma.category.update({
      where: { id },
      data: { name: dto.name },
    });
  }

  async remove(userId: string, id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    if (category.userId !== userId)
      throw new ForbiddenException('You cannot delete this category');

    return this.prisma.category.delete({ where: { id } });
  }
}
