import { Component } from "react/cjs/react.development";
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import "./charList.scss";


class CharList extends Component {
  state = {
    chars: [],
    loading: true,
    error: false,
  };

  componentDidMount() {
    const marvelService = new MarvelService();
    marvelService.getAllCharacters()
      .then(this.onCharsLoaded)
      .catch(this.onError)
  }

  onCharsLoaded = (chars) => {
    this.setState({
      chars,
      loading: false,
    })
  }

  onError = () => {
    this.setState({error: false})
  }

  renderChars() {
    return(
      <ul className="char__grid">
          {
              this.state.chars.map(char => <Char char={char} key={char.id}/>)
          }
      </ul>
    )
  }

  render() {
    const {error, loading, chars} = this.state;

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? this.renderChars(chars) : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

const Char = ({char: { name, thumbnail }}) => {
  const objectFitStyle = thumbnail.includes('image_not_available') ? 'contain' : 'unset'
  const imgStyles = {
    objectFit: objectFitStyle
  }

  return (
    <li className="char__item">
      <img src={thumbnail} alt={name} style={imgStyles}/>
      <div className="char__name">{name}</div>
    </li>
  );
};

export default CharList;
