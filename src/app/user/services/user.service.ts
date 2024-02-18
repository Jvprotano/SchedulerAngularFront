import { Observable } from "rxjs";
import { BaseService } from "../../services/base.service";
import { User } from "../models/user";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class UserService extends BaseService {

    constructor(private http: HttpClient) { super(http) }

    getProfile(): Observable<User> {
        return this.get('user', true);
    }

    updateUser(user: User): Observable<User> {
        return this.put('user', user, true);
    }
}