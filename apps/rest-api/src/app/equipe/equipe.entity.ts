import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'equipes' })
export class EquipeEntity {
  @Prop({ required: true }) teamName: string;
}

export type EquipeEntityWithId = EquipeEntity & Pick<Document, 'id'>;
export type EquipeDocument = EquipeEntity & Document;
export const EquipeSchema = SchemaFactory.createForClass(EquipeEntity);
