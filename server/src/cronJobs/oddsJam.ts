import {oddsJamApi} from "../oddsJam/OddsJamClient";
import {Game} from "../../../shared/models/Game";
import {addGame, getGame, listGames, updateGame} from "../controllers/Game";
import {sportsbooks} from "../../../shared/constants";
import {Odd} from "../../../shared/models/Odd";
import {Prop} from "../../../shared/models/Prop";
import {addProp, getProp, listProps, updateProp} from "../controllers/Prop";
import {addOdd, getOdd} from "../controllers/Odd";
import {getHourDiff} from "../util/util";

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

async function getAndStoreGames(){
    const gamesResponse = await oddsJamApi.getGames({});

    console.log("# of games: " + gamesResponse.data.length)

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

        try{
            const getGameResponse = await getGame(gameData.id)
            if (getGameResponse.status == 404){
                await addGame(newGame)
            } else {
                await updateGame(gameData.id, newGame)
            }
        }catch (e) {
            console.log("save game exception: ", e)
        }

    }
}

async function saveProp(gameID: string, propID: string, odd: any){
    const newProp: Prop = new Prop(
        gameID,
        propID,
        odd.market_name,
        odd.name,
        "unknown",
        odd.bet_points)

    try {
        const getPropResponse = await getProp(propID)
        if (getPropResponse.status == 404){
            const addPropResponse = await addProp(newProp)
        }
    } catch (e) {
        console.log("save prop exception: ", e)
    }

    return newProp
}

async function saveOdd(gameId: string, propId: string, oddID: string, oddData: any){
    const newOdd: Odd = new Odd(
        gameId,
        propId,
        oddID,
        oddData.sports_book_name,
        oddData.price,
        oddData.checked_date)
    try {
        const getOddResponse = await getOdd(oddID)
        if (getOddResponse.status == 404){
            const addOddResponse = addOdd(newOdd)
        }
    } catch (e) {
        console.log("save Odd exception: ", e)
    }
    return newOdd
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

async function getPropsAndOdds(){
    const scheduledGames = await listGames({
        Status: "scheduled"
    })

    console.log("# of scheduled games: " + scheduledGames.data.length)

    let num_odds = 0
    for (let i = 0; i < scheduledGames.data.length; i = i+5) {
        console.log("processing games #" + i +"-"+(i+4))

        const gameIDs = getNextFiveGameIds(i, scheduledGames.data)
        try{
            const oddsResponse = await oddsJamApi.getGameOdds({
                game_id: gameIDs,
                sportsbook: sportsbooks
            })
            if (oddsResponse.data){
                for (const gameResponse of oddsResponse.data){
                    num_odds += gameResponse.odds.length
                    for (const oddData of gameResponse.odds){
                        const propID = gameResponse.id + "-" + oddData.market_name + "-" + oddData.name;
                        const oddID = oddData.id + getHourDiff(gameResponse.start_date)
                        await saveProp(gameResponse.id, propID, oddData)
                        saveOdd(gameResponse.id, propID, oddID, oddData)
                    }
                }
            }
        }catch (e) {
            console.log("odds request failed ", e)
        }
    }
    console.log("# of odds: " + num_odds)
}

