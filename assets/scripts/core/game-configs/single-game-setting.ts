export class SingleGameSetting {
    id: number;
    lobbyId?: number;
    name: string;
    configName?: string;
    choices?: string[];
    hedgeBetGroups?: string[][];
    numberOfRoundHistory: number;
    validateBalanceWhenBet?: boolean;
    durationShowPromptMessage?: number;
    isMiniGame?: boolean;
}
