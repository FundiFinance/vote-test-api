import {inject} from '@loopback/core';
import {
  get,

  param, post, Request,


  response,
  ResponseObject, RestBindings
} from '@loopback/rest';
import {ClaimService} from '../services';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject('services.ClaimService') private claimService: ClaimService
  ) {}

  // Map to `GET /ping`
  @get('/ping')
  @response(200, PING_RESPONSE)
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @post('/claim/{user}')
  async claimToken(@param.path.string('user') user: string): Promise<object> {
    const res = await this.claimService.claimToken(user, this.req.headers['x-real-ip'] || this.req.connection.remoteAddress || '');
    return res;
  }
}
