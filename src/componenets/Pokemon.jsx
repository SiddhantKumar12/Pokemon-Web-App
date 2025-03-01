import { useEffect, useState } from "react";

import "../index.css";

export const Pokemon = () => {
  const [pokemonData, setPokemonData] = useState([]);

  const pokeApi = "https://pokeapi.co/api/v2/pokemon?limit=151";
  //   const bool isLoading = true;

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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  return (
    <div>
      <h1>Pokemon</h1>
    </div>
  );
};
