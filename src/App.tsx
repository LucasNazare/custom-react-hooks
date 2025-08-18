import useDebounce from "./hooks/useDebounce";

function App() {
  const debouncedValue = useDebounce("oi", 300);
  return <>oi {debouncedValue}</>;
}

export default App;
