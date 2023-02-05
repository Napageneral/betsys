import {oddsJamApi} from "../oddsJam/OddsJamClient";
import {Game} from "../../../shared/models/Game";
import {listGames, updateGame} from "../controllers/Game";
import {Prop} from "../../../shared/models/Prop";
import {listProps, updatePropResults} from "../controllers/Prop";
import {sliceIntoChunks} from "../util/util";

export async function completeGamesAndGradeBets(){
    var startTime = performance.now()
    const liveGamesResponse = await listGames({
        GameEnded: true
    })
    const incompleteGames: Game[] = liveGamesResponse.data.rows
    console.log("# of incomplete games: " + incompleteGames.length)

    let num_props_updated = 0
    let num_props_failed = 0
    for (const game of incompleteGames as Game[]){
        game.Status = "complete"
        updateGame(game.GameID, game)

        const props = await listProps({GameID:game.GameID})
        if (props.data == undefined || props.data.rows.length == 0){
            continue
        }
        num_props_updated += props.data.rows.length
        let propsToUpdate = []
        for (const prop of props.data.rows as Prop[]){
            try{
                const gradeResponse = await oddsJamApi.gradeBet({
                    sport: game.Sport,
                    league: game.League,
                    game_id: game.GameID,
                    market_name: prop.Market,
                    bet_name: prop.PropName
                })
                propsToUpdate.push([prop.PropID, gradeResponse.data.betResult])
            } catch (e){
                num_props_failed += 1
                //console.log("error grading bet")
            }
        }
        console.log("num props updated", propsToUpdate.length)
        updateAllPropResults(propsToUpdate)
    }
    console.log("num props graded: ",num_props_updated)
    console.log("num props failed: ",num_props_failed)
    var endTime = performance.now()
    console.log(`Call to completeGamesAndGradeBets took ${endTime - startTime} milliseconds == ${(endTime - startTime)/1000} seconds`)
}

async function updateAllPropResults(propIdsAndResults: any[]){
    const propIdsAndResultsChunks:any[][] = sliceIntoChunks(propIdsAndResults, 1000)
    for (const propIdsAndResultsChunk of propIdsAndResultsChunks){
        await updatePropResults(propIdsAndResultsChunk)
    }
}
