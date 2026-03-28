import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import connectDB from "@lib/mongodb";
import Product from "@models/Product";
import MediaGallery from "./MediaGallery";
import ProductInfo from "./ProductInfo";

function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

interface PageProps {
  params: { id: string };
}

type ProductLean = {
  _id: unknown;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  categorySlug: string;
  sizes: string[];
  colors?: string[];
  images: string[];
  videos?: string[];
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isValidObjectId(params.id)) return { title: "Product Not Found" };

  await connectDB();
  const product = await Product.findById(params.id).lean<ProductLean>();
  if (!product || Array.isArray(product)) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Judy Hair Collection`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  if (!isValidObjectId(params.id)) notFound();

  await connectDB();
  const product = await Product.findById(params.id).lean<ProductLean>();
  if (!product || Array.isArray(product)) notFound();

  const related = await Product.find({
    categorySlug: product.categorySlug,
    _id: { $ne: product._id },
  })
    .limit(4)
    .lean<ProductLean[]>();

  const productId = String(product._id);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-neutral-500">
          <Link href="/" className="hover:text-neutral-900">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-neutral-900">Products</Link>
          <span>/</span>
          <span className="text-neutral-900">{product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <MediaGallery
            images={product.images}
            videos={product.videos ?? []}
          />
          <ProductInfo
            product={{
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              description: product.description,
              sizes: product.sizes,
              colors: product.colors,
            }}
          />
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-neutral-900">You May Also Like</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((item) => {
                const itemId = String(item._id);
                return (
                  <Link
                    key={itemId}
                    href={`/products/${itemId}`}
                    className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="relative aspect-square bg-neutral-100">
                      {item.images[0] && (
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="line-clamp-2 text-sm font-semibold text-neutral-900">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm font-bold text-neutral-900">
                        ₦{item.price.toLocaleString("en-NG")}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
