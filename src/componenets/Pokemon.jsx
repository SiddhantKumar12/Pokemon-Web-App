import { useEffect, useState } from "react";
import { PokemonCards } from "./PokemonCards";
import "../index.css";

export const Pokemon = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const pokeApi = "https://pokeapi.co/api/v2/pokemon?limit=251";

  const fetchPokemon = async () => {
    try {
      const response = await fetch(pokeApi);
      const data = await response.json();

      const detailPokemonData = data.results.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        const data = await response.json();
        // console.log(data);
        return data;
      });
      const detailedResults = await Promise.all(detailPokemonData);
      console.log(detailedResults);
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

  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <h1>{error}</h1>
      </div>
    );
  }
  return (
    <div>
      <section className="container">
        <h1>Pokemon</h1>
        <ul className="cards">
          {pokemonData.map((pokemon) => (
            <PokemonCards key={pokemon.id} pokemon={pokemon} />
          ))}
        </ul>
      </section>
    </div>
  );
};
