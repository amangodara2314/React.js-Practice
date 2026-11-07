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
  const [focusedCityIndex, setFocusedCityIndex] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

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

    const filteredResults = CITY_LIST.filter(
      (city) =>
        city.toLowerCase().includes(normalizedValue) &&
        city.toLowerCase() !== selectedCity?.toLowerCase(),
    );

    setCities(filteredResults);
  };

  const handleOnFocus: FocusEventHandler<HTMLInputElement> = useCallback(() => {
    setIsFocused(true);
  }, []);

  useEffect(() => {
    filterCities(debouncedValue);
  }, [debouncedValue, selectedCity]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    const handleArrowKey = (event: KeyboardEvent) => {
      if (
        ["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(event.key) &&
        cities.length
      ) {
        event.preventDefault();

        if (event.key === "Enter") {
          if (
            focusedCityIndex !== null &&
            cities[focusedCityIndex] !== undefined
          ) {
            setSelectedCity(cities[focusedCityIndex]);
          }
          return;
        }
        if (event.key === "Escape") {
          setFocusedCityIndex(null);
          setIsFocused(false);
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleArrowKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleArrowKey);
    };
  }, [cities, focusedCityIndex, selectedCity]);

  return (
    <div ref={containerRef} className="flex flex-col relative">
      {selectedCity && <p>Selected City: {selectedCity}</p>}
      <SearchInput
        handleOnChange={handleOnChange}
        handleOnFocus={handleOnFocus}
      />
      {isFocused && (
        <CitiesList cities={cities} focusedCityIndex={focusedCityIndex} />
      )}
    </div>
  );
}

export default AutoComplete;
