# 📚 API Documentation - InvestPro Backend

## 🔐 Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📋 API Endpoints

### Authentication APIs

#### 1. Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password@123",
  "name": "John Doe",
  "phone": "+919876543210",
  "referralCode": "REF123" 
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "referralCode": "USER123"
  },
  "tokens": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

---

#### 2. Login User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password@123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  },
  "tokens": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

---

### Wallet APIs

#### 3. Get Wallet Balance
**GET** `/api/wallet/balance`
**Auth:** Required

**Response:**
```json
{
  "availableBalance": 5000.00,
  "lockedBalance": 1000.00,
  "incomeWallet": 2000.00,
  "referralBonus": 500.00,
  "totalDeposited": 10000.00,
  "totalWithdrawn": 3000.00,
  "totalInvested": 5000.00,
  "totalEarned": 3000.00
}
```

---

#### 4. Recharge Wallet
**POST** `/api/wallet/recharge`
**Auth:** Required

**Request Body:**
```json
{
  "amount": 1000,
  "paymentMethod": "UPI",
  "paymentId": "PAY123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Recharge successful",
  "transaction": {
    "id": "uuid",
    "amount": 1000,
    "type": "DEPOSIT",
    "status": "COMPLETED"
  },
  "newBalance": 6000.00
}
```

---

#### 5. Request Withdrawal
**POST** `/api/wallet/withdraw`
**Auth:** Required

**Request Body:**
```json
{
  "amount": 500,
  "bankAccount": "1234567890",
  "ifscCode": "SBIN0001234",
  "accountHolderName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Withdrawal request submitted successfully",
  "withdrawal": {
    "id": "uuid",
    "amount": 500,
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### 6. Get Withdrawal History
**GET** `/api/wallet/withdraw`
**Auth:** Required

**Response:**
```json
{
  "withdrawals": [
    {
      "id": "uuid",
      "amount": 500,
      "netAmount": 500,
      "fee": 0,
      "status": "PENDING",
      "accountDetails": {
        "accountNumber": "1234567890",
        "ifscCode": "SBIN0001234"
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

#### 7. Get Transaction History
**GET** `/api/wallet/transactions?type=DEPOSIT&limit=50`
**Auth:** Required

**Query Parameters:**
- `type` (optional): DEPOSIT, WITHDRAWAL, INVESTMENT, DAILY_INCOME
- `limit` (optional): Number of records (default: 50)

**Response:**
```json
{
  "transactions": [
    {
      "id": "uuid",
      "type": "DEPOSIT",
      "amount": 1000,
      "status": "COMPLETED",
      "description": "Wallet recharge via UPI",
      "balanceBefore": 5000,
      "balanceAfter": 6000,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Investment APIs

#### 8. Get Investment Plans
**GET** `/api/plans`

**Response:**
```json
{
  "plans": [
    {
      "id": "uuid",
      "name": "VIP 1",
      "type": "VIP",
      "investmentAmount": 550,
      "dailyIncome": 120,
      "validity": 100,
      "totalReturn": 12000,
      "status": "ACTIVE"
    }
  ]
}
```

---

#### 9. Create Investment
**POST** `/api/investments/create`
**Auth:** Required

**Request Body:**
```json
{
  "planId": "uuid",
  "amount": 550
}
```

**Response:**
```json
{
  "success": true,
  "message": "Investment created successfully",
  "investment": {
    "id": "uuid",
    "orderId": "INV123456",
    "amount": 550,
    "dailyIncome": 120,
    "validity": 100,
    "status": "ACTIVE"
  }
}
```

---

### Support APIs

#### 10. Create Support Ticket
**POST** `/api/support/tickets`
**Auth:** Required

**Request Body:**
```json
{
  "subject": "Withdrawal Issue",
  "message": "My withdrawal is pending for 3 days",
  "category": "WITHDRAWAL",
  "priority": "HIGH"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Support ticket created successfully",
  "ticket": {
    "id": "uuid",
    "subject": "Withdrawal Issue",
    "status": "OPEN",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### 11. Get Support Tickets
**GET** `/api/support/tickets`
**Auth:** Required

**Response:**
```json
{
  "tickets": [
    {
      "id": "uuid",
      "subject": "Withdrawal Issue",
      "message": "My withdrawal is pending",
      "status": "OPEN",
      "priority": "HIGH",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Dashboard APIs

#### 12. Get Dashboard Stats
**GET** `/api/dashboard/stats`
**Auth:** Required

**Response:**
```json
{
  "availableBalance": 5000,
  "totalInvested": 10000,
  "totalEarnings": 3000,
  "todayIncome": 240,
  "activeInvestments": 3,
  "totalReferrals": 5,
  "referralEarnings": 500,
  "pendingWithdrawals": 1
}
```

---

### Notification APIs

#### 13. Get Notifications
**GET** `/api/notifications`
**Auth:** Required

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "title": "Recharge Successful",
      "message": "Your wallet has been credited with ₹1000",
      "type": "TRANSACTION",
      "read": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "unreadCount": 3
}
```

---

#### 14. Mark Notification as Read
**PATCH** `/api/notifications`
**Auth:** Required

**Request Body:**
```json
{
  "notificationId": "uuid"
}
```

**Response:**
```json
{
  "success": true
}
```

---

### Cron Job APIs

#### 15. Daily Income Cron
**GET** `/api/cron/daily-income`

This endpoint should be called daily (via cron scheduler) to credit daily income to all active investments.

**Response:**
```json
{
  "success": true,
  "message": "Daily income credited successfully",
  "processed": 150,
  "totalAmount": 18000
}
```

---

## 🔒 Error Responses

All endpoints return standard error responses:

**401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

**400 Bad Request:**
```json
{
  "error": "Minimum recharge amount is ₹100"
}
```

**404 Not Found:**
```json
{
  "error": "Wallet not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to process request"
}
```

---

## 📊 Data Types

### Transaction Types
- `DEPOSIT` - Wallet recharge
- `WITHDRAWAL` - Withdrawal request
- `INVESTMENT` - Investment purchase
- `DAILY_INCOME` - Daily earning credit
- `REFERRAL_COMMISSION` - Referral bonus
- `WITHDRAWAL_FEE` - Fee deduction
- `REFUND` - Money returned

### Transaction Status
- `PENDING` - Awaiting processing
- `COMPLETED` - Successfully processed
- `FAILED` - Transaction failed
- `CANCELLED` - User cancelled

### Withdrawal Status
- `PENDING` - Awaiting admin approval
- `APPROVED` - Approved by admin
- `REJECTED` - Rejected by admin
- `PROCESSING` - Being processed
- `COMPLETED` - Money sent

### Investment Status
- `ACTIVE` - Currently earning
- `COMPLETED` - Validity ended
- `CANCELLED` - User cancelled

### User Roles
- `USER` - Regular user
- `ADMIN` - Administrator
- `SUPER_ADMIN` - Super administrator

---

## 🧪 Testing with cURL

### Example: Complete Flow

```cmd
# 1. Register
curl -X POST http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"Test@123\",\"name\":\"Test User\"}"

# 2. Login (save token from response)
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"Test@123\"}"

# 3. Recharge Wallet
curl -X POST http://localhost:3000/api/wallet/recharge ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"amount\":1000,\"paymentMethod\":\"UPI\"}"

# 4. Get Plans
curl http://localhost:3000/api/plans

# 5. Create Investment
curl -X POST http://localhost:3000/api/investments/create ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"planId\":\"PLAN_UUID\",\"amount\":550}"

# 6. Request Withdrawal
curl -X POST http://localhost:3000/api/wallet/withdraw ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"amount\":500,\"bankAccount\":\"1234567890\",\"ifscCode\":\"SBIN0001234\"}"
```

---

## 🔐 Security Notes

1. **Always use HTTPS** in production
2. **Token expiry:** Access tokens expire after 15 minutes
3. **Refresh tokens:** Valid for 7 days
4. **Password requirements:** Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number
5. **Rate limiting:** Implement in production
6. **SQL injection:** Protected by Prisma ORM
7. **XSS protection:** Sanitize all inputs

---

## 📝 Notes

- All amounts are in INR (₹)
- Dates are in ISO 8601 format
- All responses are in JSON
- Minimum withdrawal: ₹500
- Minimum recharge: ₹100
- No withdrawal fees currently

---

**API is fully functional and ready for integration!** 🚀
