import { useState, useEffect } from "react";

type DebouncedValue<T> = T | undefined;

function useDebounce<T>(value: T, delay: number): DebouncedValue<T> {
	const [debouncedValue, setDebouncedValue] =
		useState<DebouncedValue<T>>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

export default useDebounce;
