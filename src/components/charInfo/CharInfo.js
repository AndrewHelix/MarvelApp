import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";
import MarvelService from "../../services/MarvelService";
import "./charInfo.scss";

const CharInfo = (props) => {
  const [char, setChar] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  
  const marvelService = new MarvelService();

  useEffect(() => {
    updateChar();
    // eslint-disable-next-line
  }, [props.charId])

  function updateChar() {
    const { charId } = props;
    if (!charId) {
      return;
    }

    onCharLoading();

    marvelService
      .getCharacter(charId)
      .then(onCharLoaded)
      .catch(onError);
  };

  function onCharLoaded(char) {
    setChar(char);
    setLoading(false);
  };

  function onCharLoading() {
    setLoading(true);
    setError(false);
  };

  function onError() {
    setLoading(false);
    setError(true);
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !char) ? <View char={char} /> : null;
  const skeleton = errorMessage || spinner || content ? null : <Skeleton />;

  return (
    <div className="char__info">
      {skeleton}
      {errorMessage}
      {spinner}
      {content}
    </div>
  );
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;
  const objectFitStyle = thumbnail.includes('image_not_available') ? 'contain' : 'cover'
  const imgStyles = {
    objectFit: objectFitStyle
  }

  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt={name} style={imgStyles}/>
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description || 'There is no description'}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
          {!comics.length ? 'There is no comics' : null}
        {comics.slice(0, 10).map((item, i) => (
          <li className="char__comics-item" key={i}>
            {item.name}
          </li>
        ))}
      </ul>
    </>
  );
};

CharInfo.propTypes = {
  charId: PropTypes.number,
}

export default CharInfo;
