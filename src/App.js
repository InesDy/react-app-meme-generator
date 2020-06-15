import React from "react";
import "./App.css";
import initialImage from './img/meme-initial.jpg'

export default class App extends React.Component {
    constructor(props){
    super(props);
       this.state = {
           topText: '',
           bottomText:'',
           memeImage: initialImage,

           memeTemplatesLoadingState: 'IDLE', // 'STARTED', 'SUCCEED', 'FAILED'
           memeTemplatesError: null,
           memeTemplates: [],

           currentImage: null,
       }
    };

  render() {
   const { topText, bottomText, memeImage, memeTemplatesLoadingState, memeTemplatesError } = this.state;

   const isLoading = memeTemplatesLoadingState  === 'IDLE' || memeTemplatesLoadingState === 'STARTED';
   const isError  = memeTemplatesError === 'FAILED';

   if(isLoading){
     return (
     <div className="react-meme-generator react-meme-generator--loading">
       loading...
     </div>
     );
   }
   if(isError){
     <div className="react-meme-generator react-meme-generator--error">
        ERROR: {memeTemplatesLoadingError}
     </div>
   }
   const { memeTemplates, currentImage }= this.state;

      return (
      <div className="react-meme-generator">
        <h1> Here is a plain image, add up text below!</h1>

        <div className="react-meme-generator__form">
          <input
            type="text"
            className="react-meme-generator__input"
            placeholder="Text top"
            onChange={(event) => {
                this.setState({topText: event.target.value})
            }}
          />

          <input
            type="text"
            className="react-meme-generator__input"
            placeholder="Text bottom"
            onChange={(event) => {
                this.setState({bottomText: event.target.value})
            }}
          />
          <br />

          <button 
          className="react-meme-generator__button"
          onClick={()=> {
            const nextCurrentImageValue= (currentImage === memeTemplates.length)
            ? 0
            : currentImage +1;

              this.setState({currentImage : nextCurrentImageValue});
          }}
          >
            Change picture
          </button>

          <button className="react-meme-generator__button">Upload image</button>

          <button className="react-meme-generator__button">DONE !</button>
        </div>

        <div className="react-meme-generator__meme-container">
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

          <img className="react-meme-generator__meme" 
          src={memeTemplates[currentImage].url} alt="" />
        </div>
      </div>
    );
  }

  compomentDidMount(){
    this.setState({
      memeTemplatesLoadingState= 'STARTED',
      },() => {
        fetch ('https://api.imgflip.com/get_memes')
        .then(response => response.json)
        .then (resultObject => {
          this.setState({
            memeTemplatesLoadingState: 'SUCCEED',
            memeTemplates: resultObject.data.memes,
            currentImage[0],
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
