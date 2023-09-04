import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

const Star = () => {
    return <FontAwesomeIcon icon={faStar} style={{ color: "#e2e605", }} />
  };

const Stars = ({ rating }) => {
  const items = Array.from({ length: rating }, (_, index) => index);

  return (
    <>
      {items.map((item) => (
        <Star key={item}/>
      ))}
    </>
  );
};

export default Stars;