import { useEffect, useState } from 'react';

function useDebounce(value: any, delay: number) {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes (user types again) or component unmounts
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run the effect if value or delay changes

  // Return the debounced value
  return debouncedValue;
}

export default useDebounce; // Export it so you can import it elsewhere