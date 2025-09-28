Invoice App Development Plan
MVP Features Implementation
Core Files to Create/Modify:
src/app/page - Main dashboard with invoice statistics and recent invoices
src/app/InvoiceDetails.tsx - Detailed invoice view with PDF download
src/pages/Login.tsx - Authentication login page
src/pages/Signup.tsx - User registration page
src/components/InvoiceCard.tsx - Individual invoice card component
src/components/Sidebar.tsx - Navigation sidebar
src/lib/auth.js - Authentication utilities and Firebase setup
src/lib/websocket.js - Real-time data connection
Key Features:
Dashboard with invoice statistics (Total, Paid, Pending, Overdue)
Recent invoices list with status indicators
Invoice details view with line items
User authentication (login/signup)
Responsive design matching Figma
Loading states and error handling
Mock backend with real-time updates
Design Elements:
Clean sidebar navigation
Statistics cards with colored indicators
Invoice table with status badges
Activity timeline
Professional invoice layout
Mobile-responsive design
Technical Stack:
Next + JavaScript
Shadcn-UI components
Tailwind CSS
Mock authentication
WebSocket for real-time updates
Local storage for data persistence
