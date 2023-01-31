import {oddsJamApi} from "../oddsJam/OddsJamClient";
import {Game} from "../../../shared/models/Game";
import {addGames, listGames, updateGame} from "../controllers/Game";
import {sportsbooks} from "../../../shared/constants";
import {Odd} from "../../../shared/models/Odd";
import {Prop} from "../../../shared/models/Prop";
import {addProps, listProps, updatePropResults, upsertProps} from "../controllers/Prop";
import {addOdds} from "../controllers/Odd";
import {shallowEqual, sliceIntoChunks} from "../util/util";
import {BetType, MutuallyExclusiveGroup} from "../../../shared/models/MutuallyExclusiveGroup";
import {
    addMutuallyExclusiveGroups,
    getNextID,
    listMutuallyExclusiveGroups
} from "../controllers/MutuallyExclusiveGroup";

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

async function getStoredGameMap(){
    const storedGames = await listGames({})
    const storedGameMap : Map<string, Game> = new Map<string, Game>()
    for (const storedGame of storedGames.data.rows as Game[]){
        storedGameMap.set(storedGame.GameID, storedGame)
    }
    return storedGameMap
}

async function addAllGames(games: Game[]){
    const gameChunks:Game[][] = sliceIntoChunks(games, 1000)
    for (const gameChunk of gameChunks){
        await addGames(gameChunk)
    }
}

async function upsertAllProps(Props: Prop[]){
    const PropChunks:Prop[][] = sliceIntoChunks(Props, 1000)
    for (const PropChunk of PropChunks){
        await upsertProps(PropChunk)
    }
}

async function addAllOdds(Odds: Odd[]){
    const OddChunks:Odd[][] = sliceIntoChunks(Odds, 1000)
    for (const OddChunk of OddChunks){
        await addOdds(OddChunk)
    }
}

async function addAllMegs(Megs: MutuallyExclusiveGroup[]){
    const MegChunks:MutuallyExclusiveGroup[][] = sliceIntoChunks(Megs, 1000)
    for (const MegChunk of MegChunks){
        await addMutuallyExclusiveGroups(MegChunk)
    }
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

function getNextFiveGameIds(i: number, games: Game[]){
    const gameIDs = []
    for (let j = 0; j < 5; j++) {
        if (i+j < games.length){
            gameIDs.push(games[i+j].GameID)
        }
    }
    return gameIDs
}

async function getStoredProps(gameIDs: string[]){
    const storedProps = await listProps({
        GameIDs: gameIDs
    })
    const propMap = new Map<string, Prop>();
    for (const storedProp of storedProps.data.rows as Prop[]) {
        propMap.set(storedProp.PropID, storedProp)
    }
    return propMap
}

async function getStoredMegs(gameIDs: string[]){
    const storedMegs = await listMutuallyExclusiveGroups({
        GameIDs: gameIDs
    })
    const megMap = new Map<string, MutuallyExclusiveGroup>();
    for (const storedMeg of storedMegs.data.rows as MutuallyExclusiveGroup[]) {
        let megKey: string = buildMegKey(storedMeg.GameID, storedMeg.Market, storedMeg.BetType, storedMeg.PropPoints, storedMeg.PropActor)
        megMap.set(megKey, storedMeg)
    }
    return megMap
}

async function getNextMegID(){
    const nextMegIdResponse = await getNextID()
    if (nextMegIdResponse.data){
        return nextMegIdResponse.data.rows[0].max
    }
    return 1
}

function buildMegKey(gameID: string, market: string, betType: BetType, propPoints?: number, propActor?: string){
    let megKey: string = gameID + "_" + market + "_" + betType;
    if (betType != "Moneyline"){
        megKey +=  "_" + propPoints;
        if (propActor){
            megKey += "_" + propActor;
        }
    }
    return megKey;
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

        const gameIDs = getNextFiveGameIds(i, storedGames)
        const storedProps: Map<string, Prop> = await getStoredProps(gameIDs)
        const storedMegs: Map<string, MutuallyExclusiveGroup> = await getStoredMegs(gameIDs)
        let nextMegID: number = await getNextMegID()
        try{
            const oddsResponse = await oddsJamApi.getGameOdds({
                game_id: gameIDs,
                sportsbook: sportsbooks
            })

            const newProps: Map<string, Prop> = new Map<string, Prop>()
            const newOdds: Map<string, Odd> = new Map<string, Odd>()
            const newMegs: Map<string, MutuallyExclusiveGroup> = new Map<string, MutuallyExclusiveGroup>()
            if (oddsResponse.data){
                for (const gameResponse of oddsResponse.data){
                    num_odds += gameResponse.odds.length
                    for (const oddData of gameResponse.odds){
                        const propID = gameResponse.id + "-" + oddData.market_name + "-" + oddData.name;
                        const oddID = propID + "_" + oddData.sports_book_name

                        let propActor = undefined;
                        let overUnder = undefined;
                        let betType: BetType = "Moneyline";

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

                        let megKey = buildMegKey(gameResponse.id, oddData.market_name, betType, oddData.bet_points, propActor)
                        let megId = undefined;
                        if (storedMegs.has(megKey)){
                            megId = storedMegs.get(megKey)?.MutuallyExclusiveGroupID
                        } else if (newMegs.has(megKey)) {
                            megId = newMegs.get(megKey)?.MutuallyExclusiveGroupID
                        } else {
                            newMegs.set(megKey, new MutuallyExclusiveGroup(nextMegID, gameResponse.id, oddData.market_name, betType, propActor, oddData.bet_points))
                            megId = nextMegID
                            nextMegID += 1;
                        }

                        if (!storedProps.has(propID)){
                            if (!megId) continue
                            newProps.set(propID, new Prop(
                                gameResponse.id,
                                propID,
                                megId,
                                oddData.market_name,
                                oddData.name,
                                "unknown",
                                betType,
                                oddData.bet_points,
                                overUnder,
                                propActor))
                        }

                        newOdds.set(oddID, new Odd(
                            gameResponse.id,
                            propID,
                            oddID,
                            oddData.sports_book_name,
                            oddData.price,
                            oddData.checked_date))
                    }
                }
            }

            await addAllMegs(Array.from(newMegs.values()))
            await upsertAllProps(Array.from(newProps.values()))
            await addAllOdds(Array.from(newOdds.values()))
        }catch (e) {
            console.log("odds request failed ", e)
        }
    }
    console.log("# of odds: " + num_odds)
}

