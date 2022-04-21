import {
  MatchCreateDto,
  MatchDto,
  MatchResetDto,
  MatchUpdateDto,
} from '@rendu-tp0/common/resource/match';
import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';

export const matchExample: MatchDto = {
  id: '6214c0f2857cfb3569c19166',
  date: '2022-03-08T21:00:00.000+01:00',
  homeTeamName: 'Liverpool',
  awayTeamName: 'Inter Milan',
  homeTeamScore: 0,
  awayTeamScore: 1,
  externalId: 4525252352352,
};

export class ApiMatchDto implements MatchDto {
  @ApiProperty({ example: matchExample.id }) id: string;
  @ApiProperty({ example: matchExample.date, format: 'date-time' })
  date: string;
  @ApiProperty({ example: matchExample.homeTeamName }) homeTeamName: string;
  @ApiProperty({ example: matchExample.awayTeamName }) awayTeamName: string;
  @ApiProperty({
    example: matchExample.homeTeamScore,
    type: 'integer',
    minimum: 0,
  })
  homeTeamScore: number;
  @ApiProperty({
    example: matchExample.awayTeamScore,
    type: 'integer',
    minimum: 0,
  })
  awayTeamScore: number;
  externalId: number;
}

export class ApiMatchCreateDto
  extends OmitType(ApiMatchDto, ['id'])
  implements MatchCreateDto {}
export class ApiMatchUpdateDto
  extends IntersectionType(
    PickType(ApiMatchDto, ['id']),
    PartialType(ApiMatchCreateDto)
  )
  implements MatchUpdateDto {}
export class ApiMatchResetDto
  extends ApiMatchUpdateDto
  implements MatchResetDto {}
