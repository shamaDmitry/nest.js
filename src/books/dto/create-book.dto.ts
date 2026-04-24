import { IsInt, IsNotEmpty, IsString, Min, Max } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  publishedYear: number;
}
