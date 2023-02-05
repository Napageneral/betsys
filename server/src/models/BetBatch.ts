import {Game} from "../../../shared/models/Game";
import {BetType, buildMegKey, MutuallyExclusiveGroup} from "../../../shared/models/MutuallyExclusiveGroup";
import {Prop} from "../../../shared/models/Prop";
import {Odd} from "../../../shared/models/Odd";
import {getStoredProps, upsertAllProps} from "../controllers/Prop";
import {addAllMegs, getNextMegID, getStoredMegs} from "../controllers/MutuallyExclusiveGroup";
import {addAllOdds} from "../controllers/Odd";
import {ComputedProp} from "../models/ComputedProp";
import {ComputedMeg} from "../models/ComputedMeg";

export class BetBatch {
    games: Map<string, Game> = new Map<string, Game>()

    gamesToMegs: Map<string, Set<MutuallyExclusiveGroup>> = new Map<string, Set<MutuallyExclusiveGroup>>();
    megsToProps: Map<number, Set<Prop>> = new Map<number, Set<Prop>>();
    propsToOdds: Map<string, Set<Odd>> = new Map<string, Set<Odd>>();

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

    calculateProfitableBets(){
        for (const gameId of this.gamesToMegs.keys()) {
            const game: Game | undefined = this.games.get(gameId)
            if (!game) continue

            const megSet = this.gamesToMegs.get(gameId)
            if (!megSet) continue
            const megs: MutuallyExclusiveGroup[] = [...megSet]
            for (const meg of megs as MutuallyExclusiveGroup[]) {
                const propSet = this.megsToProps.get(meg.MutuallyExclusiveGroupID)
                if (!propSet || propSet.size>2) continue
                const props: Prop[] = [...propSet]
                const computedProps = []
                for (const prop of props as Prop[]) {
                    computedProps.push(this.computeProp(prop))
                }
                // @ts-ignore
                const computedMeg = this.computeMeg(computedProps[0], computedProps[1])
                //console.log(computedMeg)
            }
        }
    }

    computeMeg(computedProp1:ComputedProp, computedProp2:ComputedProp): ComputedMeg{
        const arbitrages = this.detectArbitrages(computedProp1.SortedOdds, computedProp2.SortedOdds)

        const meanMarketWidth = this.calculateMarketWidth(computedProp1.MeanPrice, computedProp2.MeanPrice)
        const meanNoVigOdds = this.calculateNoVigOdds(computedProp1.MeanPrice, computedProp2.MeanPrice)

        let pevs1 = undefined
        let pevs2 = undefined
        let pinnacleMarketWidth = undefined
        let pinnacleNoVigOdds = undefined
        if (computedProp1.PinnaclePrice && computedProp2.PinnaclePrice){
            pinnacleMarketWidth = this.calculateMarketWidth(computedProp1.PinnaclePrice, computedProp2.PinnaclePrice)
            pinnacleNoVigOdds = this.calculateNoVigOdds(computedProp1.PinnaclePrice, computedProp2.PinnaclePrice)

            pevs1 = this.detectPositiveEV(computedProp1.SortedOdds, pinnacleNoVigOdds.NoVigPrice1)
            pevs2 = this.detectPositiveEV(computedProp2.SortedOdds, pinnacleNoVigOdds.NoVigPrice2)
        } else {
            pevs1 = this.detectPositiveEV(computedProp1.SortedOdds, meanNoVigOdds.NoVigPrice1)
            pevs2 = this.detectPositiveEV(computedProp2.SortedOdds, meanNoVigOdds.NoVigPrice2)
        }

        return {
            ArbitrageBets: arbitrages,
            PositiveEVBets: [...pevs1, ...pevs2],
            MeanMarketWidth: meanMarketWidth,
            MeanNoVigOdds: meanNoVigOdds,
            PinnacleMarketWidth: pinnacleMarketWidth,
            PinnacleNoVigOdds: pinnacleNoVigOdds
        }
    }

    detectPositiveEV(odds: Odd[], fairPrice: number){
        const pEVBets = [];

        for (const odd of odds) {
            if (odd.Price > fairPrice){
                pEVBets.push(odd)
            } else {
                break;
            }
        }

        return pEVBets;
    }

    detectArbitrages(odds1: Odd[], odds2: Odd[]){
        const arbitrages = []
        for (let i = 0; i < odds1.length; i++) {
            const odd1 = odds1[i]
            for (let j = 0; j < odds2.length; j++) {
                const odd2 = odds2[j]
                if (this.isArbitrage(odd1.Price, odd2.Price)){
                    arbitrages.push([odd1, odd2])
                } else {
                    break;
                }
            }
        }
        return arbitrages
    }

    isArbitrage(price1: number, price2: number){
        const ip1 = this.americanOddsToImpliedProb(price1)
        const ip2 = this.americanOddsToImpliedProb(price2)
        if (ip1+ip2 < 100) return true;
        return false;
    }

    calculateNoVigOdds(price1: number, price2: number){
        const ip1 = this.americanOddsToImpliedProb(price1)
        const ip2 = this.americanOddsToImpliedProb(price2)
        const noVigPrice1 = this.impliedProbToAmericanOdds(ip1 / (ip1+ip2))
        const noVigPrice2 = this.impliedProbToAmericanOdds(ip2 / (ip1+ip2))
        return {
            NoVigPrice1: noVigPrice1,
            NoVigPrice2: noVigPrice2
        }
    }

    americanOddsToImpliedProb(americanPrice: number){
        if (americanPrice > 0){
            return 100 / (americanPrice + 100) * 100
        } else {
            return americanPrice / (americanPrice + 100) * 100
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
        const oddSet = this.propsToOdds.get(prop.PropID)
        if (!oddSet) return undefined
        const odds: Odd[] = [...oddSet]

        const pinnacleOdd = odds.find(function (element) {
            return element.BookName == "Pinnacle";
        })
        odds.sort(function(a,b) {return (a.Price > b.Price) ? 1 : ((b.Price > a.Price) ? -1 : 0);})
        const meanPrice = odds.reduce((acc, c) => acc + (c.Price/odds.length), 0);

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
        for (const oddSet of this.propsToOdds.values()) {
            odds.push(...oddSet)
        }
        return odds
    }

    async getStoredData(){
        this.storedProps = await getStoredProps(this.getGameIDs())
        this.storedMegs = await getStoredMegs(this.getGameIDs())
        this.nextMegID = await getNextMegID()
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
            this.gamesToMegs.set(gameID, new Set())
        }
        this.gamesToMegs.get(gameID)?.add(meg)

        if (!this.megsToProps.has(meg.MutuallyExclusiveGroupID)){
            this.megsToProps.set(meg.MutuallyExclusiveGroupID, new Set())
        }
        this.megsToProps.get(meg.MutuallyExclusiveGroupID)?.add(prop)

        if (!this.propsToOdds.has(prop.PropID)){
            this.propsToOdds.set(prop.PropID, new Set())
        }
        this.propsToOdds.get(prop.PropID)?.add(odd)
    }

    async saveData(){
        await Promise.all([
            addAllMegs(Array.from(this.newMegs.values())),
            upsertAllProps(Array.from(this.newProps.values())),
            addAllOdds(this.getAllOdds())
            ])
    }

}