import { v4 as uuidv4 } from 'uuid';
import {
  Request,
  Response,
  ErrorResponse,
  GetConnectedDevicesRequest,
  isResponseType,
  GetConnectedDevicesResponse
} from '@congruent-labs/device-bridge-types';

class DeviceBridgeClient {
  private readonly originTarget: string;

  constructor(originTarget: string) {
    this.originTarget = originTarget;
  }

  public async getConnectedDevices(): Promise<ErrorResponse | GetConnectedDevicesResponse> {
    const requestId = uuidv4();

    const request = new GetConnectedDevicesRequest(requestId);

    return await this.executeRequest(request, GetConnectedDevicesResponse);
  }

  private createInvalidTypeError(requestId: string): ErrorResponse {
    return new ErrorResponse(
      requestId,
      '7e3e4f75-63ff-4b80-a68b-c7367a64c202',
      'Response type not expected for this request.'
    );
  }

  private doWork(request: Request) {
    return new Promise<Response>(function (resolve) {
      window.addEventListener('message', function listener(message: MessageEvent<Response>) {
        if (message.data.requestId === request.requestId) {
          window.removeEventListener('message', listener);

          resolve(message.data);
        }
      });
    });
  }

  private async executeRequest<TRequest extends Request, TResponse extends Response>(
    request: TRequest,
    responseType: { new (): TResponse }
  ): Promise<ErrorResponse | TResponse> {
    const response: ErrorResponse | TResponse = await this.doWork(request);

    if (!isResponseType(response, responseType) && !isResponseType(response, ErrorResponse)) {
      if (request.requestId !== undefined) {
        return this.createInvalidTypeError(request.requestId);
      }

      throw new Error('All responses must have a request Id.');
    }

    return response;
  }
}

export default function (originTarget: string): DeviceBridgeClient {
  return new DeviceBridgeClient(originTarget);
}
