# Quick Start Guide - Day 51 Features

## 🚀 How to Use the New Features

### 1. Access User Management
- **URL**: `http://localhost:3000/users/management`
- **Features**: Search, sort, and paginate through all users
- **What you can do**:
  - Search by name, email, mobile, village, or farm name
  - Sort by name, email, mobile, village, farm, or creation date
  - Navigate through pages with smart pagination
  - Change records per page (5, 10, 20, 50)
  - Reset all filters

### 2. Access Registration Management
- **URL**: `http://localhost:3000/registrations/management`
- **Features**: Monitor all user registrations
- **What you can do**:
  - View all registered users
  - Search registrations
  - Sort by newest/oldest or other fields
  - See registration dates and times
  - Paginate through registrations

## 📡 API Endpoint Format

All requests use query parameters:
```
GET /users?search=value&page=1&limit=10&sort=fullName&order=asc
```

### Query Parameter Reference
| Parameter | Type | Default | Example |
|-----------|------|---------|---------|
| search | string | "" | "farm connect" |
| page | number | 1 | 2 |
| limit | number | 10 | 20 |
| sort | string | "fullName" | "email" |
| order | string | "asc" | "desc" |

## 🎯 Code Examples

### Using fetchUsers in Component
```javascript
import { fetchUsers } from "../../api/api";

// Simple fetch
const data = await fetchUsers({ page: 1, limit: 10 });

// With search
const searchResults = await fetchUsers({
  search: "farmer",
  page: 1,
  limit: 10
});

// With sorting
const sorted = await fetchUsers({
  sort: "createdAt",
  order: "desc",
  page: 1,
  limit: 10
});

// Combined
const filtered = await fetchUsers({
  search: "john",
  sort: "fullName",
  order: "asc",
  page: 1,
  limit: 20
});
```

### Response Structure
```javascript
{
  "success": true,
  "users": [
    {
      "_id": "...",
      "fullName": "John Farmer",
      "email": "john@farm.com",
      "mobile": "9876543210",
      "village": "Village Name",
      "farmName": "Farm Name",
      "userType": "farmer",
      "createdAt": "2024-01-15T10:30:00Z",
      ...
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "pageSize": 10,
    "totalRecords": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## 🔧 Integrating into Your Own Pages

### Step 1: Import Components
```javascript
import { fetchUsers } from "../../api/api";
import Pagination from "../../Components/Pagination/Pagination";
import SearchAndSort from "../../Components/SearchAndSort/SearchAndSort";
import Loader from "../../Components/Loader/Loader";
import ErrorMessage from "../../Components/ErrorMessage/ErrorMessage";
```

### Step 2: Setup State
```javascript
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [searchValue, setSearchValue] = useState("");
const [sortField, setSortField] = useState("fullName");
const [sortOrder, setSortOrder] = useState("asc");
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [pagination, setPagination] = useState({});
```

### Step 3: Create Load Function
```javascript
const loadUsers = async (page = 1, search = "", sort = "fullName", order = "asc", limit = 10) => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await fetchUsers({
      search: search.trim(),
      page,
      limit,
      sort,
      order
    });
    
    if (response.success) {
      setUsers(response.users);
      setPagination(response.pagination);
    } else {
      setError(response.message);
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Step 4: Add Components to Render
```jsx
<Loader isLoading={loading} message="Loading users..." />
{error && <ErrorMessage message={error} />}

<SearchAndSort
  searchValue={searchValue}
  onSearchChange={(v) => {
    setSearchValue(v);
    setCurrentPage(1);
    loadUsers(1, v, sortField, sortOrder, pageSize);
  }}
  sortField={sortField}
  onSortChange={(f) => {
    setSortField(f);
    setCurrentPage(1);
    loadUsers(1, searchValue, f, sortOrder, pageSize);
  }}
  sortOrder={sortOrder}
  onOrderChange={(o) => {
    setSortOrder(o);
    setCurrentPage(1);
    loadUsers(1, searchValue, sortField, o, pageSize);
  }}
  pageSize={pageSize}
  onPageSizeChange={(s) => {
    setPageSize(s);
    setCurrentPage(1);
    loadUsers(1, searchValue, sortField, sortOrder, s);
  }}
  onReset={() => {
    setSearchValue("");
    setSortField("fullName");
    setSortOrder("asc");
    setPageSize(10);
    setCurrentPage(1);
    loadUsers(1, "", "fullName", "asc", 10);
  }}
  sortOptions={[
    { label: "Full Name", value: "fullName" },
    { label: "Email", value: "email" },
    // ... more options
  ]}
/>

{users.length > 0 && (
  <>
    {/* Your table/list here */}
    <Pagination
      currentPage={currentPage}
      totalPages={pagination.totalPages}
      totalRecords={pagination.totalRecords}
      pageSize={pageSize}
      onPageChange={(p) => {
        setCurrentPage(p);
        loadUsers(p, searchValue, sortField, sortOrder, pageSize);
      }}
    />
  </>
)}
```

## 🎨 Component Props Reference

### SearchAndSort Props
```javascript
{
  searchValue: string,           // Current search value
  onSearchChange: function,      // Called when search changes
  sortField: string,             // Current sort field
  onSortChange: function,        // Called when sort field changes
  sortOrder: "asc" | "desc",    // Current sort order
  onOrderChange: function,       // Called when sort order changes
  pageSize: number,              // Current page size
  onPageSizeChange: function,    // Called when page size changes
  onReset: function,             // Called when reset is clicked
  sortOptions: [{                // Available sort fields
    label: string,
    value: string
  }]
}
```

### Pagination Props
```javascript
{
  currentPage: number,           // Current page number
  totalPages: number,            // Total number of pages
  totalRecords: number,          // Total records count
  pageSize: number,              // Records per page
  onPageChange: function         // Called when page changes
}
```

### Loader Props
```javascript
{
  isLoading: boolean,            // Show/hide loader
  message: string                // Loading message text
}
```

## 🧪 Testing Scenarios

### Test 1: Search Functionality
1. Go to `/users/management`
2. Type "farm" in search box
3. Wait 500ms (debounce delay)
4. Verify results are filtered
5. Clear search and verify all users return

### Test 2: Pagination
1. Go to `/users/management`
2. Change page size to 5
3. Click "Next >" button
4. Verify page 2 loads with different records
5. Click page number directly
6. Verify correct page loads

### Test 3: Sorting
1. Go to `/users/management`
2. Select "Email" from sort dropdown
3. Verify table sorted by email
4. Click "↓ Descending" 
5. Verify sort order reversed

### Test 4: Combined Filters
1. Type "farm" in search
2. Change sort to "Village"
3. Change to descending
4. Go to page 2
5. Verify all filters applied together

### Test 5: Reset
1. Apply various filters
2. Click "↻ Reset" button
3. Verify all filters cleared
4. Verify back to page 1 with default sort

## 📊 Performance Notes

- **Search Debounce**: 500ms delay reduces API calls
- **Page Size Options**: 5-50 records per page
- **Max Pages Display**: 5 page numbers at a time
- **Smart Pagination**: Only fetches data needed for current page

## ⚠️ Common Issues & Solutions

### Issue: Search not working
- **Solution**: Check that backend userController has updated getUsers function
- **Solution**: Verify search fields in backend match frontend searchable fields

### Issue: Pagination not displaying correctly
- **Solution**: Ensure pagination metadata is returned from API
- **Solution**: Check that totalPages calculation is correct (totalRecords / pageSize)

### Issue: Sorting not working
- **Solution**: Verify sort field exists in user document
- **Solution**: Check that sort option value matches database field name

### Issue: Loading spinner stuck
- **Solution**: Check browser console for API errors
- **Solution**: Verify API endpoint is running on http://localhost:8000

## 🎯 Next Steps

1. Add search, pagination, and sorting to products
2. Add filtering by user type (farmer, buyer, etc.)
3. Add date range filtering for registration dates
4. Implement CSV export functionality
5. Add bulk actions (delete multiple users)

## 📞 Support

For issues or questions:
1. Check the DAY-51-IMPLEMENTATION-GUIDE.md for detailed documentation
2. Review component code comments
3. Check browser console for error messages
4. Test API endpoints directly using Postman or curl
