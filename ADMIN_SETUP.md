# Admin Panel Setup Guide

## Firebase Configuration

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)

2. Enable the following Firebase services:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage

3. Create a `.env.local` file in the root directory with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Configuration - Set these to your specific admin credentials
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email@example.com
NEXT_PUBLIC_ADMIN_UID=your_admin_user_uid
```

4. Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all users
    match /{document=**} {
      allow read: if true;
    }
    
    // Allow write access only to the specific admin user by UID
    match /categories/{categoryId} {
      allow write: if request.auth != null && 
        request.auth.uid == "YOUR_ADMIN_UID_HERE";
    }
    
    match /products/{productId} {
      allow write: if request.auth != null && 
        request.auth.uid == "YOUR_ADMIN_UID_HERE";
    }
    
    match /orders/{orderId} {
      // Allow customers to create orders
      allow create: if request.auth != null;
      // Allow only admin to update orders
      allow update: if request.auth != null && 
        request.auth.uid == "YOUR_ADMIN_UID_HERE";
    }
  }
}
```

5. Set up Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.uid == "YOUR_ADMIN_UID_HERE";
    }
  }
}
```

**Note**: Replace `"YOUR_ADMIN_UID_HERE"` with your actual admin UID from Firebase Console.

## Admin User Setup

1. Go to Firebase Console > Authentication > Users
2. Add a new user with email and password
3. Copy the user's UID from the Firebase Console
4. Update your `.env.local` file with:
   - `NEXT_PUBLIC_ADMIN_EMAIL`: The email address of your admin user
   - `NEXT_PUBLIC_ADMIN_UID`: The UID of your admin user (required for security)
5. Update the Firebase security rules by replacing `"YOUR_ADMIN_UID_HERE"` with your actual admin UID
6. Only this specific user will be able to access the admin panel at `/admin/login`

**Important**: Only the user with the UID specified in your Firebase security rules will have write access to the admin panel. All other authenticated users will be denied access.

## Features

### Admin Panel (`/admin`)
- **Dashboard**: Overview of products, categories, orders, and revenue
- **Categories**: Add, edit, delete product categories
- **Products**: Add, edit, delete products with image upload
- **Orders**: View and manage customer orders
- **Analytics**: Sales and performance metrics

### Frontend Features
- **Shopping Cart**: Add products to cart with size/color selection
- **Checkout**: Complete order form with customer information
- **Product Management**: View products by category

## Usage

1. **Access Admin Panel**: Navigate to `/admin/login`
2. **Add Categories**: Go to `/admin/categories` and click "Add Category"
3. **Add Products**: Go to `/admin/products` and click "Add Product"
4. **View Orders**: Go to `/admin/orders` to see customer orders

## Cart Functionality

- Products can be added to cart from product pages
- Cart persists in localStorage
- Checkout form collects customer information
- Orders are saved to Firebase Firestore

## File Structure

```
src/
├── app/
│   ├── admin/           # Admin panel pages
│   │   ├── login/       # Admin login
│   │   ├── categories/  # Category management
│   │   ├── products/    # Product management
│   │   └── orders/      # Order management
│   └── checkout/        # Checkout page
├── components/
│   ├── admin/          # Admin components
│   └── CheckoutForm.tsx # Checkout form
├── contexts/
│   └── CartContext.tsx  # Shopping cart state
├── lib/
│   ├── firebase.ts      # Firebase config
│   └── firebase-services.ts # Firebase operations
└── types/
    └── index.ts         # TypeScript interfaces
```

## Next Steps

1. Replace mock data in `src/data/products.ts` with Firebase data
2. Update product pages to use Firebase data
3. Add more admin features like user management
4. Implement payment gateway integration
5. Add email notifications for orders 