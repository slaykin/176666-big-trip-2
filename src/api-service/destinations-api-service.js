import {HttpRoute} from '../api.js';
import ApiService from '../framework/api-service.js';

export default class DestinationsApiService extends ApiService {
  get destinations() {
    return this._load({url: `${HttpRoute.DESTINATION}`})
      .then(ApiService.parseResponse);
  }
}
