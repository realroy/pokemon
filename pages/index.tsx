import type { NextPage } from "next";
import {
  ChangeEventHandler,
  FC,
  MouseEventHandler,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const Home: NextPage = () => {
  let ref: MutableRefObject<FavoriteRefObject> | null = null;

  const onFavoriteClick = useCallback(
    (favorite: string) => {
      if (ref?.current.addFavorite) {
        ref.current.addFavorite(favorite);
      }
    },
    [ref]
  );

  return (
    <div className="container">
      <SearchSection onFavoriteClick={onFavoriteClick} />
      <FavoriteSection setFavoritesRef={(favoriteRef) => (ref = favoriteRef)} />
    </div>
  );
};

export default Home;

type SearchSectionProps = {
  onFavoriteClick: (name: string) => any;
};

const SearchSection: FC<SearchSectionProps> = (props) => {
  const [state, setState] = useState({
    pokemon: null as Record<string, any> | null,
    search: "",
    loading: false,
    error: null as Error | null,
  });

  const { search, pokemon, error, loading } = state;
  const { onFavoriteClick } = props;

  useEffect(() => {
    async function fetchData() {
      if (!search.length) {
        return setState((s) => ({ ...s, pokemon: null, error: null }));
      }

      setState((s) => ({ ...s, loading: true }));

      try {
        const url = `https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`;

        const res = await fetch(url);
        const pokemon = await res.json();

        setState((s) => ({ ...s, pokemon, error: null, loading: false }));
      } catch (error) {
        setState((s) => ({
          ...s,
          pokemon: null,
          error: error as Error,
          loading: false,
        }));
      }

      return;
    }

    fetchData();
  }, [search]);

  const isShowNotfound = error && !pokemon && !loading;
  const isShowPlaceholder = !error && !pokemon && !loading;
  const isShowPokemon = !!pokemon && !loading;
  const isShowLoading = loading;

  const handleFavoriteClick: MouseEventHandler = useCallback(
    (e) => {
      if (pokemon?.name?.length) {
        onFavoriteClick(pokemon?.name);
      }

      e.preventDefault();
    },
    [pokemon, onFavoriteClick]
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setState((oldState) => ({ ...oldState, search: e.target.value }));

      e.preventDefault();
    },
    []
  );

  const img = pokemon?.sprites?.other?.dream_world?.front_default ?? "";

  return (
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
              onChange={handleChange}
              placeholder="Search"
              maxLength={50}
            />
            <div className="search__count">{search.length}/50</div>
          </div>
          {isShowNotfound && <div className="search__not-found">Not found</div>}
          {isShowPlaceholder && (
            <div className="search__initial-text">
              Try search for Pokémon by their name
            </div>
          )}
          {isShowLoading && <div className="search__initial-text">Loading</div>}
          {isShowPokemon && (
            <div className="pokemon">
              <div>
                <img className="pokemon__img" src={img} alt="not found" />
              </div>

              <div className="pokemon__content">
                <div className="pokemon__header">
                  <div className="pokemon__title">{pokemon?.name}</div>
                  <img src="/fav.svg" onClick={handleFavoriteClick} />
                </div>

                <div className="pokemon__attributes">
                  <div className="pokemon__attribute">
                    <div className="pokemon__attribute-key">Weight</div>
                    <div className="pokemon__attribute-value">
                      {pokemon?.weight} kg
                    </div>
                  </div>
                  <div className="pokemon__attribute">
                    <div className="pokemon__attribute-key">Height</div>
                    <div className="pokemon__attribute-value">
                      {pokemon?.height} cm
                    </div>
                  </div>
                </div>

                <div className="pokemon__versions">
                  <div className="pokemon__verions-title">Versions</div>
                  <div className="pokemon__version-items">
                    {pokemon?.game_indices?.map?.((gameIndex: any) => (
                      <span
                        key={gameIndex?.game_index}
                        className="pokemon__pill"
                      >
                        <span className="pokemon__pill-text">
                          {gameIndex?.version?.name}
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
  );
};

type FavoriteRefObject = {
  addFavorite: (favorite: string) => any;
};

type FavoriteSectionProps = {
  setFavoritesRef: (ref: MutableRefObject<FavoriteRefObject>) => any;
};

const FavoriteSection: FC<FavoriteSectionProps> = (props) => {
  const { setFavoritesRef } = props;
  const [favorites, setFavorites] = useState<string[]>([]);

  const addFavorite = useCallback(
    (favorite: string) => {
      setFavorites((oldFavorites) => {
        if (oldFavorites.includes(favorite)) {
          return oldFavorites;
        }

        return [...oldFavorites, favorite];
      });
    },
    [setFavorites]
  );

  const handleDeleteFavoriteClick = useCallback(
    (newFavorite: string) => {
      setFavorites((oldFavorites) =>
        oldFavorites.filter((favorite) => favorite !== newFavorite)
      );
    },
    [setFavorites]
  );

  const ref = useRef({ addFavorite });

  useEffect(() => {
    setFavoritesRef(ref);
  }, [setFavoritesRef]);

  return (
    <div className="favorite__container">
      <h2 className="favorite__title">Favorite</h2>
      <div className="favorite__items">
        {favorites?.map?.((favorite) => (
          <FavoriteItem
            key={favorite}
            text={favorite}
            onDeleteClick={handleDeleteFavoriteClick}
          />
        ))}
      </div>
    </div>
  );
};

type FavoriteItemProps = {
  text: string;
  onDeleteClick: (key: string) => any;
};

const FavoriteItem: FC<FavoriteItemProps> = (props) => {
  const { text, onDeleteClick } = props;
  const handleClick: MouseEventHandler = useCallback(
    (e) => {
      onDeleteClick(text);
      e.preventDefault();
    },
    [onDeleteClick, text]
  );

  return (
    <div className="favorite__item" onClick={handleClick}>
      {props.text}
      <img src="/close.svg" />
    </div>
  );
};
