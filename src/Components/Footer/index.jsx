import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <footer style={{ marginTop: '-20px' }}>  {/* Added negative margin */}
        <div className="copyright">Copyright &copy; 2024 - The Bastion Bot Project - Modified By The Marly Team</div>
      </footer>
    );
  }
}

export default Footer;