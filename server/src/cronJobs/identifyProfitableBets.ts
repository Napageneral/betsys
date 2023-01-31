import {listGames} from "../controllers/Game";
import {Game} from "../../../shared/models/Game";
import {listProps} from "../controllers/Prop";
import {Prop} from "../../../shared/models/Prop";
import {listOdds} from "../controllers/Odd";
import {Odd} from "../../../shared/models/Odd";
import {ProfitableBet} from "../../../shared/models/ProfitableBet";
import {round} from "../util/util";

async function getPendingGames(){
    const pendingGames = []
    const liveGamesResponse = await listGames({
        Status: "live"
    })
    const liveGames: Game[] = liveGamesResponse.data.rows
    console.log("# of live games: " + liveGames.length)
    pendingGames.push(...liveGames)

    const scheduledGamesResponse = await listGames({
        Status: "scheduled"
    })
    const scheduledGames: Game[] = scheduledGamesResponse.data.rows
    console.log("# of scheduled games: " + scheduledGames.length)
    pendingGames.push(...scheduledGames)
    return pendingGames
}

export async function identifyProfitableBets(){
    var startTime = performance.now()
    const pendingGames = await getPendingGames()

    for (const game of pendingGames as Game[]){
        const latestGameOdds = await listOdds({
            GameID: game.GameID,
            TimeInterval: "6 HOUR"
        })
        if (!latestGameOdds.data || latestGameOdds.data.rows.length == 0) {
            continue
        }

        const propsResponse = await listProps({GameID:game.GameID})
        if (propsResponse.data == undefined || propsResponse.data.rows.length == 0){
            continue
        }
        for (const prop of propsResponse.data.rows as Prop[]){

            const latestOddsResponse = await listOdds({
                PropID: prop.PropID,
                TimeInterval: "6 HOUR"
            })

            if (!latestOddsResponse.data || latestOddsResponse.data.rows.length > 0){
                const latestOdds = latestOddsResponse.data.rows
                const mostRecentOdds = new Map<string, Odd>();
                for (const odd of latestOdds as Odd[]) {
                    mostRecentOdds.set(odd.BookName, odd)
                }
                let bestPrice = -Infinity
                let bestBook = undefined;
                let sumPrices = 0
                for (const bookName of mostRecentOdds.keys()) {
                    const odd: Odd | undefined = mostRecentOdds.get(bookName)
                    if (!odd) continue
                    if (odd.Price > bestPrice){
                        bestPrice = odd.Price
                        bestBook = odd
                    }
                    sumPrices += odd.Price
                }
                const meanPrice = round( sumPrices / mostRecentOdds.size, 2)
                const bestEV = round((bestPrice-meanPrice)/((bestPrice+meanPrice)/2) * 100, 2)
                if (!bestBook || bestEV <= 0) continue
                const pBet = new ProfitableBet(0, game.GameID, prop.PropID, game.Sport, prop.Market, bestEV, [prop.PropName], [bestBook.BookName], [bestPrice], bestBook.RetrievalTimestamp)
                console.log(pBet)
            }
        }
    }

    var endTime = performance.now()
    console.log(`Call to identifyProfitableBets took ${endTime - startTime} milliseconds == ${(endTime - startTime)/1000} seconds`)
}
