import React from 'react';

class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [], // Initialize with an empty array of buttons
    };
  }

  addButton = () => {
    this.setState((prevState) => {
      if (prevState.buttons.length >= 5) return prevState; // Prevent adding more than 5 buttons

      const newButton = {
        id: prevState.buttons.length,
        label: '',
        url: '',
      };

      return {
        buttons: [...prevState.buttons, newButton],
      };
    });
  };

  removeButton = () => {
    this.setState((prevState) => {
      if (prevState.buttons.length === 0) return prevState; // No buttons to remove

      return {
        buttons: prevState.buttons.slice(0, -1), // Remove the last button
      };
    });
  };

  handleLabelChange = (id, event) => {
    const newLabel = event.target.value;
    this.setState((prevState) => ({
      buttons: prevState.buttons.map((button) =>
        button.id === id ? { ...button, label: newLabel } : button
      ),
    }));
  };

  handleURLChange = (id, event) => {
    const newURL = event.target.value;
    this.setState((prevState) => ({
      buttons: prevState.buttons.map((button) =>
        button.id === id ? { ...button, url: newURL } : button
      ),
    }));
  };

  render() {
    const { buttons } = this.state;
    const isAddDisabled = buttons.length >= 5;
    const isRemoveDisabled = buttons.length <= 0;

    return (
      <div className="embed-group embed-buttons">
        <div id="buttons">
          {buttons.map((button, index) => (
            <div
              key={button.id}
              id={`button-${button.id}`}
              className="embed-group"
              style={{ display: 'inline-block', marginTop: '0', width: '50%' }}
            >
              <div className="button">
                <input
                  type="text"
                  name={`button-${button.id}:label`}
                  maxLength="256"
                  placeholder={`Button ${index + 1} Label`}
                  value={button.label}
                  onChange={(e) => this.handleLabelChange(button.id, e)}
                />
                <textarea
                  name={`button-${button.id}:url`}
                  maxLength="512"
                  placeholder={`Button ${index + 1} URL`}
                  value={button.url}
                  onChange={(e) => this.handleURLChange(button.id, e)}
                ></textarea>
              </div>
            </div>
          ))}
        </div>
        <div className="embed-group-controls">
          <button
            id="btn-addButton"
            type="button"
            onClick={this.addButton}
            disabled={isAddDisabled}
          >
            <span role="img" aria-label="Add Button">
              ➕
            </span>
            &ensp;Add Button
          </button>
          <button
            id="btn-removeButton"
            type="button"
            onClick={this.removeButton}
            disabled={isRemoveDisabled}
          >
            <span role="img" aria-label="Remove Button">
              ➖
            </span>
            &ensp;Remove Button
          </button>
        </div>
      </div>
    );
  }
}

export default Buttons;