import React, { useState, useContext, useCallback } from "react";

export const ErrorContext = React.createContext({
  error: null,
  addError: () => {},
  removeError: () => {},
});

const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const addError = (message, status) => setError({ message, status });
  const removeError = () => setError(null);

  const contextValue = {
    error,
    addError: useCallback((message, status) => addError(message, status), []),
    removeError: useCallback(() => removeError(), []),
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrors = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useErrors must be used within a ErrorContextProvider");
  }
  return context;
};

export default ErrorProvider;
