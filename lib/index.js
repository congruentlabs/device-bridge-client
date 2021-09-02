var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v4 as uuidv4 } from 'uuid';
import { ErrorResponse, GetConnectedDevicesRequest, isResponseType, GetConnectedDevicesResponse } from '@congruent-labs/device-bridge-types';
class DeviceBridgeClient {
    constructor(originTarget) {
        this.originTarget = originTarget;
    }
    getConnectedDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            const requestId = uuidv4();
            const request = new GetConnectedDevicesRequest(requestId);
            return yield this.executeRequest(request, GetConnectedDevicesResponse);
        });
    }
    createInvalidTypeError(requestId) {
        return new ErrorResponse(requestId, '7e3e4f75-63ff-4b80-a68b-c7367a64c202', 'Response type not expected for this request.');
    }
    doWork(request) {
        return new Promise(function (resolve) {
            window.addEventListener('message', function listener(message) {
                if (message.data.requestId === request.requestId) {
                    window.removeEventListener('message', listener);
                    resolve(message.data);
                }
            });
        });
    }
    executeRequest(request, responseType) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.doWork(request);
            if (!isResponseType(response, responseType) && !isResponseType(response, ErrorResponse)) {
                if (request.requestId !== undefined) {
                    return this.createInvalidTypeError(request.requestId);
                }
                throw new Error('All responses must have a request Id.');
            }
            return response;
        });
    }
}
export default function (originTarget) {
    return new DeviceBridgeClient(originTarget);
}
