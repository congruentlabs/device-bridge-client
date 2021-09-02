import { ErrorResponse, GetConnectedDevicesResponse } from '@congruent-labs/device-bridge-types';
declare class DeviceBridgeClient {
    private readonly originTarget;
    constructor(originTarget: string);
    getConnectedDevices(): Promise<ErrorResponse | GetConnectedDevicesResponse>;
    private createInvalidTypeError;
    private doWork;
    private executeRequest;
}
export default function (originTarget: string): DeviceBridgeClient;
export {};
