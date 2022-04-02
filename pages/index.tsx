import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [pokemon, setPokemon] = useState<Record<string, any> | null>(null);
  const [search, setSearch] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);
  const [favs, setFavs] = useState<string[]>([]);

  const handleAddFav = (fav: string) => (e: any) => {
    if (favs.includes(fav)) {
      return
    }

    setFavs([...favs, fav]);
  };

  const handleDelFavClick = (fav: string) => (e: any) => {
    setFavs(favs.filter(_fav => _fav !== fav));
  };

  const handleSearchChange = (e: any) => {
    e.preventDefault();

    setSearch(e.target.value);
  };;

  useEffect(() => {
    if (search.length) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${search}`)
        .then((res) => res.json())
        .then(setPokemon)
        .catch((err) => {
          setError(err);
          setPokemon(null);
          console.error(err);
        });
    } else {
      setPokemon(null);
      setError(null);
    }
  }, [search]);
  return (
    <div className="container">
      <div className="search__container">
        <img src="/logo.svg" className="logo" />
        <div className="search__container-wrapper">
          <div className="search__card">
            <div className="search__input">
              <div className="search__icon">
                <img src="/search.svg" alt="" />
              </div>
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search"
                maxLength={50}
              />
              <div className="search__count">{search.length}/50</div>
            </div>
            {error && !pokemon && (
              <div className="search__not-found">Not found</div>
            )}
            {!error && !pokemon && (
              <div className="search__initial-text">
                Try search for Pokémon by their name
              </div>
            )}
            {pokemon && (
              <div className="pokemon">
                <div>
                  <img
                    className="pokemon__img"
                    src={
                      pokemon?.sprites?.other?.dream_world.front_default ?? ""
                    }
                    alt="not found"
                  />
                </div>

                <div className="pokemon__content">
                  <div className="pokemon__header">
                    <div className="pokemon__title">{pokemon.name}</div>
                    <img src="/fav.svg" onClick={handleAddFav(pokemon.name)} />
                  </div>

                  <div className="pokemon__attributes">
                    <div className="pokemon__attribute">
                      <div className="pokemon__attribute-key">Weight</div>
                      <div className="pokemon__attribute-value">
                        {pokemon.weight} kg
                      </div>
                    </div>
                    <div className="pokemon__attribute">
                      <div className="pokemon__attribute-key">Height</div>
                      <div className="pokemon__attribute-value">
                        {pokemon.height} cm
                      </div>
                    </div>
                  </div>

                  <div className="pokemon__versions">
                    <div className="pokemon__verions-title">Versions</div>
                    <div className="pokemon__version-items">
                      {pokemon.game_indices?.map?.((game_index: any) => (
                        <span
                          key={game_index?.game_index}
                          className="pokemon__pill"
                        >
                          <span className="pokemon__pill-text">
                            {game_index?.version?.name}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="favorite__container">
        <h2 className="favorite__title">Favorite</h2>
        <div className="favorite__items">
          {favs.map((fav) => (
            <div
              key={fav}
              className="favorite__item"
              data-fav-key={fav}
              onClick={handleDelFavClick(fav)}
            >
              {fav}
              <img src="/close.svg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
