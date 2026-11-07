type CitiesListProps = {
  cities: string[];
  focusedCityIndex: null | number;
};

export default function CitiesList({
  cities,
  focusedCityIndex,
}: CitiesListProps) {
  return (
    <ul className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
      {cities.length === 0 ? (
        <li>No City Found</li>
      ) : (
        cities.map((city, index) => {
          return (
            <li
              key={index}
              className={`hover:bg-amber-50 ${focusedCityIndex === index && "bg-amber-50"}`}
            >
              {city}
            </li>
          );
        })
      )}
    </ul>
  );
}
