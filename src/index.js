import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import VideoPlayer from './VideoPlayer';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<VideoPlayer />, document.getElementById('root'));
registerServiceWorker();
