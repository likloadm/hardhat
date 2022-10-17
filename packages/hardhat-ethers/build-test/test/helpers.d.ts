import { HardhatRuntimeEnvironment } from "hardhat/types";
import "../src/internal/type-extensions";
declare module "mocha" {
    interface Context {
        env: HardhatRuntimeEnvironment;
    }
}
export declare function useEnvironment(fixtureProjectName: string, networkName?: string): void;
//# sourceMappingURL=helpers.d.ts.map