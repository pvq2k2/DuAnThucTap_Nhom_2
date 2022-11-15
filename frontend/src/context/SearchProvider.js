import React, { createContext, useState } from 'react'
import { useNotification } from '../hooks';

export const SearchContext = createContext();

let timoutId;
const debounce = (func, delay) => {
  return (...args) => {
    if (timoutId) clearTimeout(timoutId);
    timoutId = setTimeout(() => {
      func.apply(null, args)
    }, delay);
  };
};

export default function SearchProvider({ children }) {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [resultsNotFound, setResultsNotFound] = useState(false);
  const { updateNotification } = useNotification();

  const search = async (method, query, updaterFun) => {
    const { error, results } = await method(query);
    if (error) return updateNotification('error', error);
    if (!results.length) return setResultsNotFound(true);

    setResults(results);
    updaterFun && updaterFun([...results])
  }
  const debounceFunc = debounce(search, 300);
  const handleSearch = (method, query, updaterFun) => {
    setSearching(true);
    if (!query.trim()) {
      updaterFun && updaterFun([])
      resetSearch()
    }
    debounceFunc(method, query, updaterFun);
  }

  const resetSearch = () => {
    setSearching(false);
    setResults([]);
    setResultsNotFound(false)
  }
  return (
    <SearchContext.Provider value={{ handleSearch, resetSearch, searching, resultsNotFound, results }}>{children}</SearchContext.Provider>
  )
}