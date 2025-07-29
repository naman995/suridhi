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
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "./firebase";
import { Category, Product, Order } from "@/types";

// Admin configuration - Change these to your specific admin credentials
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
    const categories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      showInNavbar: doc.data().showInNavbar || false,
      parentId: doc.data().parentId || null,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Category[];

    // Group categories by parent/child relationship
    const parentCategories = categories.filter((cat) => !cat.parentId);
    const childCategories = categories.filter((cat) => cat.parentId);

    // Add subcategories to parent categories
    parentCategories.forEach((parent) => {
      parent.subcategories = childCategories.filter(
        (child) => child.parentId === parent.id
      );
    });

    return parentCategories;
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
        showInNavbar: docSnap.data().showInNavbar || false,
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Category;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const getNavbarCategories = async (): Promise<Category[]> => {
  try {
    // First try to get categories with showInNavbar: true
    let q = query(
      collection(db, "categories"),
      where("showInNavbar", "==", true),
      orderBy("name")
    );

    let querySnapshot;
    try {
      querySnapshot = await getDocs(q);
    } catch (error) {
      // If the query fails (e.g., no categories with showInNavbar field),
      // fall back to getting all categories
      console.warn(
        "Navbar query failed, falling back to all categories:",
        error
      );
      q = query(collection(db, "categories"), orderBy("name"));
      querySnapshot = await getDocs(q);
    }

    const categories: Category[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      categories.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        image: data.image,
        count: data.count || 0,
        showInNavbar: data.showInNavbar || false,
        parentId: data.parentId,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      });
    });

    // Filter to only show categories that have showInNavbar: true
    // If no categories have this field set, show all categories (backward compatibility)
    const navbarCategories = categories.filter(
      (cat) => cat.showInNavbar === true
    );
    const finalCategories =
      navbarCategories.length > 0 ? navbarCategories : categories;

    // Group categories by parent/child relationship
    const parentCategories = finalCategories.filter((cat) => !cat.parentId);
    const childCategories = finalCategories.filter((cat) => cat.parentId);

    // Add subcategories to parent categories
    parentCategories.forEach((parent) => {
      parent.subcategories = childCategories.filter(
        (child) => child.parentId === parent.id
      );
    });

    return parentCategories;
  } catch (error) {
    console.error("Error fetching navbar categories:", error);
    // Return empty array as fallback
    return [];
  }
};

// Get subcategories for a specific parent category
export const getSubcategories = async (
  parentId: string
): Promise<Category[]> => {
  try {
    const q = query(
      collection(db, "categories"),
      where("parentId", "==", parentId),
      orderBy("name")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      showInNavbar: doc.data().showInNavbar || false,
      parentId: doc.data().parentId,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Category[];
  } catch (error) {
    throw error;
  }
};

// Get all parent categories (categories without parentId)
export const getParentCategories = async (): Promise<Category[]> => {
  try {
    const q = query(
      collection(db, "categories"),
      where("parentId", "==", null),
      orderBy("name")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name || "",
      count: doc.data().count || 0,
      description: doc.data().description || "",
      image: doc.data().image || "",
      showInNavbar: doc.data().showInNavbar || false,
      parentId: undefined,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Category[];
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

export const getProducts = async (
  categoryId?: string,
  subcategoryId?: string
): Promise<Product[]> => {
  try {
    let q;

    if (subcategoryId) {
      // If subcategoryId is provided, get products from that subcategory
      q = query(
        collection(db, "products"),
        where("subcategoryId", "==", subcategoryId),
        orderBy("createdAt", "desc")
      );
    } else if (categoryId) {
      // If only categoryId is provided, get products from that category (including subcategories)
      q = query(
        collection(db, "products"),
        where("categoryId", "==", categoryId),
        orderBy("createdAt", "desc")
      );
    } else {
      // Get all products
      q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    }

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

// Get products by subcategory
export const getProductsBySubcategory = async (
  subcategoryId: string
): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, "products"),
      where("subcategoryId", "==", subcategoryId),
      orderBy("createdAt", "desc")
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

// Get popular products
export const getPopularProducts = async (
  limitCount: number = 8
): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, "products"),
      where("isPopular", "==", true),
      orderBy("createdAt", "desc"),
      limit(limitCount)
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
  limitCount: number = 8
): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, "products"),
      where("isTrending", "==", true),
      orderBy("createdAt", "desc"),
      limit(limitCount)
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
