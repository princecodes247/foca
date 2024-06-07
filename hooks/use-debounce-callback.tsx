import { useCallback, useRef } from "react";

function useDebounceCallback<T extends (...args: any[]) => any>(
	callback: T,
	delay: number,
): (...args: Parameters<T>) => void {
	const timerRef = useRef<NodeJS.Timeout>();

	const debouncedCallback = useCallback(
		(...args: Parameters<T>) => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
			timerRef.current = setTimeout(() => {
				callback(...args);
			}, delay);
		},
		[callback, delay],
	);

	return debouncedCallback;
}

export default useDebounceCallback;
