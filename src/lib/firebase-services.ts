import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "./firebase";
import { Category, Product, Order, CartItem } from "@/types";

// Admin configuration - Change these to your specific admin credentials
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@suridhi.com";
const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID || "";

// Check if current user is the authorized admin
export const isAuthorizedAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.uid === ADMIN_UID;
};

// Auth Services
export const signInAdmin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Check if the logged-in user is the authorized admin
    if (!isAuthorizedAdmin(userCredential.user)) {
      await signOut(auth);
      throw new Error(
        "Access denied. Only authorized admin can access this panel."
      );
    }

    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signOutAdmin = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Helper function to check admin authorization before write operations
const checkAdminAuth = () => {
  const user = auth.currentUser;
  if (!isAuthorizedAdmin(user)) {
    throw new Error(
      "Access denied. Only authorized admin can perform this action."
    );
  }
};

// Category Services
export const addCategory = async (
  categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">
) => {
  try {
    checkAdminAuth();
    const docRef = await addDoc(collection(db, "categories"), {
      ...categoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (
  id: string,
  categoryData: Partial<Category>
) => {
  try {
    checkAdminAuth();
    const docRef = doc(db, "categories", id);
    await updateDoc(docRef, {
      ...categoryData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    checkAdminAuth();
    await deleteDoc(doc(db, "categories", id));
  } catch (error) {
    throw error;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Category[];
  } catch (error) {
    throw error;
  }
};

export const getCategory = async (id: string): Promise<Category | null> => {
  try {
    const docRef = doc(db, "categories", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Category;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Product Services
export const addProduct = async (
  productData: Omit<Product, "id" | "createdAt" | "updatedAt">
) => {
  try {
    checkAdminAuth();
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  productData: Partial<Product>
) => {
  try {
    checkAdminAuth();
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, {
      ...productData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    checkAdminAuth();
    await deleteDoc(doc(db, "products", id));
  } catch (error) {
    throw error;
  }
};

export const getProducts = async (categoryId?: string): Promise<Product[]> => {
  try {
    let q = collection(db, "products");
    if (categoryId) {
      q = query(q, where("categoryId", "==", categoryId));
    }
    q = query(q, orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];
  } catch (error) {
    throw error;
  }
};

// Get popular products
export const getPopularProducts = async (
  limit: number = 8
): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, "products"),
      where("isPopular", "==", true),
      orderBy("createdAt", "desc"),
      limit(limit)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];
  } catch (error) {
    throw error;
  }
};

// Get trending products
export const getTrendingProducts = async (
  limit: number = 8
): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, "products"),
      where("isTrending", "==", true),
      orderBy("createdAt", "desc"),
      limit(limit)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];
  } catch (error) {
    throw error;
  }
};

export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Product;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Order Services
export const addOrder = async (
  orderData: Omit<Order, "id" | "createdAt" | "updatedAt">
) => {
  try {
    // Orders can be created by customers (no admin check needed)
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const updateOrder = async (id: string, orderData: Partial<Order>) => {
  try {
    checkAdminAuth(); // Only admin can update orders
    const docRef = doc(db, "orders", id);
    await updateDoc(docRef, {
      ...orderData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Order[];
  } catch (error) {
    throw error;
  }
};

export const getOrder = async (id: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Order;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// File Upload Service
export const uploadImage = async (
  file: File,
  path: string
): Promise<string> => {
  try {
    checkAdminAuth(); // Only admin can upload images
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    throw error;
  }
};
