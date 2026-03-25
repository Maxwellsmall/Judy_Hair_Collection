import AllScreen from "./routes/AllScreen"
import CartProvider from "../src/Context/CartContext";

function App() {

  return (
    <>
      <CartProvider>
        
      <AllScreen />
        </CartProvider>
    </>
  );
}

export default App
