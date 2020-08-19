import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Logger, warn } from '../../../../common/src';

interface RequestOptions {
    observe: 'response';
    withCredentials: boolean;
    responseType: 'json';
}
const logger = Logger.getLogger('AdminConfigService');

@Injectable()
export class AdminConfigService {
    private static readonly ADDRESS = 'http://localhost:3000';
    private static readonly AUTHENTICATION_PATH = '/admin/authentication/';
    private static readonly REQUEST_OPTIONS: RequestOptions = {
        observe: 'response',
        withCredentials: true,
        responseType: 'json'
    };

    constructor(private http: HttpClient) { }

    private isStatusOk(status: number) {
        return status >= 200 && status < 400;
    }

    private isResponseOk<R extends {ok: boolean}>(promise: Promise<R>): Promise<boolean> {
        return promise.then((response: R) => response.ok)
        .catch((reason: HttpErrorResponse) => this.isStatusOk(reason.status))
        .catch(warn(logger, false));
    }

    public isLoggedIn(): Promise<boolean> {
        const URL = AdminConfigService.ADDRESS + AdminConfigService.AUTHENTICATION_PATH;
        const RESPONSE = this.http.get(URL, AdminConfigService.REQUEST_OPTIONS);
        return this.isResponseOk(RESPONSE.toPromise());
    }

    public login(password: string): Promise<boolean> {
        const URL = AdminConfigService.ADDRESS + AdminConfigService.AUTHENTICATION_PATH;
        const RESPONSE = this.http.post(URL, { password }, AdminConfigService.REQUEST_OPTIONS);
        return this.isResponseOk(RESPONSE.toPromise());
    }

    public changePassword(password: string, confirmation: string): Promise<boolean> {
        if (!password || password !== confirmation) {
            return Promise.resolve(false);
        }

        const URL = AdminConfigService.ADDRESS + AdminConfigService.AUTHENTICATION_PATH + 'password/';
        const RESPONSE = this.http.patch(URL, {password, confirmation}, AdminConfigService.REQUEST_OPTIONS);
        return this.isResponseOk(RESPONSE.toPromise());
    }
}
