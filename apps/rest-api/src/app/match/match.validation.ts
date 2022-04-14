import { IsObjectId } from '@rendu-tp0/api/validation/id';
import {
  MatchCreateDto,
  MatchDto,
  MatchResetDto,
  MatchUpdateDto,
} from '@rendu-tp0/common/resource/match';
import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/mapped-types';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class MatchValidationDto implements MatchDto {
  @IsObjectId() id: string;
  @IsDateString() date: string;
  @IsString() homeTeamName: string;
  @IsString() awayTeamName: string;
  @IsInt() @Min(0) homeTeamScore: number;
  @IsInt() @Min(0) awayTeamScore: number;
}

export class MatchCreateValidationDto
  extends OmitType(MatchValidationDto, ['id'])
  implements MatchCreateDto {}
export class MatchUpdateValidationDto
  extends IntersectionType(
    PickType(MatchValidationDto, ['id']),
    PartialType(MatchCreateValidationDto)
  )
  implements MatchUpdateDto {}
export class MatchResetValidationDto
  extends MatchUpdateValidationDto
  implements MatchResetDto {}
