import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/((?!register|api|login).*)"], // ?!は否定
};

// export function middleware(req: NextRequest) {
//   console.log(req.url);
// }
