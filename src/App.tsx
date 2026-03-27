import AllScreen from "./routes/AllScreen";
import CartProvider from "../src/Context/CartContext";
import { WishlistProvider } from "./Context/WishlistContext";

function App() {
  return (
    <>
      <CartProvider>
        <WishlistProvider>
          <AllScreen />
        </WishlistProvider>
      </CartProvider>
    </>
  );
}

export default App;
