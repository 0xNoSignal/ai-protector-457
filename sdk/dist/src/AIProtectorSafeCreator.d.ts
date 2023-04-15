import { EthersAdapter } from "@safe-global/protocol-kit";
import { Signer } from "ethers";
declare class AIProtecotrSafeCreator {
    signer: Signer;
    aiProtectorAddress: string;
    proxyAddress: string;
    ethAdapter: EthersAdapter;
    constructor(signer: Signer, aiProtectorAddress: string, proxyAddress: string);
    createSafe(_owners: string[], threshold: number): Promise<any>;
}
export default AIProtecotrSafeCreator;
