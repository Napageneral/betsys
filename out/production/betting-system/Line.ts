export class Line {
    player:string;
    bookie:string;
    sport:string;
    event:string;
    market:string;
    bet:string;
    odds:string;

    constructor(player:string,
                bookie:string,
                sport:string,
                event:string,
                market:string,
                bet:string,
                odds:string) {
        this.player = player;
        this.bookie = bookie;
        this.sport = sport;
        this.event = event;
        this.market = market;
        this.bet = bet;
        this.odds = odds;
    }
}