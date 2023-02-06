import {Game} from "../../../shared/models/Game";
import {BetType, buildMegKey, MutuallyExclusiveGroup} from "../../../shared/models/MutuallyExclusiveGroup";
import {Prop} from "../../../shared/models/Prop";
import {Odd} from "../../../shared/models/Odd";
import {getStoredProps, upsertAllProps} from "../controllers/Prop";
import {addAllMegs, getNextMegID, getStoredMegs} from "../controllers/MutuallyExclusiveGroup";
import {addAllOdds} from "../controllers/Odd";
import {ComputedProp} from "../models/ComputedProp";
import {round} from "../util/util";
import {ProfitableBet} from "../../../shared/models/ProfitableBet";
import {addProfitableBets} from "../controllers/ProfitableBet";

export class BetBatch {
    games: Map<string, Game> = new Map<string, Game>()

    gamesToMegs: Map<string, Map<number, MutuallyExclusiveGroup>> = new Map<string, Map<number, MutuallyExclusiveGroup>>();
    megsToProps: Map<number, Map<string, Prop>> = new Map<number, Map<string, Prop>>();
    propsToOdds: Map<string, Map<string, Odd>> = new Map<string, Map<string, Odd>>();

    storedProps: Map<string, Prop> = new Map<string, Prop>();
    storedMegs: Map<string, MutuallyExclusiveGroup> = new Map<string, MutuallyExclusiveGroup>();

    nextMegID: number = -1;

    newMegs: Map<string, MutuallyExclusiveGroup> = new Map<string, MutuallyExclusiveGroup>();
    newProps: Map<string, Prop> = new Map<string, Prop>();

    constructor(storedGames: Game[], index: number, batchSize: number) {
        for (let j = 0; j < batchSize; j++) {
            const batchIndex = index+j;
            if (batchIndex < storedGames.length){
                this.games.set(storedGames[batchIndex].GameID, storedGames[batchIndex])
            }
        }
    }

    calculateAndSaveProfitableBets(){
        for (const gameId of this.gamesToMegs.keys()) {
            const game: Game | undefined = this.games.get(gameId)
            if (!game) continue

            const megMap = this.gamesToMegs.get(gameId)
            if (!megMap) continue
            const megs: MutuallyExclusiveGroup[] = [...megMap.values()]
            for (const meg of megs as MutuallyExclusiveGroup[]) {
                const propMap = this.megsToProps.get(meg.MutuallyExclusiveGroupID)
                if (!propMap || propMap.size!=2) continue
                const props: Prop[] = [...propMap.values()]
                const computedProps = []
                for (const prop of props as Prop[]) {
                    computedProps.push(this.computeProp(prop))
                }
                if (computedProps[0] && computedProps[1]){
                    const computedMeg: ProfitableBet[] = this.computeMeg(game, meg, props[0], props[1], computedProps[0], computedProps[1])
                    if (computedMeg.length > 0){
                        console.log(computedMeg)
                        console.log(props)
                        //addProfitableBets(computedMeg)
                    }
                }
            }
        }
    }

    computeMeg(game:Game, meg:MutuallyExclusiveGroup, prop1:Prop, prop2:Prop, computedProp1:ComputedProp, computedProp2:ComputedProp): ProfitableBet[]{
        const arbitrages = this.detectArbitrages(game, meg, prop1, prop2, computedProp1.SortedOdds, computedProp2.SortedOdds)

        const meanMarketWidth = this.calculateMarketWidth(computedProp1.MeanPrice, computedProp2.MeanPrice)
        const meanNoVigOdds = this.calculateNoVigOdds(computedProp1.MeanPrice, computedProp2.MeanPrice)

        let pevs1 = undefined
        let pevs2 = undefined
        let pinnacleMarketWidth = undefined
        let pinnacleNoVigOdds = undefined
        if (computedProp1.PinnaclePrice && computedProp2.PinnaclePrice){
            pinnacleMarketWidth = this.calculateMarketWidth(computedProp1.PinnaclePrice, computedProp2.PinnaclePrice)
            pinnacleNoVigOdds = this.calculateNoVigOdds(computedProp1.PinnaclePrice, computedProp2.PinnaclePrice)

            pevs1 = this.detectPositiveEV(game, meg, prop1, computedProp1.SortedOdds, pinnacleNoVigOdds.NoVigPrice1, pinnacleMarketWidth)
            pevs2 = this.detectPositiveEV(game, meg, prop2, computedProp2.SortedOdds, pinnacleNoVigOdds.NoVigPrice2, pinnacleMarketWidth)
        } else {

            pevs1 = this.detectPositiveEV(game, meg, prop1, computedProp1.SortedOdds, meanNoVigOdds.NoVigPrice1, meanMarketWidth)
            pevs2 = this.detectPositiveEV(game, meg, prop2, computedProp2.SortedOdds, meanNoVigOdds.NoVigPrice2, meanMarketWidth)
        }

        return [...arbitrages, ...pevs1, ...pevs2]
    }

    detectPositiveEV(game: Game, meg:MutuallyExclusiveGroup, prop:Prop, odds: Odd[], fairPrice: number, marketWidth: number){
        const pEVBets:ProfitableBet[] = [];

        for (const odd of odds) {
            if (odd.Price > fairPrice){
                const eventName = game.HomeTeam + " vs " + game.AwayTeam
                const ev = round(this.calculateExpectedValue(this.americanOddsToImpliedProb(fairPrice), odd.Price),2)
                const pBet = new ProfitableBet(
                    0,
                    game.GameID,
                    game.StartDate,
                    eventName,
                    game.Sport,
                    meg.MutuallyExclusiveGroupID,
                    meg.Market,
                    [prop.PropID],
                    [prop.PropName],
                    [odd.OddID],
                    [odd.Price],
                    [odd.BookName],
                    ev,
                    'PositiveEV',
                    odd.RetrievalTimestamp,
                    round(marketWidth,2),
                    [fairPrice])
                pEVBets.push(pBet)
            } else {
                break;
            }
        }

        return pEVBets;
    }

    calculateExpectedValue(fairWinProb: number, winOdds: number){
        return (fairWinProb * this.calculatePayout(winOdds, 100)) - ((1-fairWinProb)*100)
    }

    calculatePayout(price: number, stake: number){
        if (price < 0){
            return stake / (-1 * price / 100)
        } else {
            return stake * price / 100
        }
    }

    detectArbitrages(game: Game, meg:MutuallyExclusiveGroup, prop1:Prop, prop2:Prop, odds1: Odd[], odds2: Odd[]){
        const arbitrages:ProfitableBet[] = []
        for (let i = 0; i < odds1.length; i++) {
            const odd1 = odds1[i]
            for (let j = 0; j < odds2.length; j++) {
                const odd2 = odds2[j]
                const ip1 = this.americanOddsToImpliedProb(odd1.Price)
                const ip2 = this.americanOddsToImpliedProb(odd2.Price)
                const totalImpliedProb = ip1 + ip2
                if (totalImpliedProb < 1){
                    const eventName = game.HomeTeam + " vs " + game.AwayTeam
                    const oldestTimestamp = new Date(Math.min(new Date(odd1.RetrievalTimestamp).getTime(), new Date(odd2.RetrievalTimestamp).getTime()))
                    const pBet = new ProfitableBet(
                        0,
                        game.GameID,
                        game.StartDate,
                        eventName,
                        game.Sport,
                        meg.MutuallyExclusiveGroupID,
                        meg.Market,
                        [prop1.PropID, prop2.PropID],
                        [prop1.PropName, prop2.PropName],
                        [odd1.OddID, odd2.OddID],
                        [odd1.Price, odd2.Price],
                        [odd1.BookName, odd2.BookName],
                        round((1-totalImpliedProb)*100,2),
                        'Arbitrage',
                        oldestTimestamp,
                        undefined,
                        undefined)
                    arbitrages.push(pBet)
                } else {
                    break;
                }
            }
        }
        return arbitrages
    }

    calculateNoVigOdds(price1: number, price2: number){
        const ip1 = this.americanOddsToImpliedProb(price1)
        const ip2 = this.americanOddsToImpliedProb(price2)
        const noVigPrice1 = round(this.impliedProbToAmericanOdds(ip1 / (ip1+ip2)),2)
        const noVigPrice2 = round(this.impliedProbToAmericanOdds(ip2 / (ip1+ip2)),2)
        return {
            NoVigPrice1: noVigPrice1,
            NoVigPrice2: noVigPrice2
        }
    }

    americanOddsToImpliedProb(americanPrice: number){
        if (americanPrice > 0){
            return 100 / (americanPrice + 100)
        } else {
            return (-1*(americanPrice)) / (-1*(americanPrice) + 100)
        }
    }

    americanOddsToDecimalOdds(americanPrice: number){
        if (americanPrice > 0){
            return (americanPrice/100)+1
        } else {
            return (100/americanPrice) + 1
        }
    }

    decimaltoAmericanOdds(decimalOdds: number){
        if (decimalOdds>=2){
            return (decimalOdds-1)*100
        } else {
            return (-100)/(decimalOdds-1)
        }
    }

    impliedProbToDecimalOdds(impliedProb: number){
        return 1/impliedProb;
    }

    impliedProbToAmericanOdds(impliedProb: number){
        return this.decimaltoAmericanOdds(this.impliedProbToDecimalOdds(impliedProb))
    }

    calculateMarketWidth(price1: number, price2: number){
        return Math.abs(this.normalizePriceForMarketWidth(price1) + this.normalizePriceForMarketWidth(price2))
    }

    normalizePriceForMarketWidth(price: number){
        if (price > 0){
            return price - 100
        } else {
            return price + 100
        }
    }

    computeProp(prop: Prop): ComputedProp|undefined {
        const oddMap = this.propsToOdds.get(prop.PropID)
        if (!oddMap) return undefined
        const odds: Odd[] = [...oddMap.values()]

        const pinnacleOdd = odds.find(function (element) {
            return element.BookName == "Pinnacle";
        })
        odds.sort(function(a,b) {return (a.Price > b.Price) ? 1 : ((b.Price > a.Price) ? -1 : 0);})

        const meanPrice = this.impliedProbToAmericanOdds(odds.reduce((acc, c) => acc + (this.americanOddsToImpliedProb(c.Price)/odds.length), 0));

        return{
            SortedOdds: odds,
            PinnaclePrice: pinnacleOdd?.Price,
            MeanPrice: meanPrice
        }
    }

    getGameIDs(){
        return Array.from(this.games.keys())
    }

    getAllOdds(){
        const odds = []
        for (const oddMap of this.propsToOdds.values()) {
            odds.push(...oddMap.values())
        }
        return odds
    }

    async getStoredData(){
        this.storedProps = await getStoredProps(this.getGameIDs())
        this.storedMegs = await getStoredMegs(this.getGameIDs())
        this.nextMegID = await getNextMegID()
        if (this.nextMegID == null) this.nextMegID = 1
    }

    getOrCreateMeg(gameID: string, market: string, betType: BetType, propActor: string, propPoints: number): MutuallyExclusiveGroup|undefined{
        const megKey = buildMegKey(gameID, market, betType, propPoints, propActor)
        let result = undefined;
        if (this.storedMegs.has(megKey)){
            result = this.storedMegs.get(megKey);
        } else if (this.newMegs.has(megKey)) {
            result = this.newMegs.get(megKey);
        } else {
            result = new MutuallyExclusiveGroup(this.nextMegID, gameID, market, betType, propActor, propPoints)
            this.newMegs.set(megKey, result)
            this.nextMegID += 1;
        }
        return result
    }

    createProp(gameID: string, propID:string, megID:number, market: string, propName: string, betInfo:any, propPoints: number): Prop{
        let prop = new Prop(gameID, propID, megID, market, propName, "unknown", betInfo.BetType, propPoints, betInfo.OverUnder, betInfo.PropActor);
        if (!this.storedProps.has(propID)){
            this.newProps.set(propID, prop)
        }
        return prop
    }

    addOdd(gameID:string, meg:MutuallyExclusiveGroup, prop:Prop, odd:Odd){
        if (!this.gamesToMegs.has(gameID)){
            this.gamesToMegs.set(gameID, new Map<number, MutuallyExclusiveGroup>())
        }
        this.gamesToMegs.get(gameID)?.set(meg.MutuallyExclusiveGroupID, meg)

        if (!this.megsToProps.has(meg.MutuallyExclusiveGroupID)){
            this.megsToProps.set(meg.MutuallyExclusiveGroupID, new Map<string, Prop>())
        }
        this.megsToProps.get(meg.MutuallyExclusiveGroupID)?.set(prop.PropID, prop)

        if (!this.propsToOdds.has(prop.PropID)){
            this.propsToOdds.set(prop.PropID, new Map<string, Odd>())
        }
        this.propsToOdds.get(prop.PropID)?.set(odd.OddID, odd)
    }

    async saveData(){
        await Promise.all([
            addAllMegs(Array.from(this.newMegs.values())),
            upsertAllProps(Array.from(this.newProps.values())),
            addAllOdds(this.getAllOdds())
            ])
    }

}