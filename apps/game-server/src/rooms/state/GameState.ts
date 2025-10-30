import { Schema, type, MapSchema } from "@colyseus/schema";

export class PlayerState extends Schema {
    @type("string") id: string = "";
    @type("string") name: string = "";
    @type("number") x: number = 0;
    @type("number") y: number = 0;
    @type("number") rot: number = 0;
    @type("number") lastMoveAt: number = 0;
}

export class CityState extends Schema {
    @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
    @type("number") count: number = 0;
}
