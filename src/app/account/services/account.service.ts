import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/user";
import { BaseService } from "../../services/base.service";
import { Observable, catchError, map } from "rxjs";

@Injectable()
export class AccountService extends BaseService {
    constructor(private http: HttpClient) { super() }

    registerUser(user: User): Observable<User> {
        let response = this.http.post(this.UrlServiceV1 + 'register', user, this.GetHeaderJson())
            .pipe(
                map(this.extractData),
                catchError((error: any) => {
                    this.serviceError(error);
                    return error(error);
                })
            );

        return response;
    }

    login(user: User) {

    }
}