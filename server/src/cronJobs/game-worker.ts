// import {Game} from "../../../shared/models/Game";
// import {oddsJamApi} from "../oddsJam/OddsJamClient";
// import {sportsbooks} from "../../../shared/constants";
// import {Prop} from "../../../shared/models/Prop";
// import {Odd} from "../../../shared/models/Odd";
// import {saveOdd, saveProp} from "../cronJobs/oddsJam";
//
// module.exports = async (game:Game) => {
//     try{
//         console.log("calling oddsjam")
//         const oddsResponse = await oddsJamApi.getGameOdds({
//             game_id: game.GameID,
//             sportsbook: sportsbooks
//         })
//         console.log("oddsResponse:", oddsResponse)
//         if (oddsResponse.data[0]?.odds){
//             for (const oddData of oddsResponse.data[0].odds){
//                 const propID = game.GameID + "-" + oddData.market_name + "-" + oddData.name;
//
//                 const prop: Prop = await saveProp(game.GameID, propID, oddData)
//                 console.log("savedProp:", prop)
//                 const odd: Odd = await saveOdd(game.GameID, propID, oddData)
//                 console.log("savedOdd:", odd)
//             }
//         }
//     }catch (e) {
//         console.log("odds request failed ", e)
//     }
// }