import { useEffect, useState } from "react";
import { PokemonCards } from "./PokemonCards";
import "../index.css";

export const Pokemon = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [pokemonTypes, setPokemonTypes] = useState([]);

  const pokeApi = "https://pokeapi.co/api/v2/pokemon?limit=251";

  const fetchPokemon = async () => {
    try {
      const response = await fetch(pokeApi);
      const data = await response.json();

      const detailPokemonData = data.results.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        const data = await response.json();
        return data;
      });

      const detailedResults = await Promise.all(detailPokemonData);
      
      // Extract unique types
      const allTypes = new Set();
      detailedResults.forEach((pokemon) => {
        pokemon.types.forEach((type) => allTypes.add(type.type.name));
      });

      setPokemonTypes(["All", ...allTypes]); // Add "All" option at the top
      setPokemonData(detailedResults);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setError("Error fetching data. Try again.");
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  // Filter Pokémon based on search and type
  const filteredPokemon = pokemonData.filter((pokemon) => {
    const matchesSearch = pokemon.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === "All" || selectedType === "" || 
      pokemon.types.some((type) => type.type.name === selectedType);
    
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <section className="container">
        <h1>Pokemon</h1>
        <div className="pokemon-filters">
          <input
            type="text"
            placeholder="Search for a Pokemon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            {pokemonTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <ul className="cards">
          {filteredPokemon.map((pokemon) => (
            <PokemonCards key={pokemon.id} pokemon={pokemon} />
          ))}
        </ul>
      </section>
    </div>
  );
};
