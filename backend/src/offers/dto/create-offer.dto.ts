import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOfferDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  offer!: number;
}
