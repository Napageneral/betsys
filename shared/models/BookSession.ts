import {LoginInfo} from "./LoginInfo";
import {Player} from "./Player";
import { Line } from "./Line";
import {BookEngine} from "../../server/src/bookEngines/BookEngine";

export class BookSession {
    BookName: string;
    CreationTime: Date;
    PlayerID?: number;
    BookEngine?: BookEngine;

    constructor(BookName: string) {
        this.BookName = BookName;
        this.CreationTime = new Date();
    }
}

export interface StartSessionRequest {
    BookName: string;
    LogIn: boolean;
    PlayerID?: number;
    LoginInfo?: LoginInfo;
}

export interface StartSessionResponse {
}

export interface EndBookSessionRequest {
    BookName: string;
    PlayerID?: number;
}

export interface EndBookSessionResponse {
}

export interface EndBookSessionsRequest {
    PlayerID?: number;
    BookName?: string;
}

export interface EndBookSessionsResponse {
}

export interface ListBookSessionsRequest {
    PlayerID?: number;
    BookName?: string;
}

export interface ListBookSessionsResponse {
    BookSessions: Array<BookSession>;
}

export interface GetBookSessionRequest {
    BookName: string;
    PlayerID?: number;
}

export interface GetBookSessionResponse {
    BookSession: BookSession;
}


export interface CreateAccountRequest {
    BookName: string;
    Player: Player;
    LoginInfo: LoginInfo;
}

export interface CreateAccountResponse {
}

export interface ScrapeLinesRequest {
    BookName: string;
    Sport?: string;
}

export interface ScrapeLinesResponse {
}

export interface PlaceBetRequest {
    PlayerID: number;
    BookName: string;
    Line: Line;
    StakeAmount: number;
}

export interface PlaceBetResponse {
}