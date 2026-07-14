# 📝 Coding Standards - LanguageLearn

Quy tắc viết code chung cho cả **Backend (Django)** và **Frontend (React Native + Next.js)**. Mọi thành viên trong team cần tuân thủ các quy tắc này.

---

## 1. Tổng quan các Principles

- **Clean Code**: Đặt tên rõ ràng, hàm ngắn gọn, dễ đọc
- **DRY**: Don't Repeat Yourself - tránh lặp code
- **KISS**: Keep It Simple, Stupid - đơn giản hóa
- **YAGNI**: You Aren't Gonna Need It - không code thừa tính năng
- **Consistent**: nhất quán trong toàn dự án
- **Security First**: luôn nghĩ đến bảo mật khi viết code

---

## 2. Quy tắc chung

### 2.1 Ngôn ngữ
| Thành phần | Ngôn ngữ code | Ngôn ngữ comment/UI |
|-----------|--------------|-------------------|
| Backend | Python | Tiếng Việt / English |
| Mobile | JavaScript | Tiếng Việt (UI text) / English (code) |
| Web | JavaScript | Tiếng Việt (UI text) / English (code) |

### 2.2 Commit Messages
Tuân theo **Conventional Commits**:
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

| Type | Mô tả | Ví dụ |
|------|-------|-------|
| `feat` | Tính năng mới | `feat(vocabulary): add spaced repetition review API` |
| `fix` | Sửa bug | `fix(login): handle 401 on expired token` |
| `docs` | Documentation | `docs: update backend README` |
| `style` | Formatting (không đổi logic) | `style: format code with black` |
| `refactor` | Refactor code | `refactor(store): split userSlice` |
| `perf` | Performance | `perf(api): add pagination to vocabulary list` |
| `test` | Tests | `test(account): add login unit tests` |
| `chore` | Maintenance | `chore: update dependencies` |
| `ci` | CI/CD | `ci: add GitHub Actions workflow` |

---

## 3. Backend - Python / Django

### 3.1 Code Style
- Tuân theo **PEP 8**
- Dùng **Black** để format: `black .`
- Dùng **isort** để sort imports: `isort .`
- Line length: **88 characters** (mặc định Black)
- Indentation: **4 spaces** (không dùng tab)

### 3.2 Naming Conventions

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| Class | PascalCase | `class AudioLesson(models.Model)` |
| Function/Method | snake_case | `def get_audio_lesson(request, pk)` |
| Variable | snake_case | `user_vocabularies` |
| Constant | UPPER_SNAKE_CASE | `MAX_FILE_SIZE = 10 * 1024 * 1024` |
| Django Model | PascalCase (singular) | `class Vocabulary(models.Model)` |
| Django Model Meta | PascalCase | `class Meta:` |
| URL pattern | kebab-case | `path('audio-lessons/', ...)` |

### 3.3 Django-specific Rules

#### Models
```python
class Vocabulary(BaseModel):
    # Fields: snake_case
    word = models.CharField(max_length=100)
    part_of_speech = models.CharField(max_length=50, choices=...)

    class Meta:
        verbose_name_plural = "vocabularies"
        ordering = ['word']

    def __str__(self) -> str:
        return self.word
```

- Mỗi model phải có `__str__` method
- Dùng `BaseModel` (common/models.py) thay vì `models.Model` trực tiếp để có `created_at`, `updated_at`
- Dùng `on_delete=models.SET_NULL` cho ForeignKey nullable
- Dùng `on_delete=models.CASCADE` cho required relationship
- Field danh sách chọn (choices): dùng tuple of tuples

#### Views
```python
class VocabularyViewSet(viewsets.ModelViewSet):
    queryset = Vocabulary.objects.all()
    serializer_class = VocabularySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['word', 'meaning']
    ordering_fields = ['word', 'created_at']
    ordering = ['word']

    @action(detail=False, methods=['GET'])
    def by_topic(self, request):
        """Custom action - get vocab by topic."""
        topic_id = request.query_params.get('topic_id')
        # ...
```

- Dùng **ViewSets** thay vì APIView khi có CRUD
- Custom actions dùng `@action` decorator
- Luôn thêm **docstring** cho custom actions
- Dùng `permission_classes` rõ ràng cho từng ViewSet

#### Serializers
```python
class VocabularySerializer(serializers.ModelSerializer):
    level_details = LevelSerializer(source='level', read_only=True)
    topics_details = TopicSerializer(source='topics', many=True, read_only=True)

    class Meta:
        model = Vocabulary
        fields = '__all__'

    def get_synonyms_details(self, obj):
        return VocabularyBasicSerializer(obj.synonyms.all(), many=True).data
```

- Dùng `read_only=True` cho field tự động generated
- Dùng `SerializerMethodField()` cho computed field
- Luôn tạo `BasicSerializer` cho nested references (tránh circular import)

#### APIs / Responses
```python
def convert_response(message: str, code: int, data=None):
    """Format response chuẩn."""
    result = {'message': message, 'code': code}
    if data is not None:
        result['data'] = data
    return result

# Usage
return Response(convert_response("Success", 200, serializer.data))
```

- Luôn trả về format chuẩn: `{'message': ..., 'code': ..., 'data': ...}`
- Status code phù hợp: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauth), 403 (Forbidden), 404 (Not Found), 500 (Error)

### 3.4 Error Handling
```python
try:
    user = Account.objects.get(username=username)
except Account.DoesNotExist:
    return Response(convert_response("Invalid username", 400))
```

- Catch specific exceptions, không catch `Exception` chung
- Log errors ra console/file
- Return error message rõ ràng, không expose internal details

### 3.5 Comments
```python
# Short inline comment - giải thích WHY, không phải WHAT

def complex_calculation(data):
    # Sử dụng cached result để giảm query time (lần 2 trở lên chạy trong ~1ms)
    ...
```

---

## 4. Frontend - React (Mobile + Web)

### 4.1 File Naming
| Loại | Convention | Ví dụ |
|------|-----------|-------|
| Component file | PascalCase | `LoginForm.js`, `HomeScreen.js` |
| Screen (RN) | PascalCase + `Screen` | `VocabularyScreen.js` |
| Service file | camelCase + `Service` | `vocabularyService.js` |
| Store/Slice file | camelCase + `Slice` | `userSlice.js` |
| Utility file | camelCase | `tokenService.js`, `general.js` |

### 4.2 Component Structure (React)
```jsx
// 1. Import section (đúng thứ tự)
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import styles from './styles/MyComponentStyles';

// 2. Component definition
export default function MyComponent({ navigation, route }) {
  // 2a. Hooks (top của function)
  const [state, setState] = useState(initial);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // 2b. Effects
  useEffect(() => {
    // ...
  }, []);

  // 2c. Handlers
  const handlePress = () => {
    // ...
  };

  // 2d. Computed values
  const isDisabled = !username || !password;

  // 2e. Render
  return (
    <View>
      <Text>{user?.username}</Text>
    </View>
  );
}
```

### 4.3 Naming Conventions (JavaScript)
| Loại | Convention | Ví dụ |
|------|-----------|-------|
| Component | PascalCase | `function LoginScreen()` |
| Variable | camelCase | `userVocabulary` |
| Function | camelCase | `handleLogin`, `getUserProgress` |
| Constant | UPPER_SNAKE_CASE | `SERVER_URL`, `MAX_RETRY` |
| Event handler | `handle` prefix | `handleSubmit`, `handlePress` |
| Boolean | `is`, `has`, `should` prefix | `isLoading`, `hasError`, `shouldShow` |
| Class names (Tailwind) | hyphenated | `text-lg`, `font-bold` |

### 4.4 Hooks Rules
- Chỉ gọi hooks ở **top level** (không trong if/loop)
- Luôn dùng `useCallback` cho handlers passed as props
- Luôn dùng `useMemo` cho expensive computations
- Dùng custom hooks cho logic reusable: `useAuth`, `useVocabulary`

### 4.5 State Management (Redux)
```js
//Slice pattern - immer built-in, mutate directly
const userSlice = createSlice({
  name: 'user',
  initialState: { currentUser: null, loading: false },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      });
  },
});
```

- Mỗi slice quản lý **một domain** (user, vocabulary, listening)
- Dùng `createAsyncThunk` cho async actions
- Normalize data: đừng lưu object lồng nhau quá sâu
- Giữ state **flat** khi có thể

### 4.6 Services Pattern
```js
// services/vocabularyService.js
import api from './api';

export const vocabularyService = {
  getAll: async () => {
    const { data } = await api.get('/vocabulary/');
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/vocabulary/${id}/`);
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post('/vocabulary/', payload);
    return data;
  },
};
```

- Mỗi domain có 1 service file
- Function names dùng verb: `getAll`, `getById`, `create`, `update`, `delete`
- Luôn throw error để component xử lý

### 4.7 Styling
- **Mobile (NativeWind)**: 100% Tailwind utility classes trong JSX
- **Web**: 100% Tailwind utility classes trong JSX
- **Không dùng CSS Modules** hoặc styled-components (trừ khi cần animation phức tạp)
- Reusable styles: extract thành component, không inline `style` prop

```jsx
// ✅ GOOD - Tailwind classes
<View className="bg-white rounded-xl shadow-sm p-6">

// ❌ BAD - inline style (trừ khi dynamic)
<View style={{ backgroundColor: 'white', padding: 24 }}>

// ✅ GOOD - extracted for reuse
const Card = ({ children, title }) => (
  <View className="bg-white rounded-xl shadow-sm p-6">
    <Text className="text-xl font-bold mb-3">{title}</Text>
    {children}
  </View>
);
```

### 4.8 Error Handling
```jsx
const handleSubmit = async () => {
  try {
    await dispatch(login(payload)).unwrap();
    router.push('/home');
  } catch (err) {
    toast.error(err || 'Login failed');
  }
};
```

- Luôn dùng try/catch cho async operations
- Dùng `.unwrap()` với Redux async thunks để catch auto
- Show toast/snackbar cho user feedback

### 4.9 Comments
```jsx
// ✅ GOOD - giải thích WHY
// Retry logic: backend có thể trả 503 khi maintenance
if (retryCount < MAX_RETRY) { ... }

// ❌ BAD - giải thích WHAT (code đã nói rồi)
// Tăng retry count lên 1
retryCount += 1;
```

---

## 5. Git Workflow

### Branch Naming
```
feature/task-ten-tinh-nang      # Tính năng mới
fix/bug-ten-bug                  # Sửa bug
refactor/ten-refactor            # Refactor
docs/ten-docs                    # Documentation
chore/ten-chore                  # Maintenance
```

### PR naming
```
[feat] Add vocabulary spaced repetition
[fix] Login 401 error on token expiration
[docs] Update README with setup instructions
```

### PR Checklist
- [ ] Code đã format (black / prettier)
- [ ] `description` rõ ràng
- [ ] Tests pass (nếu có)
- [ ] Không có hardcoded secrets/credentials
- [ ] UI đã review theo design system
- [ ] API đã test (hoặc có postman collection)
- [ ] Breaking changes đã ghi chú

---

## 6. Security

### Backend
- **Không commit** `.env`, `settings_local.py`, secrets
- Validate input ở **serializer level** (DRF)
- Dùng `IsAuthenticated` / `IsAuthenticatedOrReadOnly` phù hợp
- Rate limiting cho auth endpoints (tránh brute force)
- File upload: validate size, type, extension
- SQL Injection: DRF ORM tự bảo vệ, không dùng raw SQL
- CORS: chỉ allow origins cụ thể

### Frontend
- **Không hardcode** API URLs, API keys trong code
- Token lưu trong: AsyncStorage (mobile) / HttpOnly cookie (web)
- Input validation trước khi gửi API
- XSS prevention: React tự escape, không dùng `dangerouslySetInnerHTML`
- HTTPS only trong production

---

## 7. Testing (Chưa implement - nên có)

### Backend (pytest + DRF test)
```python
class VocabularyViewSetTest(APITestCase):
    def setUp(self):
        self.user = Account.objects.create_user('test', 'test@test.com', 'pass123')
        self.client.force_authenticate(user=self.user)

    def test_list_vocabulary(self):
        response = self.client.get('/api/vocabulary/')
        self.assertEqual(response.status_code, 200)
```

### Frontend (Jest + React Testing Library)
```jsx
describe('LoginScreen', () => {
  it('should submit login form', async () => {
    render(<LoginScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'test');
    fireEvent.press(screen.getByText('Sign In'));
    await waitFor(() => expect(mockLogin).toHaveBeenCalled());
  });
});
```

---

## 8. Review Checklist

Khi review code, kiểm tra:
- [ ] Code đúng conventions đã định
- [ ] Tên biến/hàm rõ nghĩa
- [ ] Không có code thừa / dead code
- [ ] Error handling đầy đủ
- [ ] Không có hardcoded values (magic numbers)
- [ ] Logging phù hợp (không log sensitive data)
- [ ] Performance: không có N+1 queries, không re-render thừa
- [ ] Security: validate input, permission check
- [ ] Tests đầy đủ (unit + integration)
- [ ] Documentation updated
