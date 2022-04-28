import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'matchs' })
export class MatchEntity {
  @Prop({ required: true, type: Date }) date: Date;
  @Prop() homeTeamName: string;
  @Prop() awayTeamName: string;
  @Prop() homeTeamScore: number;
  @Prop() awayTeamScore: number;
  @Prop() externalId: number;
}

export type MatchEntityWithId = MatchEntity & Pick<Document, 'id'>;
export type MatchDocument = MatchEntity & Document;
export const MatchSchema = SchemaFactory.createForClass(MatchEntity);
