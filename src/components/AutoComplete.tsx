// Requirements: debounced input, cancel stale requests, keyboard navigation (up/down/enter/esc), highlight
// matches, loading/empty/error states, ARIA combobox roles, cache recent queries, limit results, handle click
// outside

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEventHandler,
} from "react";
import { SearchInput } from "./SearchInput";
import CitiesList from "./CitiesList";
import useDebounce from "../hooks/useDebounce";

const CITY_LIST: string[] = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Sri Ganganagar",
  "Hanumangarh",
  "Jodhpur",
  "Udaipur",
];

function AutoComplete() {
  const [cities, setCities] = useState<string[]>(CITY_LIST.slice(-5));
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedValue = useDebounce(value);

  const handleOnChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setValue(event.currentTarget.value);
    },
    [],
  );

  const filterCities = (value: string): void => {
    const normalizedValue = value.trim().toLowerCase();

    if (!normalizedValue) {
      setCities(CITY_LIST.slice(-5));
      return;
    }

    const filteredResults = CITY_LIST.filter((city) =>
      city.toLowerCase().includes(normalizedValue),
    );

    setCities(filteredResults);
  };

  const handleOnFocus: FocusEventHandler<HTMLInputElement> = useCallback(() => {
    setIsFocused(true);
  }, []);

  useEffect(() => {
    filterCities(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col relative">
      <SearchInput
        handleOnChange={handleOnChange}
        handleOnFocus={handleOnFocus}
      />
      {isFocused && <CitiesList cities={cities} />}
    </div>
  );
}

export default AutoComplete;
