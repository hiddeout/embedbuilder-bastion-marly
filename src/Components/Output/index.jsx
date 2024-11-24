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

    let embedScript = '{embed}';

    // Color (default to #000000 if not specified)
    let colorElement = form.elements['color'];
    let color = colorElement ? colorElement.value : '#000000';
    embedScript += `$v{color: ${color}}`;

    // Author
    let authorNameElement = form.elements['author:name'];
    if (authorNameElement && authorNameElement.value) {
      let author_parts = [authorNameElement.value];
      
      let author_icon_url = form.elements['author:icon_url']?.value;
      if (author_icon_url && RegEx.imageURL.test(author_icon_url)) {
        author_parts.push(author_icon_url);
        
        let author_url = form.elements['author:url']?.value;
        if (author_url && RegEx.URL.test(author_url)) {
          author_parts.push(author_url);
        }
      }
      embedScript += `$v{author: ${author_parts.join(' && ')}}`;
    }

    // Title
    let titleElement = form.elements['title'];
    if (titleElement?.value) {
      embedScript += `$v{title: ${titleElement.value}}`;
    }

    // URL
    let urlElement = form.elements['url'];
    if (urlElement?.value && RegEx.URL.test(urlElement.value)) {
      embedScript += `$v{url: ${urlElement.value}}`;
    }

    // Description
    let descriptionElement = form.elements['description'];
    if (descriptionElement?.value) {
      embedScript += `$v{description: ${descriptionElement.value}}`;
    }

    // Fields
    let fieldsContainer = document.getElementById('fields');
    if (fieldsContainer?.children.length) {
      for (let i = 0; i < fieldsContainer.children.length; i++) {
        let fieldName = form.elements[`field-${i}:name`]?.value;
        let fieldValue = form.elements[`field-${i}:value`]?.value;
        let fieldInline = form.elements[`field-${i}:inline`]?.checked;
  
        if (fieldName && fieldValue) {
          embedScript += `$v{field: ${fieldName} && ${fieldValue}${fieldInline ? ' && inline' : ''}}`;
        }
      }
    }

    // Thumbnail
    let thumbnailElement = form.elements['thumbnail:url'];
    if (thumbnailElement?.value && RegEx.imageURL.test(thumbnailElement.value)) {
      embedScript += `$v{thumbnail: ${thumbnailElement.value}}`;
    }

    // Image
    let imageElement = form.elements['image:url'];
    if (imageElement?.value && RegEx.imageURL.test(imageElement.value)) {
      embedScript += `$v{image: ${imageElement.value}}`;
    }

    // Footer
    let footerElement = form.elements['footer:text'];
    if (footerElement?.value) {
      let footer_parts = [footerElement.value];
      
      let footer_icon_url = form.elements['footer:icon_url']?.value;
      if (footer_icon_url && RegEx.imageURL.test(footer_icon_url)) {
        footer_parts.push(footer_icon_url);
      }
      embedScript += `$v{footer: ${footer_parts.join(' && ')}}`;
    }

    // Timestamp
    let timestampElement = form.elements['timestamp'];
    if (timestampElement?.checked) {
      embedScript += '$v{timestamp}';
    }

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
    output = output.replace(/: ([^}\s&]+)/g, ': <span class="highlight string">$1</span>');
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
              <span role="img" aria-label="Gear Emoji">⚙</span>&ensp;Generate Script
            </button>
            <button onClick={() => this.copyJSON()}>
              <span role="img" aria-label="Copy Emoji">🔗</span>&ensp;Copy Script
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