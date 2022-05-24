import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import "./charList.scss";

const CharList = (props) => {
  const [chars, setChars] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);
 
  const {loading, error, getAllCharacters} = useMarvelService();

  useEffect(() => {
    onRequest(offset, true)
    // eslint-disable-next-line
  }, [])
  
  function onRequest(offset, initial) {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset)
      .then(onCharsLoaded);
  }

  function onCharsLoaded(newChars) {
    const ended = newChars.length < 9;

    setChars(chars => [...chars, ...newChars]);
    setNewItemLoading(false);
    setOffset(offset => offset + 9);
    setCharEnded(ended)
  };

  function renderChars() {
    return (
      <ul className="char__grid">
        {chars.map((char) => (
          <Char
            char={char}
            key={char.id}
            id={char.id}
            onCharSelected={props.onCharSelected}
          />
        ))}
      </ul>
    );
  }

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;
  const content = renderChars(chars)

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {content}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: charEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
  
}

function Char(props) {
  const {
    char: { name, thumbnail },
    id,
    onCharSelected,
  } = props;

  const charRef = useRef(null);

  const objectFitStyle = props.char.thumbnail.includes("image_not_available")
    ? "contain"
    : "unset";
  const imgStyles = {
    objectFit: objectFitStyle,
  };

  const setFocus = (char) => {
    char.classList.add('char__item_selected')
    char.focus()
  }

  return (
    <li
      className="char__item"
      id={id}
      ref={charRef}
      onClick={() => {
        onCharSelected(id)
        setFocus(charRef.current)}}
      tabIndex={0}
      onBlur={() => {charRef.current.classList.remove('char__item_selected')}}
    >
      <img src={thumbnail} alt={name} style={imgStyles} />
      <div className="char__name">{name}</div>
    </li>
  );
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
