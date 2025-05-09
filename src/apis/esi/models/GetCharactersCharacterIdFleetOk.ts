/* tslint:disable */
/* eslint-disable */
/**
 * EVE Swagger Interface
 * An OpenAPI for EVE Online
 *
 * The version of the OpenAPI document: 1.19
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * 200 ok object
 * @export
 * @interface GetCharactersCharacterIdFleetOk
 */
export interface GetCharactersCharacterIdFleetOk {
    /**
     * The character's current fleet ID
     * @type {number}
     * @memberof GetCharactersCharacterIdFleetOk
     */
    fleetId: number;
    /**
     * Member’s role in fleet
     * @type {string}
     * @memberof GetCharactersCharacterIdFleetOk
     */
    role: GetCharactersCharacterIdFleetOkRoleEnum;
    /**
     * ID of the squad the member is in. If not applicable, will be set to -1
     * @type {number}
     * @memberof GetCharactersCharacterIdFleetOk
     */
    squadId: number;
    /**
     * ID of the wing the member is in. If not applicable, will be set to -1
     * @type {number}
     * @memberof GetCharactersCharacterIdFleetOk
     */
    wingId: number;
}


/**
 * @export
 */
export const GetCharactersCharacterIdFleetOkRoleEnum = {
    FleetCommander: 'fleet_commander',
    SquadCommander: 'squad_commander',
    SquadMember: 'squad_member',
    WingCommander: 'wing_commander'
} as const;
export type GetCharactersCharacterIdFleetOkRoleEnum = typeof GetCharactersCharacterIdFleetOkRoleEnum[keyof typeof GetCharactersCharacterIdFleetOkRoleEnum];


/**
 * Check if a given object implements the GetCharactersCharacterIdFleetOk interface.
 */
export function instanceOfGetCharactersCharacterIdFleetOk(value: object): value is GetCharactersCharacterIdFleetOk {
    if (!('fleetId' in value) || value['fleetId'] === undefined) return false;
    if (!('role' in value) || value['role'] === undefined) return false;
    if (!('squadId' in value) || value['squadId'] === undefined) return false;
    if (!('wingId' in value) || value['wingId'] === undefined) return false;
    return true;
}

export function GetCharactersCharacterIdFleetOkFromJSON(json: any): GetCharactersCharacterIdFleetOk {
    return GetCharactersCharacterIdFleetOkFromJSONTyped(json, false);
}

export function GetCharactersCharacterIdFleetOkFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetCharactersCharacterIdFleetOk {
    if (json == null) {
        return json;
    }
    return {
        
        'fleetId': json['fleet_id'],
        'role': json['role'],
        'squadId': json['squad_id'],
        'wingId': json['wing_id'],
    };
}

export function GetCharactersCharacterIdFleetOkToJSON(json: any): GetCharactersCharacterIdFleetOk {
    return GetCharactersCharacterIdFleetOkToJSONTyped(json, false);
}

export function GetCharactersCharacterIdFleetOkToJSONTyped(value?: GetCharactersCharacterIdFleetOk | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'fleet_id': value['fleetId'],
        'role': value['role'],
        'squad_id': value['squadId'],
        'wing_id': value['wingId'],
    };
}

