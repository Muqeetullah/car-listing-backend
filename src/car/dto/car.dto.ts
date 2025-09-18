import { IsNotEmpty, IsString, IsInt, Min, Matches } from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsInt()
  @Min(1900)
  year: number;

  @IsString()
  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'Invalid MongoDB ObjectId' })
  categoryId: string;
}

export class UpdateCarDto {
  @IsString()
  make?: string;

  @IsString()
  model?: string;

  @IsInt()
  @Min(1900)
  year?: number;
}
