import { IsObjectIdPipe } from '@rendu-tp0/api/validation/id';
import {
  EquipeDto,
  resourceEquipePath,
} from '@rendu-tp0/common/resource/equipe';
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
  ApiEquipeCreateDto,
  ApiEquipeDto,
  ApiEquipeResetDto,
  ApiEquipeUpdateDto,
  equipeExample,
} from './equipe.documentation';
import { EquipeService } from './equipe.service';
import {
  EquipeCreateValidationDto,
  EquipeResetValidationDto,
  EquipeUpdateValidationDto,
} from './equipe.validation';
import {IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength} from 'class-validator';
import { Type as TypeTransformer } from 'class-transformer';
import { CacheInterceptor, UseInterceptors } from '@nestjs/common';

export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface PostParams {
  teamName?: string;
}

export class PostParamsValidation implements PostParams {
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  teamName?: string;
}

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

@ApiTags(resourceEquipePath)
@Controller(resourceEquipePath)
export class EquipeController {
  constructor(private readonly equipeService: EquipeService) {}

  @Post()
  @ApiBody({ type: ApiEquipeCreateDto })
  @ApiCreatedResponse({ type: ApiEquipeDto })
  @ApiBadRequestResponse()
  @UseInterceptors(CacheInterceptor)
  create(@Body(new ValidationPipe({
    transform: true,
    expectedType: PostParamsValidation,
  })) dto: EquipeCreateValidationDto): Promise<EquipeDto> {
    return this.equipeService.create(dto);
  }

  @ApiQuery({ name: 'page', type: 'integer', example: 1 })
  @ApiQuery({ name: 'size', type: 'integer', example: 10 })
  @UseInterceptors(CacheInterceptor)
  @Get()
  @ApiOkResponse({ type: [ApiEquipeDto] })
  findAll(
    @Query(
      new ValidationPipe({
        transform: true,
        expectedType: PaginationParamsValidation,
      })
    )
    paginationParams: PaginationParams
  ): Promise<EquipeDto[]> {
    return this.equipeService.findAll(paginationParams);
  }

  @Get(':id')
  @ApiParam({ name: 'id', example: equipeExample.id })
  @ApiOkResponse({ type: ApiEquipeDto })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @UseInterceptors(CacheInterceptor)
  findOne(@Param('id', IsObjectIdPipe) id: string): Promise<EquipeDto> {
    return this.equipeService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', example: equipeExample.id })
  @ApiBody({ type: ApiEquipeUpdateDto })
  @ApiOkResponse({ type: ApiEquipeDto })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @UseInterceptors(CacheInterceptor)
  update(
    @Param('id', IsObjectIdPipe) id: string,
    @Body(new ValidationPipe({
      transform: true,
      expectedType: PostParamsValidation,
    })) dto: EquipeUpdateValidationDto
  ): Promise<EquipeDto> {
    return this.equipeService.update({ ...dto, id });
  }

  @Put(':id')
  @ApiParam({ name: 'id', example: equipeExample.id })
  @ApiBody({ type: ApiEquipeResetDto })
  @ApiOkResponse({ type: ApiEquipeDto })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @UseInterceptors(CacheInterceptor)
  reset(
    @Param('id', IsObjectIdPipe) id: string,
    @Body() dto: EquipeResetValidationDto
  ): Promise<EquipeDto> {
    return this.equipeService.reset({ ...dto, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', example: equipeExample.id })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @UseInterceptors(CacheInterceptor)
  remove(@Param('id', IsObjectIdPipe) id: string): Promise<void> {
    return this.equipeService.remove(id);
  }
}

