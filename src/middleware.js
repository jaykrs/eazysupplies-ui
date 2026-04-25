import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

function noCacheHeaders(response) {
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.cookies.set('from-middleware', 'true');
  return response;
}

export async function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const cookieStore = await cookies();
  const autht = cookieStore.get("authToken");
  cookieStore.set('uat', autht);
  // ✅ Handle CORS for API routes
  if (pathname.startsWith("/api")) {
    const response = NextResponse.next();

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    if (request.method === "OPTIONS") {
      return noCacheHeaders(
        new NextResponse(null, {
          status: 204,
          headers: response.headers,
        })
      );
    }

    return noCacheHeaders(response);
  }

  // ✅ Default response (important!)
  let response = NextResponse.next();

  // 👉 Apply no-cache globally
  noCacheHeaders(response);

  // ===============================
  // Your existing logic
  // ===============================

  const urlSearchParams = new URLSearchParams(search);
  const params = Object.fromEntries(urlSearchParams.entries());

  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${request.cookies.get("uat")?.value}`);

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  let settingData = await (
    await fetch(process.env.API_PROD_URL + "/settings", requestOptions, {
      cache: "no-store", // 🔥 important
    })
  )?.json();

  const protectedRoutes = [
    `/account/dashboard`,
    `/account/notification`,
    `/account/wallet`,
    `/account/bank-details`,
    `/account/payment`,
    `/account/refund`,
    `/account/order`,
    `/account/addresses`,
    `/wishlist`,
    `/compare`,
  ];

  // Example: redirect with no-cache
  if (protectedRoutes.includes(pathname) && !request.cookies.has("uat")) {
    const redirectResponse = NextResponse.redirect(
      new URL(request?.cookies?.get("currentPath")?.value || "/", request.url)
    );
    redirectResponse.cookies.set("showAuthToast", "true", { httpOnly: false });

    return noCacheHeaders(redirectResponse); // 🔥 critical
  }

  // Apply same pattern to ALL redirects
  if (pathname === `/auth/login` && request.cookies.has("uat")) {
    return noCacheHeaders(
      NextResponse.redirect(new URL(`/`, request.url))
    );
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};