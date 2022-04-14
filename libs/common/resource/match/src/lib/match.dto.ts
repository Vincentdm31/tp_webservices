export interface MatchDto {
  id: string;
  date: string;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamScore: number;
  awayTeamScore: number;
}

// type with all properties from MatchDto, excluding id
export type MatchCreateDto = Omit<MatchDto, 'id'>;

// type with only id property from MatchDto + all properties as optional from MatchCreateDto
export type MatchUpdateDto = Pick<MatchDto, 'id'> & Partial<MatchCreateDto>;
export type MatchResetDto = MatchUpdateDto;
