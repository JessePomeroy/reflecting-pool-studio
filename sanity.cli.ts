import { defineCliConfig } from "sanity/cli";
import { clientConfig } from "./client.config";

export default defineCliConfig({
  api: {
    projectId: clientConfig.projectId,
    dataset: clientConfig.dataset,
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    /**
     * App ID for the deployed studio. Pinning this in client.config.ts means
     * `sanity deploy` runs non-interactively — important for CI / agent
     * sessions. For a fresh client studio, leave it empty on first deploy
     * and Sanity will prompt; then save the returned appId to client.config.ts.
     */
    appId: clientConfig.appId,
  },
});
