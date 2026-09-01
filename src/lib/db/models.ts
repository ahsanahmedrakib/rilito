import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";
import { connectDb } from "./connection";

export { connectDb };

export interface AdminUserDoc {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: "superadmin" | "admin";
  createdAt: Date;
}

const AdminUserSchema = new Schema<AdminUserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["superadmin", "admin"], default: "admin" },
  },
  { timestamps: true }
);

AdminUserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.password = obj.passwordHash;
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

export const AdminUser =
  (models.AdminUser as mongoose.Model<AdminUserDoc>) ??
  model<AdminUserDoc>("AdminUser", AdminUserSchema);

export interface CustomerDoc {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  address: string;
  city: string;
}

const CustomerSchema = new Schema<CustomerDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: { type: String, required: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
  },
  { timestamps: true }
);

CustomerSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

export const Customer =
  (models.Customer as mongoose.Model<CustomerDoc>) ??
  model<CustomerDoc>("Customer", CustomerSchema);

export interface CategoryDoc {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  accent: string;
}

const CategorySchema = new Schema<CategoryDoc>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tagline: { type: String, default: "" },
    image: { type: String, default: "" },
    accent: { type: String, default: "#111318" },
  },
  { timestamps: true }
);

export const Category =
  (models.Category as mongoose.Model<CategoryDoc>) ??
  model<CategoryDoc>("Category", CategorySchema);

export interface ProductDoc {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  images: string[];
  description: string;
  details: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  sizeStock?: Record<string, number>;
  sizeGuideImage?: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isBestSeller?: boolean;
  isNew?: boolean;
  featured?: boolean;
  deleted?: boolean;
}

const ProductSchema = new Schema<ProductDoc>(
  {
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    images: { type: [String], default: [] },
    description: { type: String, default: "" },
    details: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    colors: { type: [{ name: String, hex: String }], default: [] },
    sizeStock: { type: Schema.Types.Mixed, default: {} },
    sizeGuideImage: { type: String, default: "" },
    tags: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    isBestSeller: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

export const Product =
  (models.Product as mongoose.Model<ProductDoc>) ??
  model<ProductDoc>("Product", ProductSchema);

export interface ReviewDoc {
  id: string;
  productId: string;
  productName: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  status: "pending" | "approved" | "rejected";
}

const ReviewSchema = new Schema<ReviewDoc>(
  {
    id: { type: String, required: true, unique: true },
    productId: { type: String, required: true },
    productName: { type: String, default: "" },
    author: { type: String, required: true },
    rating: { type: Number, required: true },
    title: { type: String, default: "" },
    body: { type: String, default: "" },
    date: { type: String, default: () => new Date().toISOString() },
    verified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Review =
  (models.Review as mongoose.Model<ReviewDoc>) ??
  model<ReviewDoc>("Review", ReviewSchema);

export interface OrderDoc {
  id: string;
  items: {
    key: string;
    productId: string;
    slug: string;
    name: string;
    image: string;
    price: number;
    size: string;
    color: string;
    qty: number;
  }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  area: string;
  payment: string;
  transactionId?: string;
  status: string;
  date: string;
  tracking?: { courier: string; trackingId: string; note: string };
}

const OrderSchema = new Schema<OrderDoc>(
  {
    id: { type: String, required: true, unique: true },
    items: { type: Schema.Types.Mixed, default: [] },
    subtotal: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    area: { type: String, default: "" },
    payment: { type: String, default: "cod" },
    transactionId: { type: String, default: "" },
    status: { type: String, default: "Order Placed" },
    date: { type: String, default: () => new Date().toISOString() },
    tracking: {
      type: new Schema(
        { courier: String, trackingId: String, note: String },
        { _id: false }
      ),
      default: undefined,
    },
  },
  { timestamps: true }
);

export const Order =
  (models.Order as mongoose.Model<OrderDoc>) ??
  model<OrderDoc>("Order", OrderSchema);

export interface CouponDoc {
  code: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
}

const CouponSchema = new Schema<CouponDoc>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ["percent", "fixed"], required: true },
    value: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Coupon =
  (models.Coupon as mongoose.Model<CouponDoc>) ??
  model<CouponDoc>("Coupon", CouponSchema);

export interface SettingDoc {
  key: string;
  value: mongoose.Schema.Types.Mixed;
}

const SettingSchema = new Schema<SettingDoc>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const Setting =
  (models.Setting as mongoose.Model<SettingDoc>) ??
  model<SettingDoc>("Setting", SettingSchema);

export interface ContactQueryDoc {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
}

const ContactQuerySchema = new Schema<ContactQueryDoc>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ContactQuery =
  (models.ContactQuery as mongoose.Model<ContactQueryDoc>) ??
  model<ContactQueryDoc>("ContactQuery", ContactQuerySchema);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function seedSuperAdmin(): Promise<void> {
  const email = process.env.DEFAULT_EMAIL ?? process.env.default_email;
  const password = process.env.DEFAULT_PASSWORD ?? process.env.default_password;
  if (!email || !password) return;
  const existing = await AdminUser.findOne({
    email: email.toLowerCase(),
  }).exec();
  if (existing) return;
  await AdminUser.create({
    name: "Super Admin",
    email: email.toLowerCase(),
    passwordHash: await hashPassword(password),
    role: "superadmin",
  });
}
