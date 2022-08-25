/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, RouteComponentProps } from "react-router-dom";
import App from "./app/App";
import { AppRouteProps } from "./app/AppRouteProps";
import { ServiceFactory } from "./factories/serviceFactory";
import "./index.scss";
import { IConfiguration } from "./models/config/IConfiguration";
import { CHRYSALIS, STARDUST } from "./models/config/protocolVersion";
import { ChrysalisApiClient } from "./services/chrysalis/chrysalisApiClient";
import { ChrysalisFeedClient } from "./services/chrysalis/chrysalisFeedClient";
import { ChrysalisTangleCacheService } from "./services/chrysalis/chrysalisTangleCacheService";
import { CurrencyService } from "./services/currencyService";
import { IdentityService } from "./services/identityService";
import { LocalStorageService } from "./services/localStorageService";
import { MilestonesClient } from "./services/milestonesClient";
import { NetworkService } from "./services/networkService";
import { NodeInfoService } from "./services/nodeInfoService";
import { SettingsService } from "./services/settingsService";
import { StardustApiClient } from "./services/stardust/stardustApiClient";
import { StardustFeedClient } from "./services/stardust/stardustFeedClient";
import { StardustTangleCacheService } from "./services/stardust/stardustTangleCacheService";

// Build config
const identityResolverEnabled = process.env.REACT_APP_IDENTITY_RESOLVER_ENABLED === "true";
const apiEndpoint = (window as any).env.API_ENDPOINT;

const config: IConfiguration = {
    apiEndpoint,
    identityResolverEnabled
}

initialiseServices().then(() => {
    ReactDOM.render(
        (
            <BrowserRouter>
                <Route
                    exact={true}
                    path="/:network?/:action?/:param1?/:param2?/:param3?/:param4?/:param5?"
                    component={(props: RouteComponentProps<AppRouteProps>) => (
                        <App {...props} config={config} />)}
                />

            </BrowserRouter>
        ),
        document.querySelector("#root")
    );
})
    .catch(err => console.error(err));

/**
 * Register all the services.
 */
async function initialiseServices(): Promise<void> {
    ServiceFactory.register(`api-client-${CHRYSALIS}`, () => new ChrysalisApiClient(config.apiEndpoint));
    ServiceFactory.register(`api-client-${STARDUST}`, () => new StardustApiClient(config.apiEndpoint));
    ServiceFactory.register("settings", () => new SettingsService());
    ServiceFactory.register("local-storage", () => new LocalStorageService());

    ServiceFactory.register("identity", () => new IdentityService());

    const networkService = new NetworkService();
    await networkService.buildCache();
    ServiceFactory.register("network", () => networkService);

    const nodeInfoService = new NodeInfoService();
    await nodeInfoService.buildCache();
    ServiceFactory.register("node-info", () => nodeInfoService);

    ServiceFactory.register("currency", () => new CurrencyService(config.apiEndpoint));
    ServiceFactory.register(`tangle-cache-${CHRYSALIS}`, () => new ChrysalisTangleCacheService());
    ServiceFactory.register(`tangle-cache-${STARDUST}`, () => new StardustTangleCacheService());

    const networks = networkService.networks();

    if (networks.length > 0) {
        for (const netConfig of networks) {
            if (netConfig.protocolVersion === STARDUST) {
                ServiceFactory.register(
                    `feed-${netConfig.network}`,
                    serviceName => new StardustFeedClient(config.apiEndpoint, serviceName.slice(5))
                );
            } else {
                ServiceFactory.register(
                    `feed-${netConfig.network}`,
                    serviceName => new ChrysalisFeedClient(config.apiEndpoint, serviceName.slice(5))
                );
            }

            ServiceFactory.register(
                `milestones-${netConfig.network}`,
                serviceName => new MilestonesClient(serviceName.slice(11), netConfig.protocolVersion)
            );
        }
    }
}
