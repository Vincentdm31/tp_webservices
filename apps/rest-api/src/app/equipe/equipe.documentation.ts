import {
  EquipeCreateDto,
  EquipeDto,
  EquipeResetDto,
  EquipeUpdateDto,
} from '@rendu-tp0/common/resource/equipe';
import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';

export const equipeExample: EquipeDto = {
  id: '6214c0f2857cfb3569c19166',
  teamName: `Toulouse`,
};

export class ApiEquipeDto implements EquipeDto {
  @ApiProperty({ example: equipeExample.id }) id: string;
  @ApiProperty({ example: equipeExample.teamName }) teamName: string;
}

export class ApiEquipeCreateDto
  extends OmitType(ApiEquipeDto, ['id'])
  implements EquipeCreateDto {}
export class ApiEquipeUpdateDto
  extends IntersectionType(
    PickType(ApiEquipeDto, ['id']),
    PartialType(ApiEquipeCreateDto)
  )
  implements EquipeUpdateDto {}
export class ApiEquipeResetDto
  extends ApiEquipeUpdateDto
  implements EquipeResetDto {}
