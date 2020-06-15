import React from 'react';
import domtoimage from 'dom-to-image';

import './App.css';

import initialImage from './img/meme-initial.jpg';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topText: '',
      bottomText: '',
      memeImage: initialImage,

      memeTemplatesLoadingState: 'IDLE', // 'STARTED', 'SUCCEED', 'FAILED'
      memeTemplatesLoadingError: null,
      memeTemplates: [],

      currentImage: null,

      loadedImage: null,

      generatedImage: null
    };

    this.elementThatWeWantToConvertToImage = React.createRef();
  }

  render() {
    const {
      topText,
      bottomText,
      memeTemplatesLoadingState,
      memeTemplatesLoadingError,
    } = this.state;

    const isLoading = memeTemplatesLoadingState === 'IDLE' || memeTemplatesLoadingState === 'STARTED';
    const isError = memeTemplatesLoadingState === 'FAILED';

    if (isLoading) {
      return (
        <div className="react-meme-generator react-meme-generator--loading">
          Loading...
        </div>
      );
    }

    if (isError) {
      return (
        <div className="react-meme-generator react-meme-generator--error">
          ERROR: {memeTemplatesLoadingError}
        </div>
      );
    }

    const { memeTemplates, currentImage, loadedImage, generatedImage } = this.state;

    return (
      <div className="react-meme-generator">
          <h1>I Can Has Memes?</h1>

          <div className="react-meme-generator__form">
            <input
              value={topText}
              onChange={(event) => {
                this.setState({ topText: event.target.value })
              }}
              type="text"
              className="react-meme-generator__input"
              placeholder="Text Top"
            />

            <input
              value={bottomText}
              onChange={(event) => {
                this.setState({ bottomText: event.target.value })
              }}
              type="text"
              className="react-meme-generator__input"
              placeholder="Text Bottom"
            />

            <br/>

            <button
              onClick={() => {
                const nextCurrentImageValue = (currentImage === memeTemplates.length)
                    ? 0
                    : currentImage + 1;

                this.setState({ currentImage: nextCurrentImageValue, loadedImage: null });
              }}
              className="react-meme-generator__button"
            >
              Change picture
            </button>



            <label
              className="react-meme-generator__button"
            >
              <input
                type="file"
                accept="image/png, image/jpeg"
                hidden={true}
                onChange={(event) => {
                  const inputElement = event.target;
                  const file = inputElement.files[0]; // Instance of File (https://developer.mozilla.org/en-US/docs/Web/API/File)
                  const fileAsBase64URLString = URL.createObjectURL(file);

                  this.setState({
                    loadedImage: fileAsBase64URLString,
                  })
                }}
              />

              Upload image
            </label>

            <button
              className="react-meme-generator__button"
              onClick={() => {
                const node = this.elementThatWeWantToConvertToImage.current;

                domtoimage
                  .toPng(node)
                  .then((dataUrl) => {
                      this.setState({
                        generatedImage: dataUrl
                      })
                  });
              }}
            >
              Generate
            </button>
          </div>

          <div
            ref={(this.elementThatWeWantToConvertToImage)}
            className="react-meme-generator__meme-container"
          >
            <h2
              className="
                react-meme-generator__meme-text
                react-meme-generator__meme-text--top
              "
            >
              {topText}
            </h2>

            <h2
              className="
                react-meme-generator__meme-text
                react-meme-generator__meme-text--bottom
              "
            >
              {bottomText}
            </h2>

            <img
              className="react-meme-generator__meme"
              src={loadedImage ? loadedImage : memeTemplates[currentImage].url}
              alt=""
            />
          </div>

          {generatedImage && (
            <img src={generatedImage} alt=""/>
          )}
      </div>
    );
  }

  componentDidMount() {
    this.setState({
      memeTemplatesLoadingState: 'STARTED',
    }, () => {
      fetch('https://api.imgflip.com/get_memes')
        .then(response => response.json())
        .then(resultObject => {
          this.setState({
            memeTemplatesLoadingState: 'SUCCEED',
            memeTemplates: resultObject.data.memes,
            currentImage: 0,
          });
        })
        .catch(error => {
          this.setState({
            memeTemplatesLoadingState: 'FAILED',
            memeTemplatesLoadingError: error.message,
          });
        });
    })
  }
}
