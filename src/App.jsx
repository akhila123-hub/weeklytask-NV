import React, { useState, useEffect } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (count === 0) {
      setMessage('Count is Zero!');
    } else if (count === 10) {
      setMessage('Reset to Zero!');
    } else {
      setMessage('');
    }
  }, [count]);

  const handleClick = () => {
    const newCount = count === 10 ? 0 : count + 1;
    setCount(newCount);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Count: {count}</h2>
      <button onClick={handleClick}>+</button>

      <button onClick={() => setCount(0)}>Reset</button>
      <button onClick={() => setCount(count - 1)} disabled={count === 0}>-</button>
      <p>{message}</p>
    </div>
  );
};

export default Counter;
