
import moment from 'moment';
import { Observable, of } from 'rxjs';
import { map, switchMap, startWith,tap } from 'rxjs/operators'
import React, { useState, useEffect, Dispatch, SetStateAction, useContext} from 'react';
import { LoginSessionContext, ServiceContext } from '../AppContext';


export const useService = (serviceKey:string): any => {
    const serviceContext = useContext(ServiceContext);

    return serviceContext.services.get(serviceKey);

}

export const useAppContext = (): any => {
    return useContext(LoginSessionContext);
}
