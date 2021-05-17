import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {FundiDataSource} from '../datasources';
import {ClaimEvent, ClaimEventRelations} from '../models';

export class ClaimEventRepository extends DefaultCrudRepository<
  ClaimEvent,
  typeof ClaimEvent.prototype.id,
  ClaimEventRelations
> {
  constructor(
    @inject('datasources.fundi') dataSource: FundiDataSource,
  ) {
    super(ClaimEvent, dataSource);
  }
}
