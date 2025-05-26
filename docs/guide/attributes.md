# Attributes

Attributes in Actionable are powerful decorators that control how your DTOs behave during array 
conversion. They give you fine-grained control over serialization, field naming, date formatting, 
and more.

## Available Attributes

Actionable provides several built-in attributes to enhance your DTOs:

- **`#[FieldName]`** - Map property names to different array keys
- **`#[DateFormat]`** - Control date serialisation format
- **`#[ArrayOf]`** - Handle arrays of nested objects
- **`#[Ignore]`** - Exclude properties from conversion

## FieldName Attribute

The `#[FieldName]` attribute lets you map DTO properties to different array keys. This is perfect for 
API consistency and legacy system integration.

### Basic Usage

```php
use LumoSolutions\Actionable\Attributes\FieldName;
use LumoSolutions\Actionable\Traits\ArrayConvertible;

class UserProfileData
{
    use ArrayConvertible;

    public function __construct(
        #[FieldName('user_id')]
        public int $userId,
        
        #[FieldName('full_name')]
        public string $fullName,
        
        #[FieldName('email_address')]
        public string $emailAddress,
        
        public string $phone // No attribute = uses property name
    ) {}
}
```

### API-Friendly Responses

Convert between PHP conventions (camelCase) and API conventions (snake_case):

```php
$user = new UserProfileData(
    userId: 123,
    fullName: 'John Doe',
    emailAddress: 'john@example.com',
    phone: '555-1234'
);

$array = $user->toArray();
// Result:
// [
//     'user_id' => 123,
//     'full_name' => 'John Doe', 
//     'email_address' => 'john@example.com',
//     'phone' => '555-1234'
// ]
```

### From Array Conversion

The attribute works both ways - from arrays to DTOs:

```php
$userData = UserProfileData::fromArray([
    'user_id' => 456,
    'full_name' => 'Jane Smith',
    'email_address' => 'jane@example.com',
    'phone' => '555-5678'
]);

// Creates DTO with proper property names:
// $userData->userId = 456
// $userData->fullName = 'Jane Smith'
// etc.
```

## DateFormat Attribute

The `#[DateFormat]` attribute controls how DateTime objects are serialised to arrays.

### Basic Date Formatting

```php
use LumoSolutions\Actionable\Attributes\DateFormat;
use Carbon\Carbon;

class EventData
{
    use ArrayConvertible;

    public function __construct(
        public string $title,
        
        #[DateFormat('Y-m-d')]
        public DateTime $date,
        
        #[DateFormat('H:i')]
        public DateTime $startTime,
        
        #[DateFormat('c')] // ISO 8601
        public DateTime $createdAt
    ) {}
}
```

### Example Usage

```php
$event = new EventData(
    title: 'Conference 2024',
    date: new DateTime('2024-06-15 14:30:00'),
    startTime: new DateTime('2024-06-15 14:30:00'),
    createdAt: new DateTime()
);

$array = $event->toArray();
// Result:
// [
//     'title' => 'Conference 2024',
//     'date' => '2024-06-15',
//     'startTime' => '14:30',
//     'createdAt' => '2024-06-15T14:30:00+00:00'
// ]
```

### Common Date Formats

```php
class AppointmentData
{
    use ArrayConvertible;

    public function __construct(
        #[DateFormat('Y-m-d')] // 2024-06-15
        public Carbon $date,
        
        #[DateFormat('H:i:s')] // 14:30:00
        public Carbon $time,
        
        #[DateFormat('M j, Y')] // Jun 15, 2024
        public Carbon $displayDate,
        
        #[DateFormat('U')] // Unix timestamp
        public Carbon $timestamp
    ) {}
}
```

## ArrayOf Attribute

The `#[ArrayOf]` attribute handles arrays containing objects of a specific type.

### Nested DTO Arrays

```php
use LumoSolutions\Actionable\Attributes\ArrayOf;

class OrderItemData
{
    use ArrayConvertible;

    public function __construct(
        public int $productId,
        public string $name,
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
        public array $items,
        
        public float $total
    ) {}
}
```

### Converting Complex Structures

```php
// From nested array
$orderData = OrderData::fromArray([
    'customerEmail' => 'customer@example.com',
    'items' => [
        [
            'productId' => 1,
            'name' => 'Widget',
            'quantity' => 2,
            'price' => 19.99
        ],
        [
            'productId' => 2,
            'name' => 'Gadget',
            'quantity' => 1,
            'price' => 49.99
        ]
    ],
    'total' => 89.97
]);

// $orderData->items now contains array of OrderItemData objects
foreach ($orderData->items as $item) {
    echo $item->name; // Type-safe access
}
```

## Ignore Attribute

The `#[Ignore]` attribute excludes properties from array conversion - perfect for sensitive data or 
internal properties.

### Hiding Sensitive Data

```php
use LumoSolutions\Actionable\Attributes\Ignore;

class UserAccountData
{
    use ArrayConvertible;

    public function __construct(
        public string $email,
        public string $name,
        
        #[Ignore]
        public string $password,
        
        #[Ignore]
        public string $apiSecret,
        
        #[Ignore]
        public ?string $internalNotes = null
    ) {}
}
```

### Example Usage

```php
$user = new UserAccountData(
    email: 'user@example.com',
    name: 'John Doe',
    password: 'secret123',
    apiSecret: 'sk_live_abc123',
    internalNotes: 'VIP customer'
);

$array = $user->toArray();
// Result - sensitive data excluded:
// [
//     'email' => 'user@example.com',
//     'name' => 'John Doe'
// ]
```

### Internal Calculations

Use `#[Ignore]` for computed or temporary properties:

```php
class ProductData
{
    use ArrayConvertible;

    public function __construct(
        public string $name,
        public float $basePrice,
        public float $taxRate,
        
        #[Ignore]
        public float $calculatedPrice, // Computed value
        
        #[Ignore]
        public bool $isProcessed = false // Internal flag
    ) {}
}
```

## Combining Attributes

You can use multiple attributes together for powerful data transformation:

```php
class OrderReportData
{
    use ArrayConvertible;

    public function __construct(
        #[FieldName('order_id')]
        public int $orderId,
        
        #[FieldName('customer_email')]
        public string $customerEmail,
        
        #[FieldName('order_date')]
        #[DateFormat('Y-m-d H:i:s')]
        public Carbon $orderDate,
        
        #[FieldName('line_items')]
        #[ArrayOf(OrderItemData::class)]
        public array $lineItems,
        
        #[Ignore]
        public string $internalOrderId,
        
        #[FieldName('total_amount')]
        public float $totalAmount
    ) {}
}
```

## Real-World Example

Here's a complete example showing all attributes working together:

```php
class CustomerOrderResponse
{
    use ArrayConvertible;

    public function __construct(
        #[FieldName('order_number')]
        public string $orderNumber,
        
        #[FieldName('customer_info')]
        public CustomerData $customer,
        
        #[FieldName('ordered_at')]
        #[DateFormat('c')] // ISO 8601
        public Carbon $orderedAt,
        
        #[FieldName('delivery_date')]
        #[DateFormat('Y-m-d')]
        public ?Carbon $deliveryDate,
        
        #[FieldName('items')]
        #[ArrayOf(OrderItemData::class)]
        public array $items,
        
        #[FieldName('order_total')]
        public float $orderTotal,
        
        #[Ignore]
        public string $internalReference,
        
        #[Ignore]
        public bool $requiresApproval
    ) {}
}

// Usage in API controller
class OrderApiController extends Controller
{
    public function show(Order $order)
    {
        $orderResponse = CustomerOrderResponse::fromArray([
            'order_number' => $order->number,
            'customer_info' => $order->customer,
            'ordered_at' => $order->created_at,
            'delivery_date' => $order->delivery_date,
            'items' => $order->items->toArray(),
            'order_total' => $order->total,
            'internalReference' => $order->internal_ref,
            'requiresApproval' => $order->needs_approval
        ]);

        return response()->json($orderResponse->toArray());
        // Returns clean, consistent API response with proper field names
    }
}
```

## What's Next?

- **[Queues](/guide/queues)** - Use DTOs with queueable actions
- **[Testing](/guide/testing)** - Test DTOs and attributes effectively