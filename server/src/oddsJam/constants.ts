const API_ROOT_ENDPOINT = "https://api-external.oddsjam.com/api/v2/";
export const createURL = (apiKey:any) => (type:any) => `${API_ROOT_ENDPOINT}${type}/?key=${apiKey}&`;
//# sourceMappingURL=constants.js.map