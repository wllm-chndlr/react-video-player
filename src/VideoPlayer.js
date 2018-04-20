import React, { Component } from "react";
import ControlButton from "./Components/Button";
import { Grid } from "semantic-ui-react";
import "./VideoPlayer.css";
import closedCaptioning from "./Assets/audio-eng.vtt";
import TimeFormat from 'hh-mm-ss';

class VideoPlayer extends Component {
  constructor() {
    super();

    this.state = {
      video: null,
      elapsed: "",
      progress: "",
      duration: "",
      playbackRate: 1,
      volume: 0.5,
      isMouseDown: false,
      isCaptionsEnabled: false,
      videoSource: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
    };
  }

  componentDidMount() {
    this.setState(
      {
        video: this.refs.video
      },
      () => {
        ["pause", "play"].forEach(event => {
          this.state.video.addEventListener(event, () => {
            this.forceUpdate();
          });
        });
        this.state.video.addEventListener("timeupdate", this.trackProgress);
      }
    );
  }

  play = () => {
    const { video } = this.state;
    video.play();
  }

  pause = () => {
    const { video } = this.state;
    video.pause();
  }

  toggleCaptions = () => {
    this.setState({
      isCaptionsEnabled: !this.state.isCaptionsEnabled
    })
  }

  trackProgress = () => {
    const { video } = this.state;
    const elapsed = TimeFormat.fromS(parseInt(video.currentTime), 'hh:mm:ss');
    const duration = TimeFormat.fromS(parseInt(video.duration), 'hh:mm:ss');
    const percent = video.currentTime / video.duration * 100;
    this.setState({
      elapsed: `${elapsed} / `,
      duration: `${duration}`,
      progress: `${percent.toFixed(0)}%`
    });
  }

  handleRangeUpdate = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
    this.refs.video[name] = value;
  }

  scrub = (e) => {
    const scrubTime =
      e.nativeEvent.offsetX /
      this.refs.video.clientWidth *
      this.refs.video.duration;
    if (!isNaN(scrubTime)) {
      this.refs.video.currentTime = scrubTime;
    }
  }

  startMouseDown = (e) => {
    this.setState({
      isMouseDown: true
    });
  }

  endMouseDown = (e) => {
    this.setState({
      isMouseDown: false
    });
  }

  skip = (e) => {
    const skipAmount = e.target.attributes[0].value;
    if (!isNaN(skipAmount)) {
      this.refs.video.currentTime += Number(skipAmount);
    }
  }

  render() {

    const {
      video,
      elapsed,
      duration,
      progress,
      playbackRate,
      volume
    } = this.state;

    return (
      
      <div className="video-player">
        
        <Grid centered columns={1}>
          <Grid.Column>
            <video
              ref="video"
              autoPlay
              loop
              src={this.state.videoSource}
              onClick={this.play}
            >
              {
                this.state.isCaptionsEnabled ? 
                  <track
                    ref='track'
                    id="cc"
                    label="English"
                    kind="subtitles"
                    srcLang="en"
                    src={closedCaptioning}
                    default
                  />
              : null }
            </video>
          </Grid.Column>
        </Grid>

        <Grid centered columns={1}>
          <Grid.Column >
            <div className='control-div'>
              <ControlButton
                basic
                inverted
                content="PLAY"
                color="yellow"
                onClick={this.play}
              />

              <ControlButton
                basic
                inverted
                content="PAUSE"
                color="yellow"
                onClick={this.pause}
              />

              <ControlButton
                basic
                inverted
                content="<<10s"
                color="yellow"
                data="-10"
                onClick={this.skip}
              />

              <ControlButton
                basic
                inverted
                content=">>10s"
                color="yellow"
                data="10"
                onClick={this.skip}
              />

              <ControlButton 
                basic 
                inverted 
                content="CC" 
                color="yellow"
                onClick={this.toggleCaptions}
                active={this.state.isCaptionsEnabled}
              />

              <div
                className="progress"
                onMouseDown={this.startMouseDown}
                onMouseUp={this.endMouseDown}
                onMouseLeave={this.endMouseDown}
                onMouseMove={e => this.state.isMouseDown && this.scrub(e)}
                onClick={this.scrub}
              >
                <div
                  className="progress_filled"
                  style={{ flexBasis: progress }}
                />
              </div>
                <p className='control-text duration-info'>Progress
                  <span>
                    {`${elapsed} ${duration}`}<br/>
                    {progress}
                  </span>
                </p>
                
              <div>
                <input
                  type="range"
                  name="volume"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={this.handleRangeUpdate}
                />
                <p className='control-text'>Volume</p>
              </div>

              <div>
                <input
                  type="range"
                  name="playbackRate"
                  min="0.2"
                  max="2"
                  step="0.1"
                  value={playbackRate}
                  onChange={this.handleRangeUpdate}
                />
                <p className='control-text'>Playback</p>
              </div>
            </div>
          </Grid.Column>
        </Grid>

      </div>

    );
  }
}

export default VideoPlayer;