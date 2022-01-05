import React from 'react';
import { HashLoader } from 'react-spinners';

class LoadingComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      size: 150
    }
  }
  render() {
    return (
      <div className='sweet-loading'>
        <HashLoader
          color={'#808080'} 
          loading={this.state.loading}
          size={this.state.size}
        />
      </div>
    )
  }
}

export default LoadingComponent;