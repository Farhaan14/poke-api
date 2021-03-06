import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Card from './components/Card';
import { getAllPokemon, getPokemon } from './helper';
import './App.css';
import {Link} from 'react-router-dom'

function App() {
  const [pokemonData, setPokemonData] = useState([])
  const [nextUrl, setNextUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const initialURL = 'https://pokeapi.co/api/v2/pokemon'

  useEffect(() => {
    async function fetchData() {
      let response = await getAllPokemon(initialURL)
      setNextUrl(response.next);
      setPrevUrl(response.previous);
      await loadPokemon(response.results);
      setLoading(false);
    }
    fetchData();
  }, [])

  const next = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  }

  const prev = async () => {
    if (!prevUrl) return;
    setLoading(true);
    let data = await getAllPokemon(prevUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  }

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(data.map(async pokemon => {
      let pokemonRecord = await getPokemon(pokemon)
      return pokemonRecord
    }))
    setPokemonData(_pokemonData);
  }

  return (
    <>
      <Navbar />
      <>
        {loading ? <h1 style={{ textAlign: 'center' }}>Loading...</h1> : (
          <>
            <div className="card-container">
              {pokemonData.map((pokemon, i) => {
                return <React.Fragment key={i}>
                          <Link to={`/details`} key={i} state={{ pokemon: pokemon }}>
                            <Card key={pokemon.name} pokemon={pokemon}/>
                          </Link>
                      </React.Fragment>
              })}
            </div>
            <div className="btn-cont">
              <button onClick={prev} className="btn">Prev</button>
              <button onClick={next} className="btn">Next</button>
            </div>
          </>
        )}
      </>

      
    </>
  );
}

export default App;