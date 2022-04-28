import { IsObjectId } from '@rendu-tp0/api/validation/id';
import {
  EquipeCreateDto,
  EquipeDto,
  EquipeResetDto,
  EquipeUpdateDto,
} from '@rendu-tp0/common/resource/equipe';
import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class EquipeValidationDto implements EquipeDto {
  @IsObjectId() id: string;
  @IsString() teamName: string;
}

export class EquipeCreateValidationDto
  extends OmitType(EquipeValidationDto, ['id'])
  implements EquipeCreateDto {}
export class EquipeUpdateValidationDto
  extends IntersectionType(
    PickType(EquipeValidationDto, ['id']),
    PartialType(EquipeCreateValidationDto)
  )
  implements EquipeUpdateDto {}
export class EquipeResetValidationDto
  extends EquipeUpdateValidationDto
  implements EquipeResetDto {}
