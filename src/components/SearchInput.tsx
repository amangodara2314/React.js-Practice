import { type ChangeEvent, type FocusEventHandler } from "react";

type SearchInputProps = {
  handleOnChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleOnFocus: FocusEventHandler<HTMLInputElement>;
};

export function SearchInput({
  handleOnChange,
  handleOnFocus,
}: SearchInputProps) {
  return (
    <>
      <input
        className="px-2 py-3 border border-black rounded-2xl"
        name="search-input"
        onChange={handleOnChange}
        onFocus={handleOnFocus}
      />
    </>
  );
}
