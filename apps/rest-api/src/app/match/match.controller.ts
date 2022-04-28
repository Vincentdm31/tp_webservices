import { IsObjectIdPipe } from '@rendu-tp0/api/validation/id';
import { MatchDto, resourceMatchPath } from '@rendu-tp0/common/resource/match';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiMatchCreateDto,
  ApiMatchDto,
  ApiMatchResetDto,
  ApiMatchUpdateDto,
  matchExample,
} from './match.documentation';
import {
  MatchCreateValidationDto,
  MatchResetValidationDto,
  MatchUpdateValidationDto,
} from './match.validation';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type as TypeTransformer } from 'class-transformer';
import { CacheInterceptor, UseInterceptors } from '@nestjs/common';
import { MatchService } from '@rendu-tp0/api/match-service';
import { PaginationParams } from '../equipe/equipe.controller';
import { FilterParams } from '@rendu-tp0/api/database';

export class PaginationParamsValidation implements PaginationParams {
  @IsOptional()
  @TypeTransformer(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number;

  @IsOptional()
  @TypeTransformer(() => Number)
  @IsInt()
  @Min(1)
  page?: number;
}

export interface PostParams {
  date?: string;
  homeTeamName?: string;
  awayTeamName?: string;
  homeTeamScore?: number;
  awayTeamScore?: number;
}

export class PostParamsValidation implements PostParams {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  date?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(30)
  homeTeamName?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(30)
  awayTeamName?: string;

  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(100)
  homeTeamScore?: number;

  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(100)
  awayTeamScore?: number;
}

export class FilterParamsValidation implements FilterParams {
  @IsOptional()
  @IsString()
  team?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  homeTeamName: string;

  @IsOptional()
  @IsString()
  awayTeamName: string;
}

@ApiTags(resourceMatchPath)
@Controller(resourceMatchPath)
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  @ApiBody({ type: ApiMatchCreateDto })
  @ApiCreatedResponse({ type: ApiMatchDto })
  @ApiBadRequestResponse()
  @UseInterceptors(CacheInterceptor)
  create(
    @Body(
      new ValidationPipe({
        transform: true,
        expectedType: PostParamsValidation,
      })
    )
    dto: MatchCreateValidationDto
  ): Promise<MatchDto> {
    return this.matchService.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'page', type: 'integer', example: 1 })
  @ApiQuery({ name: 'size', type: 'integer', example: 10 })
  @ApiOkResponse({ type: [ApiMatchDto] })
  @UseInterceptors(CacheInterceptor)
  findAll(
    @Query(
      new ValidationPipe({
        transform: true,
        expectedType: PaginationParamsValidation,
      })
    )
    paginationParams: PaginationParams,
    @Query(
      new ValidationPipe({
        transform: true,
        expectedType: PaginationParamsValidation,
      })
    )
    filterParams: FilterParams
  ): Promise<MatchDto[]> {
    return this.matchService.findAll(paginationParams, filterParams);
  }

  @Get(':id')
  @ApiParam({ name: 'id', example: matchExample.id })
  @ApiOkResponse({ type: ApiMatchDto })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @UseInterceptors(CacheInterceptor)
  findOne(@Param('id', IsObjectIdPipe) id: string): Promise<MatchDto> {
    return this.matchService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', example: matchExample.id })
  @ApiBody({ type: ApiMatchUpdateDto })
  @ApiOkResponse({ type: ApiMatchDto })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @UseInterceptors(CacheInterceptor)
  update(
    @Param('id', IsObjectIdPipe) id: string,
    @Body(
      new ValidationPipe({
        transform: true,
        expectedType: PostParamsValidation,
      })
    )
    dto: MatchUpdateValidationDto
  ): Promise<MatchDto> {
    return this.matchService.update({ ...dto, id });
  }

  @Put(':id')
  @ApiParam({ name: 'id', example: matchExample.id })
  @ApiBody({ type: ApiMatchResetDto })
  @ApiOkResponse({ type: ApiMatchDto })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @UseInterceptors(CacheInterceptor)
  reset(
    @Param('id', IsObjectIdPipe) id: string,
    @Body() dto: MatchResetValidationDto
  ): Promise<MatchDto> {
    return this.matchService.reset({ ...dto, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', example: matchExample.id })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @UseInterceptors(CacheInterceptor)
  remove(@Param('id', IsObjectIdPipe) id: string): Promise<void> {
    return this.matchService.remove(id);
  }

  @Get('/refresh/fetch')
  fetchMatches() {
    return this.matchService.getLastDates();
  }
}
