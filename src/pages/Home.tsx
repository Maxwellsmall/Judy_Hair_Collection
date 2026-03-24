import Hero from "../components/Hero";
import { Testimonials } from "../components/Testimonials";
import WhyChoseUs from "../components/WhyChoseUs";
import CustomOrder from "../components/CustomOrder";
import Products from "../components/Products";
import ShopByStyle from "../components/ShopByStyle";

const Home = () => {
  return (
    <div className="text-black bg-gray-100 w-full flex flex-col justify-center items-center">
      <div>
        <Hero />

        <ShopByStyle />

        <Products />

        <CustomOrder />
        <Testimonials />
        <WhyChoseUs />
      </div>
    </div>
  );
};

export default Home;
