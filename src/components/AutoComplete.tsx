// Requirements: debounced input, cancel stale requests, keyboard navigation (up/down/enter/esc), highlight
// matches, loading/empty/error states, ARIA combobox roles, cache recent queries, limit results, handle click
// outside

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEventHandler,
  type KeyboardEvent,
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
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedValue = useDebounce(value);
  const [focusedCityIndex, setFocusedCityIndex] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const handleOnChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setValue(event.currentTarget.value);
      if (!isFocused) {
        setIsFocused(true);
      }
    },
    [],
  );

  const cities = useMemo(() => {
    const query = debouncedValue.trim().toLowerCase();

    return CITY_LIST.filter((city) => {
      const matchesQuery = city.toLowerCase().includes(query);

      const isNotSelected = city.toLowerCase() !== selectedCity?.toLowerCase();

      return matchesQuery && isNotSelected;
    }).slice(0, 8);
  }, [debouncedValue, selectedCity]);

  const handleOnFocus: FocusEventHandler<HTMLInputElement> = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleOnKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isFocused) return;
      if (["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(event.key)) {
        event.preventDefault();

        if (event.key === "Escape") {
          setFocusedCityIndex(null);
          setIsFocused(false);
        }

        if (!cities.length) {
          return;
        }

        if (event.key === "Enter") {
          if (
            focusedCityIndex !== null &&
            cities[focusedCityIndex] !== undefined
          ) {
            setSelectedCity(cities[focusedCityIndex]);
            setValue(cities[focusedCityIndex]);
            setIsFocused(false);
            setFocusedCityIndex(null);
          }
          return;
        }

        setFocusedCityIndex((prev) => {
          if (prev === null) {
            return event.key === "ArrowDown" ? 0 : cities.length - 1;
          }

          if (event.key === "ArrowDown") {
            return prev === cities.length - 1 ? 0 : prev + 1;
          }

          return prev === 0 ? cities.length - 1 : prev - 1;
        });
      }
    },
    [isFocused, cities, focusedCityIndex, selectedCity],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
        setFocusedCityIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setFocusedCityIndex(null);
  }, [debouncedValue]);

  return (
    <div ref={containerRef} className="flex flex-col relative">
      {selectedCity && <p>Selected City: {selectedCity}</p>}
      <SearchInput
        handleOnChange={handleOnChange}
        handleOnFocus={handleOnFocus}
        handleOnKeyDown={handleOnKeyDown}
        isFocused={isFocused}
        focusedCityIndex={focusedCityIndex}
      />
      {isFocused && (
        <CitiesList cities={cities} focusedCityIndex={focusedCityIndex} />
      )}
    </div>
  );
}

export default AutoComplete;
