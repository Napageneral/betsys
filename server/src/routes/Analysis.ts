import express, {Request, Response} from 'express';
import {
    AddAnalysisRequest, AddAnalysisResponse,
    GetAnalysisRequest, GetAnalysisResponse,
    ListAnalysesRequest, ListAnalysesResponse,
    RemoveAnalysisRequest, RemoveAnalysisResponse, UpdateAnalysisRequest, UpdateAnalysisResponse
} from "../../../shared/models/Analysis";
import {
    createAnalysis,
    getAnalysis,
    listAnalyses,
    removeAnalysis,
    updateAnalysis
} from "../controllers/Analysis";
import {sendExpressResponseFromApiResponses} from "../util/ResponseUtility";


const router = express.Router();

router.post("/Create", create);
router.post( "/Remove", remove);
router.post("/Get", get);
router.post( "/List", list);
router.post( "/Update", update);


async function create(req: Request, res: Response){
    const createAnalysisRequest: AddAnalysisRequest = req.body;
    const output = await createAnalysis(createAnalysisRequest);
    const response : AddAnalysisResponse = {
        Analysis: output.data
    }
    return sendExpressResponseFromApiResponses(res, [output], response);
}

async function remove(req: Request, res: Response){
    const removeAnalysisRequest: RemoveAnalysisRequest = req.body;
    const output = await removeAnalysis(removeAnalysisRequest);
    const response : RemoveAnalysisResponse = {
    }
    return sendExpressResponseFromApiResponses(res, [output], response);
}

async function get(req: Request, res: Response){
    const getAnalysisRequest: GetAnalysisRequest = req.body;
    const output = await getAnalysis(getAnalysisRequest);
    const response : GetAnalysisResponse = {
        Analysis: output.data
    }
    return sendExpressResponseFromApiResponses(res, [output], response);
}

async function list(req: Request, res: Response){
    const listAnalysissRequest: ListAnalysesRequest = req.body;
    const output = await listAnalyses(listAnalysissRequest);
    const response : ListAnalysesResponse = {
        Analyses: output.data
    }
    return sendExpressResponseFromApiResponses(res, [output], response);
}

async function update(req: Request, res: Response){
    const updateAnalysisRequest: UpdateAnalysisRequest = req.body;
    const output = await updateAnalysis(updateAnalysisRequest);
    const response : UpdateAnalysisResponse = {
        Analysis: output.data
    }
    return sendExpressResponseFromApiResponses(res, [output], response);
}

export default router;