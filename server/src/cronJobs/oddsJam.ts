import {oddsJamApi} from "../oddsJam/OddsJamClient";
import {Game} from "../../../shared/models/Game";
import {addGames, listGames, updateGame} from "../controllers/Game";
import {sportsbooks} from "../../../shared/constants";
import {Odd} from "../../../shared/models/Odd";
import {Prop} from "../../../shared/models/Prop";
import {addProps, listProps, updateProp} from "../controllers/Prop";
import {addOdds} from "../controllers/Odd";
import {getHourDiff, shallowEqual, sliceIntoChunks} from "../util/util";

export async function completeGamesAndGradeBets(){
    const liveGames = await listGames({
        Status: "live"
    })

    console.log("# of live games: " + liveGames.data.length)

    for (const game of liveGames.data as Game[]){
        const hourDiff = getHourDiff(game.StartDate)
        if (hourDiff > 6){
            game.Status = "complete"
            await updateGame(game.GameID, game)

            const props = await listProps({GameID:game.GameID})
            for (const prop of props.data as Prop[]){
                try{
                    const gradeResponse = await oddsJamApi.gradeBet({
                        sport: game.Sport,
                        league: game.League,
                        game_id: game.GameID,
                        market_name: prop.Market,
                        bet_name: prop.PropName
                    })
                    console.log(gradeResponse)
                    prop.PropResult = gradeResponse.data.betResult

                    await updateProp(prop.PropID, prop)
                } catch (e){
                    console.log("error grading bet: ", e)
                }
            }
        }
    }
}

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
    const storedGames = await listGames({
        Status: "scheduled"
    })
    const storedGameMap : Map<string, Game> = new Map<string, Game>()
    for (const storedGame of storedGames.data as Game[]){
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

async function addAllProps(Props: Prop[]){
    const PropChunks:Prop[][] = sliceIntoChunks(Props, 1000)
    for (const PropChunk of PropChunks){
        await addProps(PropChunk)
    }
}

async function addAllOdds(Odds: Odd[]){
    const OddChunks:Odd[][] = sliceIntoChunks(Odds, 1000)
    for (const OddChunk of OddChunks){
        await addOdds(OddChunk)
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

async function getStoredPropIds(gameIDs: string[]){
    const storedProps = await listProps({
        GameIDs: gameIDs,
        IDsOnly: true
    })
    return new Set<string>(storedProps.data)
}


async function getPropsAndOdds(){
    const scheduledGames = await listGames({Status: "scheduled"})
    console.log("# of scheduled games: " + scheduledGames.data.length)

    let num_odds = 0
    for (let i = 0; i < scheduledGames.data.length; i = i+5) {
        console.log("processing games #" + i +"-"+(i+4))

        const gameIDs = getNextFiveGameIds(i, scheduledGames.data)
        const storedPropSet: Set<string> = await getStoredPropIds(gameIDs)
        try{
            const oddsResponse = await oddsJamApi.getGameOdds({
                game_id: gameIDs,
                sportsbook: sportsbooks
            })

            const newProps: Map<string, Prop> = new Map<string, Prop>()
            const newOdds: Map<string, Odd> = new Map<string, Odd>()
            if (oddsResponse.data){
                for (const gameResponse of oddsResponse.data){
                    num_odds += gameResponse.odds.length
                    for (const oddData of gameResponse.odds){
                        const propID = gameResponse.id + "-" + oddData.market_name + "-" + oddData.name;
                        const tMinus = getHourDiff(gameResponse.start_date)
                        const oddID = propID + "_" + oddData.sports_book_name

                        if (!storedPropSet.has(propID)){
                            newProps.set(propID, new Prop(
                                gameResponse.id,
                                propID,
                                oddData.market_name,
                                oddData.name,
                                "unknown",
                                oddData.bet_points))
                        }

                        newOdds.set(oddID, new Odd(
                            gameResponse.id,
                            propID,
                            oddID,
                            tMinus,
                            oddData.sports_book_name,
                            oddData.price,
                            oddData.checked_date))
                    }
                }
            }
            await addAllProps(Array.from(newProps.values()))
            await addAllOdds(Array.from(newOdds.values()))
        }catch (e) {
            console.log("odds request failed ", e)
        }
    }
    console.log("# of odds: " + num_odds)
}

