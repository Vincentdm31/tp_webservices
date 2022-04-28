import { Field, ObjectType } from '@nestjs/graphql';
import { MatchDto } from '@rendu-tp0/common/resource/match';

@ObjectType()
export class MatchType implements MatchDto {
  @Field() id: string;
  @Field() homeTeamName: string;
  @Field() awayTeamName: string;

  @Field({ nullable: true })
  homeTeamScore: number;

  @Field({ nullable: true })
  awayTeamScore: number;

  @Field() externalId: number;

  @Field()
  date: string;
}
