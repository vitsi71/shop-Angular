import {ActiveParamsType} from '../../../types/active-params.type';
import {Params} from '@angular/router';

export class ActiveParamsUtil {
  static processParams(params:Params):ActiveParamsType{
    const activeParams: ActiveParamsType = {types: []};

    if (params.hasOwnProperty('types')) { //hasOwnProperty - проверка на наличие свойства
      activeParams.types = Array.isArray(params['types']) ? params['types'] : [params['types']];
    }
    if (params.hasOwnProperty('heightTo')) { //hasOwnProperty - проверка на наличие свойства
      activeParams.heightTo = + params['heightTo'];
    }
    if (params.hasOwnProperty('heightFrom')) { //hasOwnProperty - проверка на наличие свойства
      activeParams.heightFrom = + params['heightFrom'];
    }
    if (params.hasOwnProperty('diameterTo')) { //hasOwnProperty - проверка на наличие свойства
      activeParams.diameterTo = + params['diameterTo'];
    }
    if (params.hasOwnProperty('diameterFrom')) { //hasOwnProperty - проверка на наличие свойства
      activeParams.diameterFrom = + params['diameterFrom'];
    }
    if (params.hasOwnProperty('page')) { //hasOwnProperty - проверка на наличие свойства
      activeParams.page = + params['page'];
    }
    if (params.hasOwnProperty('sort')) { //hasOwnProperty - проверка на наличие свойства
      activeParams.sort = params['sort'];
    }
    return activeParams;
  }
}
