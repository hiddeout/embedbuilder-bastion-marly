import React from 'react';
import { RegEx } from '../constants';

class Output extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      embedScript: ''
    };
  }

  generateJSON() {
    let form = document.getElementById('embed-builder');
    if (!form) {
      console.error('Could not find form with ID "embed-builder"');
      return;
    }

    // Start with empty script
    let embedScript = '';

    // Message
    let messageElement = form.elements['message'];
    if (messageElement?.value) {
      embedScript += `$v{message: ${messageElement.value}}\n`;
    }
  
    // Embed start
    embedScript += '{embed}\n';
  
    // Color (default to #00000 if not specified)
    let colorElement = form.elements['color'];
    let color = colorElement && colorElement.value ? `#${colorElement.value}` : '#00000';
    embedScript += `$v{color: ${color}}\n`;

    // Author
    let authorNameElement = form.elements['author:name'];
    if (authorNameElement && authorNameElement.value) {
      let author_parts = [authorNameElement.value];
      
      let author_icon_url = form.elements['author:icon_url']?.value;
      if (author_icon_url && RegEx.imageURL.test(author_icon_url)) {
        author_parts.push(`${author_icon_url}`);
        
        let author_url = form.elements['author:url']?.value;
        if (author_url && RegEx.URL.test(author_url)) {
          author_parts.push(`${author_url}`);
        }
      }
      embedScript += `$v{author: ${author_parts.join(' && ')}}\n`;
    }

    // Title
    let titleElement = form.elements['title'];
    if (titleElement?.value) {
      embedScript += `$v{title: ${titleElement.value}}\n`;
    }

    // URL
    let urlElement = form.elements['url'];
    if (urlElement?.value && RegEx.URL.test(urlElement.value)) {
      embedScript += `$v{url: ${urlElement.value}}\n`;
    }

    // Description
    let descriptionElement = form.elements['description'];
    if (descriptionElement?.value) {
      embedScript += `$v{description: ${descriptionElement.value}}\n`;
    }

    // Fields
    let fieldsContainer = document.getElementById('fields');
    if (fieldsContainer?.children.length) {
      for (let i = 0; i < fieldsContainer.children.length; i++) {
        let fieldName = form.elements[`field-${i}:name`]?.value;
        let fieldValue = form.elements[`field-${i}:value`]?.value;
        let fieldInline = form.elements[`field-${i}:inline`]?.checked;
  
        if (fieldName && fieldValue) {
          embedScript += `$v{field: ${fieldName} && ${fieldValue}${fieldInline ? ' && inline' : ''}}\n`;
        }
      }
    }

    // Buttons
    let buttonsContainer = document.getElementById('buttons');
    if (buttonsContainer?.children.length) {
      for (let i = 0; i < buttonsContainer.children.length; i++) {
        let buttonLabel = form.elements[`button-${i}:label`]?.value;
        let buttonUrl = form.elements[`button-${i}:url`]?.value;
        let buttonEmoji = form.elements[`button-${i}:emoji`]?.value;

        if (buttonUrl && buttonLabel) {
          let buttonParts = [
            `${buttonUrl}`,
            buttonLabel
          ];
          if (buttonEmoji) {
            buttonParts.push(buttonEmoji);
          }
          embedScript += `$v{button: ${buttonParts.join(' && ')}}\n`;
        }
      }
    }

    // Thumbnail
    let thumbnailElement = form.elements['thumbnail:url'];
    if (thumbnailElement?.value && RegEx.imageURL.test(thumbnailElement.value)) {
      embedScript += `$v{thumbnail: ${thumbnailElement.value}}\n`;
    }

    // Image
    let imageElement = form.elements['image:url'];
    if (imageElement?.value && RegEx.imageURL.test(imageElement.value)) {
      embedScript += `$v{image: ${imageElement.value}}\n`;
    }

    // Footer
    let footerTextElement = form.elements['footer:text'];
    let footerIconElement = form.elements['footer:icon_url'];
    if (footerTextElement?.value || footerIconElement?.value) {
      let footer_parts = [];
      
      if (footerTextElement?.value) {
        footer_parts.push(footerTextElement.value);
      }
      
      if (footerIconElement?.value && RegEx.imageURL.test(footerIconElement.value)) {
        footer_parts.push(footerIconElement.value);
      }
      
      if (footer_parts.length > 0) {
        embedScript += `$v{footer: ${footer_parts.join(' && ')}}\n`;
      }
    }

    // Timestamp
    let timestampElement = form.elements['timestamp'];
    if (timestampElement?.checked) {
      embedScript += '$v{timestamp}\n';
    }

    // Remove trailing newline if exists
    embedScript = embedScript.trim();

    // Debugging: Log the generated embedScript
    console.log('Generated embedScript:', embedScript);

    // Update state with the plain embedScript and set highlighted HTML
    this.setState({ embedScript }, () => {
      let outputElement = document.getElementById('json-output');
      if (outputElement) {
        // Display the highlighted version
        let highlighted = this.highlightSyntax(this.state.embedScript);
        outputElement.innerHTML = highlighted;
      }
    });
  }

  /**
   * Highlights the syntax of the embed script for display purposes.
   * @param {string} script - The embed script to highlight.
   * @returns {string} - The HTML string with syntax highlighting.
   */
  highlightSyntax(script) {
    let output = script;
    output = output.replace(/\{embed\}/g, '<span class="highlight keyword">{embed}</span>');
    output = output.replace(/\$v\{([^}]+)\}/g, '<span class="highlight function">$v{$1}</span>');
    output = output.replace(/: "([^"}&]+)"/g, ': <span class="highlight string">"$1"</span>');
    output = output.replace(/\n/g, '<br>');
    return output;
  }

  copyJSON() {
    const { embedScript } = this.state;

    if (!navigator.clipboard) {
      // Fallback for browsers that do not support the Clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = embedScript;
      textarea.style.position = 'fixed';  // Prevent scrolling to bottom of page in Microsoft Edge
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        const successful = document.execCommand('copy');
        if (successful) {
          console.log('Script copied to clipboard');
          // Optional: Implement alternative user feedback here
        } else {
          throw new Error('Copy command was unsuccessful');
        }
      } catch (err) {
        console.error('Fallback: Unable to copy', err);
        // Optional: Implement alternative error handling here
      }

      document.body.removeChild(textarea);
      return;
    }

    navigator.clipboard.writeText(embedScript)
      .then(() => {
        console.log('Script copied to clipboard');
        // Optional: Implement alternative user feedback here
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        // Optional: Implement alternative error handling here
      });
  }

  render() {
    return (
      <div className="cell">
        <div id="output-container">
          <div className="controller">
            <button onClick={() => this.generateJSON()}>
              <span role="img" aria-label="Gear Emoji">⚙</span>&ensp;Generate Embed Code
            </button>
            <button onClick={() => this.copyJSON()}>
              <span role="img" aria-label="Copy Emoji">🔗</span>&ensp;Copy Embed Code
            </button>
          </div>
          <div className="output">
            <pre><div id="json-output" readOnly>{this.state.embedScript}</div></pre>
          </div>
        </div>
      </div>
    );
  }
}

export default Output;