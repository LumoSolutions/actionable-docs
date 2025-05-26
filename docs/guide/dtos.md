# Data Transfer Objects (DTOs)

Data Transfer Objects (DTOs) are simple classes that carry data between different parts of your 
application. In Actionable, DTOs come with superpowers - they can seamlessly convert between arrays 
and objects, making them perfect for APIs, form handling, and data validation.

## What is a DTO?

A DTO is a plain PHP class that holds data without any business logic. DTOs help you:

- **Structure Data** - Define exactly what data you're working with
- **Type Safety** - Get IDE completion and catch errors early
- **API Consistency** - Ensure your API responses have consistent structure
- **Validation** - Centralize data validation rules
- **Documentation** - Your data structure becomes self-documenting

## Creating DTOs

### Generate a DTO

Use the Artisan command to create a new DTO:

```bash
php artisan make:dto UserRegistrationData
```

This creates a file at `app/DataTransferObjects/UserRegistrationData.php`:

```php
<?php

namespace App\DataTransferObjects;

use LumoSolutions\Actionable\Traits\ArrayConvertible;

class UserRegistrationData
{
    use ArrayConvertible;

    public function __construct(
        //define your properties here
    ) {}
}
```

### Define Your Data Structure

Add properties using constructor property promotion.  These are the only properties that can be set when
creating a new instance of the DTO. You can also use the `#[FieldName]` attribute to customize the field 
names when converting to/from arrays.

```php
<?php

namespace App\DataTransferObjects;

use LumoSolutions\Actionable\Traits\ArrayConvertible;

class UserRegistrationData
{
    use ArrayConvertible;

    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public ?string $phone = null,
        public bool $acceptsMarketing = false
    ) {}
}
```

## Array Conversion

The `ArrayConvertible` trait provides powerful conversion methods:

### From Array to DTO

Convert arrays (like request data) into typed DTOs:

```php
// From request
$userData = UserRegistrationData::fromArray($request->validated());

// From any array
$userData = UserRegistrationData::fromArray([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'password' => 'secret123',
    'phone' => '555-1234'
]);
```

### From DTO to Array

Convert DTOs back to arrays for JSON responses or storage:

```php
$userData = new UserRegistrationData(
    name: 'John Doe',
    email: 'john@example.com',
    password: 'secret123'
);

$array = $userData->toArray();
// Result: ['name' => 'John Doe', 'email' => 'john@example.com', ...]
```

## Working with Controllers

DTOs make controllers clean and type-safe:

```php
class UserController extends Controller
{
    public function register(Request $request)
    {
        // Convert request to DTO
        $userData = UserRegistrationData::fromArray(
            $request->validated()
        );
        
        // Pass to action
        $user = RegisterUser::run($userData);
        
        // Convert back for response
        return response()->json([
            'user' => $user,
            'registration_data' => $userData->toArray()
        ]);
    }
}
```

## Using DTOs in Actions

DTOs work perfectly with actions:

```php
class RegisterUser
{
    use IsRunnable;

    public function handle(UserRegistrationData $data): User
    {
        // Type-safe access to all properties
        $user = User::create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => bcrypt($data->password),
            'phone' => $data->phone,
            'accepts_marketing' => $data->acceptsMarketing,
        ]);

        if ($data->acceptsMarketing) {
            SubscribeToNewsletter::run($user);
        }

        return $user;
    }
}
```

## Nested DTOs

DTOs can contain other DTOs for complex data structures:

```php
class OrderItemData
{
    use ArrayConvertible;

    public function __construct(
        public int $productId,
        public string $productName,
        public int $quantity,
        public float $price
    ) {}
}

class OrderData
{
    use ArrayConvertible;

    public function __construct(
        public string $customerEmail,
        
        #[ArrayOf(OrderItemData::class)]
        public array $items, // Will contain OrderItemData objects
        
        public ?string $discountCode = null
    ) {}
}
```

To handle nested DTOs, you'll need the `#[ArrayOf]` attribute (covered in the [Attributes guide](/guide/attributes)).

## Default Values

Use default values for optional properties:

```php
class ProductData
{
    use ArrayConvertible;

    public function __construct(
        public string $name,
        public float $price,
        public string $description = '',
        public bool $isActive = true,
        public int $stock = 0,
        public ?string $category = null
    ) {}
}

// Can create with minimal data
$product = ProductData::fromArray([
    'name' => 'Widget',
    'price' => 29.99
]);
// description = '', isActive = true, stock = 0, category = null
```

## Validation

Combine DTOs with Laravel validation via FormRequests for robust data handling, keeping your controllers
clean and focused:

```php
class CreateProductRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:1000',
            'category' => 'nullable|exists:categories,id',
            'stock' => 'integer|min:0',
        ];
    }

    public function toDto(): ProductData
    {
        return ProductData::fromArray($this->validated());
    }
}

// In controller
class ProductController extends Controller
{
    public function store(CreateProductRequest $request)
    {
        $productData = $request->toDto();
        $product = CreateProduct::run($productData);
        
        return response()->json($product);
    }
}
```

## Testing with DTOs

DTOs make testing cleaner and more reliable:

```php
class RegisterUserTest extends TestCase
{
    public function test_registers_user_successfully()
    {
        $userData = new UserRegistrationData(
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            acceptsMarketing: true
        );

        $user = RegisterUser::run($userData);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('John Doe', $user->name);
        $this->assertEquals('john@example.com', $user->email);
        $this->assertTrue($user->accepts_marketing);
    }

    public function test_creates_dto_from_array()
    {
        $data = [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'secret123'
        ];

        $dto = UserRegistrationData::fromArray($data);

        $this->assertEquals('Jane Doe', $dto->name);
        $this->assertEquals('jane@example.com', $dto->email);
        $this->assertFalse($dto->acceptsMarketing); // default value
    }
}
```

## What's Next?

- **[Attributes](/guide/attributes)** - Learn about powerful DTO attributes
- **[Queues](/guide/queues)** - Use DTOs with queueable actions