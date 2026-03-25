import Hero from "../components/Hero";
import { Testimonials } from "../components/Testimonials";
import WhyChoseUs from "../components/WhyChoseUs";
import CustomOrder from "../components/CustomOrder";
import Products from "../components/Products";
import ShopByStyle from "../components/ShopByStyle";
import FloatingWhatsAppButton from "../components/FloatingWhatsAppButton";

const Home = () => {
  return (
    <div className="w-full flex flex-col">
      <Hero />
      <ShopByStyle />
      <Products />
      <CustomOrder />
      <Testimonials />
      <WhyChoseUs />
      <FloatingWhatsAppButton position="bottom-right" />
    </div>
  );
};

export default Home;
