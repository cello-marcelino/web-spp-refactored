# Refactoring Plan: SPP Payment Logic

## 1. Goal Description
The objective is to refactor the SPP payment logic from the legacy procedural PHP system (`../marcell-projects/Project-0/proses.php`) into a modern, native Node.js application. The new system will strictly follow a Layered Architecture, enforce security constraints (SQL injection prevention, secure uploads, session guards), and avoid "God Files".

### Legacy Flow (`proses.php`):
1. **Bayar SPP**: Receives payment details from a student (`Siswa`) along with a receipt image. Moves the file to an `img/` directory and inserts a record into the `pembayaran` table with a `pending` status.
2. **Konfirmasi / Tolak**: Admin or Petugas updates the payment status to `succes` or `rejected` via URL query parameters (`?konfirmasi=id` or `?tolak=id`).

### Refactored Flow (Node.js Layered Architecture):
1. **Controllers**: `PaymentController.js` handles HTTP requests, validates input, and delegates to services.
2. **Services**: `PaymentService.js` contains business logic (e.g., verifying user constraints).
3. **Repositories**: `PaymentRepo.js` handles all SQLite parameterized queries.
4. **Utils**: `UploadHandler.js` handles secure file uploads, while `SessionManager.js` handles authorization.

## 2. User Review Required
> **Note on HTTP Server:** Since the constraint is Node.js Native without frameworks (like Express), processing `multipart/form-data` natively is quite complex. We will use a lightweight standard approach to parse boundaries natively or recommend using a minimalistic parser like `formidable` just for uploads, depending on strictness of "No Frameworks". Assuming 100% native for now.

## 3. Open Questions
- Should we migrate the table schema exactly as is (`recipt`, `succes`), or fix the typos during migration (e.g., `receipt_file`, `success`)?

## 4. Proposed Changes

### Database Layer
- **`src/config/database.js`**: Setup SQLite connection.
- **`src/repositories/PaymentRepo.js`**: 
  - `createPayment(data)`: Uses `INSERT INTO pembayaran (...) VALUES (?, ?, ...)`
  - `updateStatus(id, status)`: Uses `UPDATE pembayaran SET status = ? WHERE id_pembayaran = ?`

### Utility Layer
- **`src/utils/UploadHandler.js`**:
  - Validates file extensions (`.jpg`, `.jpeg`, `.png`).
  - Validates file size (Max 2MB).
  - Renames the file using `UUID` or `Date.now()` to prevent directory traversal and overwrite attacks.
  - Saves file securely in `public/uploads/`.
- **`src/utils/SessionManager.js`**:
  - Validates session before any payment action is processed.

### Service Layer
- **`src/services/PaymentService.js`**:
  - `processPaymentSubmission(data, file)`: Coordinates file save and repo insertion. Wraps logic in `try-catch`.
  - `processStatusUpdate(id, status, role)`: Verifies if role is Admin/Petugas and updates the status.

### Controller Layer
- **`src/controllers/PaymentController.js`**:
  - Exposes `submitPayment(req, res)`: Checks session, extracts multipart data, calls service, redirects or returns JSON.
  - Exposes `updatePaymentStatus(req, res)`: Checks admin session, extracts payment ID, calls service.

## 5. Verification Plan
- **Automated tests (Manual testing via Browser/Postman)**:
  - Submit payment with a 3MB file -> Expected: Rejected (File too large).
  - Submit payment with a `.pdf` -> Expected: Rejected (Invalid extension).
  - Submit valid image -> Expected: Success, image renamed to UUID, DB state `pending`.
  - Admin confirms payment -> Expected: Success, DB state `success`.
  - Unauthenticated access to payment routes -> Expected: Redirect to login.
