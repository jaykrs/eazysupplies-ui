// Auth
export const BASE_URL = "http://api.eazysupplies.com";
//export const BASE_URL = "http://localhost:3000";
export const RegisterAPI = "/auth/user";
// export const LoginAPI = "/auth/login";
// export const SelfAPI = "/self";
export const SelfAPI = "/auth/user";
export const GetUserAddress = "/address?userId=";
export const ForgotPasswordAPI = "/forgot-password";
export const VerifyTokenAPI = "/verify-otp";
export const UpdatePasswordAPI = "/update-password";
export const LogoutAPI = "/logout";

// Brand Logo API
export const BrandLogo = "/brand";

// Theme Option
export const ThemeOptionsAPI = "/themeOptions";

// Category API
// export const CategoryAPI = "/category";
export const CategoryAPI = "http://api.eazysupplies.com/api/categories";
export const BrandAPI = "http://api.eazysupplies.com/api/brands";

// Product API
// export const ProductAPI = "/product";
export const ProductAPI = BASE_URL + "/api/products";
export const ProductByBrandAPI = BASE_URL + "/api/products/filter?brand=";
export const ProductByCategoryAPI = BASE_URL + "/api/products/filter?category=";
export const ProductBySlugAPI = BASE_URL + "/api/products/filter?";

export const CreateOrderAPI = BASE_URL + "/api/orders";
export const GetOrderByUserId = "/api/orders/filter?userId=";
export const GetOrderById = "/orders/";
export const LoginAPI = "/api/auth/login";
export const GetUserById = "/api/auth/user";
export const GetHomePageData = "/api/template?name=home";
export const GetPaymentList = "/api/template?name=home";

// Product Search API
export const ProductSearchAPI = "/product/minify/list";
export const CreateAddress = "/address";
// Pages API
export const PageAPI = "/page";

// Theme API
export const ThemeAPI = "/theme";

// Home Pages API
export const HomePageAPI = "/home";

// Blogs API
export const BlogAPI = "/blog";

// Tags API
export const TagAPI = "/tag";

// Currency API
export const CurrencyAPI = "/currency";

// Setting API
export const SettingAPI = "/settings";

// Wishlist API
export const WishlistAPI = "/wishlist";

// Cart API
export const AddToCartAPI = "/cart";

// Contact Us API
export const ContactUsAPI = "/contact-us";

// Store API
export const StoreAPI = "/store";

// Compare API
export const CompareAPI = "/compare";

// Attributes API
export const AttributesAPI = "/attribute";

// Wallet API
export const WalletConsumerAPI = "/wallet/consumer";

// Address API
export const AddressAPI = "/address";

// Country API
export const CountryAPI = "/country";

// CheckoutAPI
export const CheckoutAPI = "/checkout";

// Orders API
export const OrderAPI = "/order";

export const LoginPhnAPI = "/login/number";

// Tracking API
export const TrackingAPI = "/trackOrder";

// Verify Payment API
export const VerifyPayment = "/verifyPayment";

// Update Profile API
export const UpdateProfileAPI = "/updateProfile";

// Update Profile API
export const UpdateProfilePasswordAPI = "/updatePassword";

// Update Profile API
export const NotificationAPI = "/notifications";
export const MarkAsReadAPI = "/notifications/markAsRead";

// Payment Account API
export const PaymentAccountAPI = "/paymentAccount";

// Points API
export const PointAPI = "/points/consumer";

// Refund  API
export const RefundAPI = "/refund";

// Question And Answer API
export const QuestionAnswerAPI = "/question-and-answer";

// Coupon API
export const CouponAPI = "/coupon";

// FeedBack API
export const FeedBackAPI = "/question-and-answer/feedback";

// Review API
export const ReviewAPI = "/review";

// Order Status API
export const OrderStatusAPI = "/orderStatus";

// Replace Cart API
export const ReplaceCartAPI = "/replace/cart";

// Faq API
export const FaqAPI = "/faq";

export const RePaymentAPI = "/rePayment";

// Clear Cart Api
export const ClearCart = "clear/cart";

// Subscribe Api

export const SubscribeAPI = "/subscribe";

// invoice

export const OrderInvoiceAPI = "/order/invoice";

export const SyncCart = "/sync/cart";
