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
  const [sortOrder, setSortOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const pokeApi = "https://pokeapi.co/api/v2/pokemon?limit=600";
  
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
      
      const allTypes = new Set();
      detailedResults.forEach((pokemon) => {
        pokemon.types.forEach((type) => allTypes.add(type.type.name));
      });
      
      setPokemonTypes(["All", ...allTypes]);
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

  // Sorted Pokémon based on search and type
  const sortedPokemon = [...filteredPokemon].sort((a, b) => {
    if (sortOrder === "name-asc") return a.name.localeCompare(b.name);
    if (sortOrder === "name-desc") return b.name.localeCompare(a.name);
    if (sortOrder === "id-asc") return a.id - b.id;
    if (sortOrder === "id-desc") return b.id - a.id;
    return 0;
  });

  // Paginate Pokémon on frontend
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPokemon = sortedPokemon.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(sortedPokemon.length / itemsPerPage);
  
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  
  if (isLoading) return <h1>Loading...</h1>;
  if (error) return <h1>{error}</h1>;
  
  return (
    <div>
      <section className="container">
        <h1>Pokemon</h1>
        <div className="pokemon-filters">
          <input type="text" placeholder="Search for a Pokemon" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            {pokemonTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="default">Sort By</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="id-asc">ID (Low to High)</option>
            <option value="id-desc">ID (High to Low)</option>
          </select>
        
        </div>
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
        </div>
      
        <ul className="cards">
          {paginatedPokemon.map((pokemon) => (
            <PokemonCards key={pokemon.id} pokemon={pokemon} />
          ))}
        </ul>
        
        
      </section>
    </div>
  );
};
