import stampit from 'stampit';
import {Meta, Model} from './base';
import {BaseQuerySet, List} from '../querySet';

const DailyUsageQuerySet = stampit().compose(
  BaseQuerySet,
  List
);

const DailyUsageMeta = Meta({
  name: 'dailyusage',
  pluralName: 'dailyusages',
  endpoints: {
    'list': {
      'methods': ['get'],
      'path': '/v1.1/usage/daily/'
    }
  }
});
/**
 * OO wrapper around DailyUsage.
 * @constructor
 * @type {DailyUsage}
 */
const DailyUsage = stampit()
  .compose(Model)
  .setQuerySet(DailyUsageQuerySet)
  .setMeta(DailyUsageMeta);

export default DailyUsage;
