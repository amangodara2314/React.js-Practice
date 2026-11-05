type CitiesListProps = {
  cities: string[];
};

export default function CitiesList({ cities }: CitiesListProps) {
  return (
    <ul className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
      {cities.length === 0 ? (
        <li>No City Found</li>
      ) : (
        cities.map((city, index) => {
          return <li key={index}>{city}</li>;
        })
      )}
    </ul>
  );
}
