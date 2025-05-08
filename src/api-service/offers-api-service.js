import {HttpRoute} from '../api.js';
import ApiService from '../framework/api-service.js';

export default class OffersApiService extends ApiService {
  get offers() {
    return this._load({url: `${HttpRoute.OFFERS}`})
      .then(ApiService.parseResponse);
  }
}
