import { MatchService } from '@rendu-tp0/api/match-service';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { MatchDto } from '@rendu-tp0/common/resource/match';
import { MatchType } from './match.type';

@Resolver(() => MatchType)
export class MatchResolver {
  constructor(private matchService: MatchService) {}

  @Query(() => MatchType)
  match(@Args('id') id: string): Promise<MatchDto> {
    return this.matchService.findOne(id);
  }
}
