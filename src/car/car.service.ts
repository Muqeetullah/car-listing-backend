import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { CreateCarDto, UpdateCarDto } from './dto/car.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CarService {
  constructor(private prisma: PrismaService) {}

  private async ensureCategoryOwnership(userId: string, categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) throw new NotFoundException('Category not found');
    if (category.userId !== userId)
      throw new ForbiddenException('Access denied');
    return category;
  }

  private async ensureCarOwnership(userId: string, carId: string) {
    const car = await this.prisma.car.findUnique({ where: { id: carId } });
    if (!car) throw new NotFoundException('Car not found');
    await this.ensureCategoryOwnership(userId, car.categoryId);
    return car;
  }

  async create(userId: string, dto: CreateCarDto) {
    await this.ensureCategoryOwnership(userId, dto.categoryId);
    return this.prisma.car.create({
      data: {
        make: dto.make,
        model: dto.model,
        year: dto.year,
        categoryId: dto.categoryId,
      },
    });
  }

  async findAllByCategory(userId: string, categoryId: string) {
    await this.ensureCategoryOwnership(userId, categoryId);
    return this.prisma.car.findMany({
      where: { categoryId },
    });
  }

  async findOne(userId: string, carId: string) {
    return this.ensureCarOwnership(userId, carId);
  }

  async update(userId: string, carId: string, dto: UpdateCarDto) {
    const car = await this.ensureCarOwnership(userId, carId);
    return this.prisma.car.update({
      where: { id: car.id },
      data: {
        make: dto.make ?? car.make,
        model: dto.model ?? car.model,
        year: dto.year ?? car.year,
      },
    });
  }

  async remove(userId: string, carId: string) {
    const car = await this.ensureCarOwnership(userId, carId);
    return this.prisma.car.delete({ where: { id: car.id } });
  }
}
