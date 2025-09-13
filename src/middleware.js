import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname, search } = request.nextUrl;

  // ✅ Handle CORS for API routes
  if (pathname.startsWith("/api")) {
    const response = NextResponse.next();

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Preflight request (OPTIONS)
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: response.headers,
      });
    }

    return response;
  }

  // ✅ Your existing logic (only for non-API routes)
  const urlSearchParams = new URLSearchParams(search);
  const params = Object.fromEntries(urlSearchParams.entries());

  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${request.cookies.get("uat")?.value}`);
  let requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  let settingData = await (await fetch(process.env.API_PROD_URL + "/settings", requestOptions))?.json();

  const protectedRoutes = [
    `/account/dashboard`,
    `/account/notification`,
    `/account/wallet`,
    `/account/bank-details`,
    `/account/point`,
    `/account/refund`,
    `/account/order`,
    `/account/addresses`,
    `/wishlist`,
    `/compare`,
  ];

  if (request.cookies.has("maintenance") && pathname !== `/maintenance`) {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${request.cookies.get("uat")?.value}`);
    let requestOptions = { method: "GET", headers: myHeaders };

    let response = await fetch(process.env.API_PROD_URL + "/settings", requestOptions);
    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }
    let data = await response.json();

    if (data?.values?.maintenance?.maintenance_mode && pathname !== `/maintenance`) {
      return NextResponse.redirect(new URL(`/maintenance`, request.url));
    } else {
      if (request.cookies.get("maintenance")) {
        return NextResponse.next();
      } else {
        const response = NextResponse.next();
        response.cookies.delete("maintenance");
        return NextResponse.redirect(new URL(`/`, request.url));
      }
    }
  }

  if (protectedRoutes.includes(pathname) && !request.cookies.has("uat")) {
    const response = NextResponse.redirect(new URL(request?.cookies?.get("currentPath").value, request.url));
    response.cookies.set("showAuthToast", "true", { httpOnly: false });
    return response;
  }

  if (!request.cookies.has("maintenance") && pathname == `/maintenance`) {
    return NextResponse.redirect(new URL(`/`, request.url));
  }

  if (pathname == `/checkout` && !request.cookies.has("uat")) {
    if (settingData?.values?.activation?.guest_checkout) {
      if (request.cookies.get("cartData") == "digital") {
        return NextResponse.redirect(new URL(`/auth/login`, request.url));
      }
    } else {
      return NextResponse.redirect(new URL(`/auth/login`, request.url));
    }
  }

  if (pathname == `/auth/login` && request.cookies.has("uat")) {
    return NextResponse.redirect(new URL(`/`, request.url));
  }

  if (pathname != `/auth/login`) {
    if (pathname == `/auth/otp-verification` && !request.cookies.has("ue")) {
      return NextResponse.redirect(new URL(`/auth/login`, request.url));
    }
    if (pathname == `/auth/update-password` && (!request.cookies.has("uo") || !request.cookies.has("ue"))) {
      return NextResponse.redirect(new URL(`/auth/login`, request.url));
    }
  }

  if (request.headers.get("x-redirected")) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
