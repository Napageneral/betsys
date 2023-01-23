declare type apiUrlTypes = 'games' | 'leagues' | 'markets' | 'game-odds' | 'futures' | 'future-odds' | 'scores';
export declare const createURL: (apiKey: string) => (type: apiUrlTypes) => string;
export {};
