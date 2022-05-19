import { useState, useEffect, useRef } from "react";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import "./randomChar.scss";
import mjolnir from "../../resources/img/mjolnir.png";

const RandomChar = () => {
  const timerId = useRef(null);
  
  const [char, setChar] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const marvelService = new MarvelService();

  useEffect(() => {
    updateChar();
    timerId.current = setInterval(updateChar, 3000);
    return () => {
      clearInterval(timerId.current)
    }
  }, [])

  function onCharLoaded(char) {
    setChar(char);
    setLoading(false);
  };

  function onCharLoading() {
    setLoading(true);
    setError(false);
  }

  function updateChar() {
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
    onCharLoading()
    marvelService.getCharacter(id)
      .then(onCharLoaded)
      .catch(onError);
  };

  function onError() {
    setLoading(false);
    setError(true);
  }

  function onTryRandomChar() {
    clearInterval(timerId.current);
    updateChar();
  }
 
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error) ? <View char={char}/> : null;

  return (
    <div className="randomchar">
      {errorMessage}
      {spinner}
      {content}
      <div className="randomchar__static">
        <p className="randomchar__title">
          Random character for today!
          <br />
          Do you want to get to know him better?
        </p>
        <p className="randomchar__title">Or choose another one</p>
        <button className="button button__main" onClick={onTryRandomChar}>
          <div className="inner">try it</div>
        </button>
        <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
      </div>
    </div>
  );
  
}

const View = ({char: { name, description, thumbnail, homepage, wiki }}) => {
  const objectFitStyle = thumbnail.includes('image_not_available') ? 'contain' : 'cover'
  const imgStyles = {
    objectFit: objectFitStyle
  }

  return (
    <div className="randomchar__block">
      <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyles}/>
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">
          {description
            ? description.slice(0, 100) + "..."
            : "Description not found"}
        </p>
        <div className="randomchar__btns">
          <a href={homepage} className="button button__main">
            <div className="inner">homepage</div>
          </a>
          <a href={wiki} className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RandomChar;
