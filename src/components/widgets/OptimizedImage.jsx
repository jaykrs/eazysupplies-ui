import Image from "next/image";

const DEFAULT_IMAGE = "/assets/images/placeholder/product.png";

/**
 * App-wide image primitive. It keeps a stable intrinsic size for Next.js image
 * optimization while allowing existing responsive CSS classes to control the
 * rendered size.
 */
const OptimizedImage = ({ src, alt = "", width, height, sizes, ...props }) => {
  const normalizedWidth = Number(width) > 0 ? Number(width) : 750;
  const normalizedHeight = Number(height) > 0 ? Number(height) : 750;

  return (
    <Image
      {...props}
      src={src || DEFAULT_IMAGE}
      alt={typeof alt === "string" ? alt : ""}
      width={normalizedWidth}
      height={normalizedHeight}
      sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
    />
  );
};

export default OptimizedImage;
