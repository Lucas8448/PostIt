import React from 'react';
import PropTypes from 'prop-types';

const PostIt = ({ id, content, submitter, submitterEmail }) => {
  return (
    <div className="post-it" id={`post-it-${id}`}>
      <p className="content">{content}</p>
      {submitter && <p className="submitter">Submitted by: {submitter}</p>}
      {submitterEmail && <p className="submitter-email">Email: {submitterEmail}</p>}
    </div>
  );
};

PostIt.propTypes = {
  id: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  submitter: PropTypes.string,
  submitterEmail: PropTypes.string
};

PostIt.defaultProps = {
  submitter: '',
  submitterEmail: ''
};

export default PostIt;