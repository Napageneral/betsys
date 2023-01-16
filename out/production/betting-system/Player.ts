export class Player {
    PlayerID: string;
    FirstName: string;
    LastName: string;
    SSN: string;
    HomeAddress: string;
    SecurityQuestions?: any;

    constructor(PlayerID: string,
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