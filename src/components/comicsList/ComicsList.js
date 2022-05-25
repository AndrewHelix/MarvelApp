import "./comicsList.scss";
import { useState, useEffect } from "react";
import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const ComicsList = () => {
  const [comics, setComics] = useState([]);
  const [offset, setOffset] = useState(0);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [comicsEnded, setComicsEnded] = useState(false);

  const { loading, error, getAllComics } = useMarvelService();

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(true) : setNewItemLoading(false);
    getAllComics(offset).then(onComicsLoaded);
  };

  const onComicsLoaded = (newComics) => {
    if (newComics.length < 8) {
      setComicsEnded(true);
    }
    setComics([...comics, ...newComics]);
    setOffset((offset) => offset + 8);
    setNewItemLoading(false);
  };

  return (
    <div className="comics__list">
      <ul className="comics__grid">
        {errorMessage}
        {comics.map((el) => (
          <View comic={el} />
        ))}
        {spinner}
      </ul>
      <button
        disabled={newItemLoading}
        className="button button__main button__long"
        style={{ display: comicsEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

const View = ({ comic: { title, price, thumbnail } }) => {
  return (
    <li className="comics__item">
      <a href="#">
        <img src={thumbnail} alt={title} className="comics__item-img" />
        <div className="comics__item-name">{title}</div>
        <div className="comics__item-price">{price}</div>
      </a>
    </li>
  );
};

export default ComicsList;
