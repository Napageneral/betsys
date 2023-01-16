export class Player {
    PlayerID: number;
    FirstName: string;
    LastName: string;
    SSN: string;
    HomeAddress: string;
    SecurityQuestions?: any;

    constructor(PlayerID: number,
                FirstName: string,
                LastName: string,
                SSN: string,
                HomeAddress: string,
                SecurityQuestions?: any) {
        this.PlayerID = PlayerID;
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.SSN = SSN;
        this.HomeAddress = HomeAddress;
        this.SecurityQuestions = SecurityQuestions;
    }
}

export interface CreatePlayerRequest {
    FirstName: string;
    LastName: string;
    SSN: string;
    HomeAddress: string;
}

export interface CreatePlayerResponse {
    Player: Player;
}

export interface RemovePlayerRequest {
    PlayerID: number
}

export interface RemovePlayerResponse {
}

export interface GetPlayerRequest {
    PlayerID: number;
}

export interface GetPlayerResponse {
    Player: Player;
}

export interface ListPlayersRequest {
}

export interface ListPlayersResponse {
    Players: Array<Player>;
}

export interface UpdatePlayerRequest {
    PlayerID: number;
    Player: Player;
}

export interface UpdatePlayerResponse {
    Player: Player;
}
