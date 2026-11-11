import {
  type ChangeEvent,
  type FocusEventHandler,
  type KeyboardEvent,
} from "react";

type SearchInputProps = {
  handleOnChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleOnFocus: FocusEventHandler<HTMLInputElement>;
  handleOnKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  isFocused: boolean;
  focusedCityIndex: number | null;
};

export function SearchInput({
  handleOnChange,
  handleOnFocus,
  handleOnKeyDown,
  isFocused,
  focusedCityIndex,
}: SearchInputProps) {
  return (
    <>
      <input
        className="px-2 py-3 border border-black rounded-2xl"
        name="search-input"
        id="search-input"
        onChange={handleOnChange}
        onFocus={handleOnFocus}
        onKeyDown={handleOnKeyDown}
        role="combobox"
        aria-label="Search cities"
        aria-controls="cities-list"
        aria-expanded={isFocused}
        aria-autocomplete="list"
        aria-activedescendant={
          focusedCityIndex !== null
            ? `city-option-${focusedCityIndex}`
            : undefined
        }
      />
    </>
  );
}
