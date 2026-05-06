import { IsArray, IsNumber } from 'class-validator';

export class DeleteBooksDto {
  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];
}
