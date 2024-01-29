import {HTML, Localization} from "../../../../modulesCore";
import {CurrencyManager, Feature, RequestData, User} from "../../../modulesContent";

export default class FSoldAmountLastDay extends Feature {

    checkPrerequisites() {
        return document.getElementById("pricehistory") !== null;
    }

    async apply() {
        const country = User.storeCountry;
        const currencyNumber = CurrencyManager.currencyTypeToNumber(CurrencyManager.storeCurrency);

        const data = await RequestData.getJson(`https://steamcommunity.com/market/priceoverview/?appid=${this.context.appid}&country=${country}&currency=${currencyNumber}&market_hash_name=${this.context.marketHashName}`);
        if (!data.success) { return; }

        const soldHtml
            = `<div class="es_sold_amount_block">
                   ${Localization.str.sold_last_24.replace("__sold__", `<span class="market_commodity_orders_header_promote">${data.volume || 0}</span>`)}
               </div>`;

        HTML.afterBegin("#market_commodity_order_spread", soldHtml);
    }
}
