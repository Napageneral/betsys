import {oddsJamApi} from "../oddsJam/OddsJamClient";
import {Game} from "../../../shared/models/Game";
import {addAllGames, getStoredGameMap, listGames, updateGame} from "../controllers/Game";
import {allSportsbooks, coPlusSportsbooks} from "../../../shared/constants";
import {Odd} from "../../../shared/models/Odd";
import {shallowEqual} from "../util/util";
import {BetType} from "../../../shared/models/MutuallyExclusiveGroup";
import {BetBatch} from "../models/BetBatch";

const ouSet = new Set(['over', 'under', 'Over', 'Under'])

export async function pullOddsJamData(){
    var startTime = performance.now()
    await getAndStoreGames()
    var endTime = performance.now()
    console.log(`Call to getAndStoreGames took ${endTime - startTime} milliseconds == ${(endTime - startTime)/1000} seconds`)

    startTime = performance.now()
    await getPropsAndOdds()
    endTime = performance.now()
    console.log(`Call to getPropsAndOdds took ${endTime - startTime} milliseconds == ${(endTime - startTime)/1000} seconds`)
}

async function getAndStoreGames(){
    const storedGameMap: Map<string, Game> = await getStoredGameMap()
    console.log("# of stored games: " + storedGameMap.size)

    const gamesResponse = await oddsJamApi.getGames({});
    console.log("# of oddsJam games: " + gamesResponse.data.length)

    const newGames: Game[] = []
    for (const game in gamesResponse.data){
        const gameData = gamesResponse.data[game]
        let status = "scheduled"
        if (gameData.is_live){
            status = "live"
        }
        const newGame: Game = new Game(gameData.id,
            gameData.sport,
            gameData.league,
            gameData.start_date,
            gameData.home_team,
            gameData.away_team,
            status,
            gameData.tournament)

        if (storedGameMap.has(newGame.GameID)){
            const storedGame = storedGameMap.get(newGame.GameID)
            if (!shallowEqual(storedGame, newGame)){
                updateGame(gameData.id, newGame)
            }
        } else {
            newGames.push(newGame)
        }
    }
    console.log("# of games to add: " + newGames.length)
    await addAllGames(newGames)
}

function getBetInfo(oddData: any){
    let propActor = undefined;
    let overUnder = undefined;
    let betType: BetType;

    if (oddData.bet_points){
        const betNameTokens = oddData.name.split(" ")
        const numTokens = betNameTokens.length
        if (ouSet.has(betNameTokens[numTokens-2])){
            betType = "OverUnder"
            overUnder = betNameTokens[numTokens-2]
            propActor = betNameTokens.slice(0,numTokens-2).join(" ")
        } else {
            betType = "Spread"
            propActor = betNameTokens.slice(0,numTokens-1).join(" ")
        }
    } else {
        betType = "Moneyline"
    }
    return {
        PropActor: propActor,
        OverUnder: overUnder,
        BetType: betType
    }
}


async function getPropsAndOdds(){
    const incompleteGamesResponse = await listGames({
        Incomplete:true
    })
    const storedGames: Game[] = incompleteGamesResponse.data.rows
    console.log("# of stored incomplete games: " + storedGames.length)

    let num_odds = 0
    for (let i = 0; i < storedGames.length; i = i+5) {
        console.log("processing games #" + i +"-"+(i+4))

        const betBatchData: BetBatch = new BetBatch(storedGames, i, 5);
        await betBatchData.getStoredData()
        try{
            const oddsResponse = await oddsJamApi.getGameOdds({
                game_id: betBatchData.getGameIDs(),
                sportsbook: coPlusSportsbooks
            })

            if (oddsResponse.data){
                for (const gameResponse of oddsResponse.data){
                    num_odds += gameResponse.odds.length
                    for (const oddData of gameResponse.odds){
                        const propID = gameResponse.id + "-" + oddData.market_name + "-" + oddData.name;
                        const oddID = propID + "_" + oddData.sports_book_name
                        const betInfo = getBetInfo(oddData)
                        const meg = betBatchData.getOrCreateMeg(gameResponse.id, oddData.market_name, betInfo.BetType, betInfo.PropActor, oddData.bet_points)
                        if (!meg) continue
                        const prop = betBatchData.createProp(gameResponse.id, propID, meg.MutuallyExclusiveGroupID, oddData.market_name, oddData.name, betInfo,oddData.bet_points)
                        const odd = new Odd(gameResponse.id, propID, oddID, oddData.sports_book_name, oddData.price, oddData.checked_date)
                        betBatchData.addOdd(gameResponse.id, meg, prop, odd)
                    }
                }
            }

            betBatchData.calculateAndSaveProfitableBets()
            await betBatchData.saveData()
        }catch (e) {
            console.log("odds request failed ", e)
        }
    }
    console.log("# of odds: " + num_odds)
}