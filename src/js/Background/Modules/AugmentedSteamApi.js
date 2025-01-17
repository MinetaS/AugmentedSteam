import {Errors} from "../../modulesCore";
import {IndexedDB} from "./IndexedDB";
import Config from "../../config";
import {Api} from "./Api";

class AugmentedSteamApi extends Api {

    /*
     * static origin = Config.ApiServerHost;
     * static _progressingRequests = new Map();
     */

    static storePageData(appid) {
        const params = {"appid": appid};
        return IndexedDB.get("storePageData", appid, {params});
    }

    static expireStorePageData(appid) {
        return IndexedDB.delete("storePageData", `app_${appid}`);
    }

    static rates(to) {
        return IndexedDB.getAll("rates", {"params": {"to": to.sort().join(",")}});
    }

    static clearRates() {
        return IndexedDB.clear("rates");
    }

    static isEA(appids) {
        return IndexedDB.contains("earlyAccessAppids", appids);
    }

    static fetchSteamPeek(appid) {
        return AugmentedSteamApi.endpointFactory(`similar/${appid}/v2`)({"count": 15});
    }

    static async fetchPrices(params/*: {
        country: string,
        apps?: number[],
        subs?: number[],
        bundles?: number[],
        voucher: boolean,
        shops: number[]
    }*/) {
        const url = new URL("prices/v2", Config.ApiServerHost);

        let response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(params)
        });

        if (response.ok) {
            return response.json();
        }

        throw new Errors.HTTPError(response.status, response.statusText);
    }

    static async fetchAppPageData(appid) {
        const url = new URL(`app/${appid}/v2`, Config.ApiServerHost);
        let response = await fetch(url);

        if (response.ok) {
            return response.json();
        }

        throw new Errors.HTTPError(response.status, response.statusText);
    }

    static async fetchDlcInfo(appid) {
        const url = new URL(`dlc/${appid}/v2`, Config.ApiServerHost);

        let response = await fetch(url);

        if (response.ok) {
            return response.json();
        }

        throw new Errors.HTTPError(response.status, response.statusText);
    }

    static async fetchProfile(steamId) {
        const url = new URL(`profile/${steamId}/v2`, Config.ApiServerHost);
        let response = await fetch(url);

        if (response.ok) {
            return response.json();
        }

        throw new Errors.HTTPError(response.status, response.statusText);
    }

    static async fetchTwitch(twitchChannelId) {
        return AugmentedSteamApi.endpointFactory(`twitch/${twitchChannelId}/stream/v2`);
    }
}
AugmentedSteamApi.origin = Config.ApiServerHost;
AugmentedSteamApi._progressingRequests = new Map();

export {AugmentedSteamApi};
