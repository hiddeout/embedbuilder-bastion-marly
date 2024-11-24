import React from 'react';
import { RegEx } from '../../constants';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      iconURL: ''
    };
  }

  updateText(event) {
    const value = event.target.value;
    this.setState({
      text: value
    }, () => {
      // Trigger regeneration of output after state update
      const outputComponent = document.querySelector('.Output');
      if (outputComponent) {
        outputComponent.generateJSON();
      }
    });
  }

  updateIconURL(event) {
    const value = event.target.value;
    let classNames = event.target.className.trim().split(' ');
    if (value.length && !RegEx.imageURL.test(value)) {
      classNames.push('invalid');
    }
    else {
      classNames.splice(classNames.indexOf('invalid'), 1);
    }
    event.target.className = [ ...new Set(classNames) ].join(' ').trim();

    this.setState({
      iconURL: value
    }, () => {
      // Trigger regeneration of output after state update
      const outputComponent = document.querySelector('.Output');
      if (outputComponent) {
        outputComponent.generateJSON();
      }
    });
  } 

  render() {
    return(
      <div className="embed-group embed-footer">
        <input 
          className="footer-icon-url"
          name="footer:icon_url"
          type="text"
          placeholder="Footer Icon URL"
          value={this.state.iconURL}
          onChange={this.updateIconURL.bind(this)}
          style={{ marginBottom: '10px', width: '100%' }}
        />
        <input 
          name="footer:text"
          type="text"
          placeholder="Footer Text"
          value={this.state.text}
          onChange={this.updateText.bind(this)}
          style={{ marginBottom: '10px', width: '100%' }}
        />
        <div className="embed-timestamp">
          <label>
            <input
              name="timestamp"
              type="checkbox"
            />
            Add Timestamp
          </label>
        </div>
      </div>
    );
  }
}

export default Footer;