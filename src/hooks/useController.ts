import {
  RequestState,
} from '../../typings';
import Method from '../methods/Method';
import {
  createRequestState,
  ErrorHandler,
  noop,
  SuccessHandler,
  useHookRequest
} from '../utils/helper';
import { UseHookConfig } from './useRequest';

export default function useController<S extends RequestState, E extends RequestState, R, T>(method: Method<S, E, R, T>, { force }: UseHookConfig = {}) {
  let originalState: S;
  let successHandlers: SuccessHandler[];
  let errorHandlers: ErrorHandler[];
  let setCtrl: Function = noop;
  return {
    ...createRequestState(method, (originalStateRaw, successHandlersRaw, errorHandlersRaw, setCtrlRaw) => {
      originalState = originalStateRaw;
      successHandlers = successHandlersRaw;
      errorHandlers = errorHandlersRaw;
      setCtrl = setCtrlRaw;
    }),
    
    // 通过执行该方法来手动发起请求
    send() {
      const ctrl = useHookRequest(method, originalState, successHandlers, errorHandlers, force);
      setCtrl(ctrl);    // 将控制器传出去供使用者调用
    },
  };
}