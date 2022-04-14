export interface EquipeDto {
  id: string;
  teamName: string;
}

// type with all properties from EquipeDto, excluding id
export type EquipeCreateDto = Omit<EquipeDto, 'id'>;

// type with only id property from EquipeDto + all properties as optional from EquipeCreateDto
export type EquipeUpdateDto = Pick<EquipeDto, 'id'> & Partial<EquipeCreateDto>;
export type EquipeResetDto = EquipeUpdateDto;
