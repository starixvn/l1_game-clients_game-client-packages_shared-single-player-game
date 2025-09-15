export namespace GameServiceMessage {
    export class RoundBetDetails {
        data: any;
        static eventName = "round";
    }
}

export namespace GameClientEmitMessage {
    export class RoundBetDetails {
        roundId: number;
        static eventName = "getRound";
    }
}
