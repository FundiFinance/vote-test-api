import {Entity, model, property} from '@loopback/repository';

@model()
export class ClaimEvent extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  user: string;

  @property({
    type: 'string',
    required: true,
  })
  ip: string;

  @property({
    type: 'string',
    required: true,
  })
  hash: string;

  constructor(data?: Partial<ClaimEvent>) {
    super(data);
  }
}

export interface ClaimEventRelations {
  // describe navigational properties here
}

export type ClaimEventWithRelations = ClaimEvent & ClaimEventRelations;
