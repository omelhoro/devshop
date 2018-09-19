import * as _ from 'lodash';
import urlJoin from 'url-join';
import * as vars from './vars';

const url: (...path: string[]) => string = _.partial(urlJoin, vars.BACKEND_ENDPOINT, 'api');
export default url;
