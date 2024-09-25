import useMemoizedFn from "ahooks/es/useMemoizedFn";
import useUpdateEffect from "ahooks/es/useUpdateEffect";
import React from "react";

type Dispatch<A, B> = (a: A, c?: B) => void;

/**类似class的setState 有一个监听设置值成功之后的回调**/
export function useStateCallback<T>() {
  const [state, _setState] = React.useState<T>();
  const targetRef = React.useRef<EventTarget>(new EventTarget());
  useUpdateEffect(() => {
    targetRef.current.dispatchEvent(
      new CustomEvent("state-change", { detail: state })
    );
  }, [state]);

  const setState: Dispatch<
    React.SetStateAction<T | undefined>,
    (state: T) => void
  > = useMemoizedFn((a, callback) => {
    _setState(a);
    callback &&
      targetRef.current.addEventListener(
        "state-change",
        (e) => {
          callback?.((e as CustomEvent<T>).detail);
        },
        { once: true }
      );
  });

  return [state, setState] as const;
}
