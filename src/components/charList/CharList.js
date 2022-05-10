import { Component } from "react/cjs/react.development";
import PropTypes from "prop-types";
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import "./charList.scss";
import { render } from "@testing-library/react";

class CharList extends Component {
  state = {
    chars: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 210,
    charEnded: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }

  onRequest(offset) {
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharsLoaded)
      .catch(this.onError);
  }

  onCharListLoading() {
    this.setState({
      newItemLoading: true,
    });
  }

  onCharsLoaded = (newChars) => {
    const ended = newChars.length < 9;

    this.setState(({ chars, offset, charEnded }) => ({
      chars: [...chars, ...newChars],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };

  onError = () => {
    this.setState({ error: false });
  };

  renderChars() {
    return (
      <ul className="char__grid">
        {this.state.chars.map((char) => (
          <Char
            char={char}
            key={char.id}
            id={char.id}
            onCharSelected={this.props.onCharSelected}
          />
        ))}
      </ul>
    );
  }

  render() {
    const { error, loading, chars, newItemLoading, offset, charEnded } =
      this.state;

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? this.renderChars(chars) : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button
          className="button button__main button__long"
          disabled={newItemLoading}
          style={{ display: charEnded ? "none" : "block" }}
          onClick={() => this.onRequest(offset)}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

class Char extends Component {
  objectFitStyle = this.props.char.thumbnail.includes("image_not_available")
    ? "contain"
    : "unset";
  imgStyles = {
    objectFit: this.objectFitStyle,
  };

  setCharRef = (elem) => {
    this.charRef = elem;
  }

  setFocus = (char) => {
    char.classList.add('char__item_selected')
    char.focus()
  }

  render() {
    const {
      char: { name, thumbnail },
      id,
      onCharSelected,
    } = this.props;

    return (
      <li
        className="char__item"
        id={id}
        ref={this.setCharRef}
        onClick={() => {
          onCharSelected(id)
          this.setFocus(this.charRef)}}
        tabIndex={0}
        onBlur={() => {this.charRef.classList.remove('char__item_selected')}}
      >
        <img src={thumbnail} alt={name} style={this.imgStyles} />
        <div className="char__name">{name}</div>
      </li>
    );
  }
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
