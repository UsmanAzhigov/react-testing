import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');

  const increment = () => {
    setCount(count + 2);
  };

  return (
    <div>
      <h2 data-testid="counter-value">{count}</h2>
      <button onClick={increment} data-testid="increment-button">
        Increment
      </button>
      <hr />
      <h2>Search: {search}</h2>
      <input
        data-testid="search-input"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default Counter;
