# Best Practices

This guide covers proven patterns and best practices specifically for creating and organizing Actions and DTOs in Actionable. These recommendations come from real-world usage and help you build maintainable, scalable applications.

## Action Best Practices

### Single Responsibility Principle

Each action should have one clear, focused responsibility:

```php
// ✅ Good - focused responsibility
class SendOrderConfirmationEmail
{
    use IsRunnable, IsDispatchable;

    public function handle(Order $order): void
    {
        Mail::to($order->customer_email)
            ->send(new OrderConfirmationEmail($order));
    }
}

// ❌ Avoid - too many responsibilities
class ProcessOrder
{
    use IsRunnable;

    public function handle(OrderData $data): Order
    {
        // Creates order
        $order = Order::create($data->toArray());
        
        // Processes payment
        $payment = Stripe::charge($data->paymentToken, $data->total);
        
        // Updates inventory
        foreach ($data->items as $item) {
            Product::find($item->productId)->decrement('stock', $item->quantity);
        }
        
        // Sends emails
        Mail::to($data->customerEmail)->send(new OrderConfirmation($order));
        Mail::to(config('admin.email'))->send(new NewOrderAlert($order));
        
        // Updates analytics
        Analytics::track('order_created', $order->id);
        
        return $order;
    }
}
```

Instead, break it down into focused actions:

```php
// ✅ Better - focused actions
class CreateOrder
{
    use IsRunnable;

    public function handle(OrderData $data): Order
    {
        return Order::create($data->toArray());
    }
}

class ProcessOrderWorkflow
{
    use IsRunnable;

    public function handle(OrderData $data): Order
    {
        $order = CreateOrder::run($data);
        
        ProcessPayment::dispatch($order, $data->paymentToken);
        UpdateInventory::dispatch($order);
        SendOrderConfirmation::dispatch($order);
        TrackOrderCreated::dispatch($order);
        
        return $order;
    }
}
```

### Action Naming Conventions

Use descriptive, verb-based names that clearly indicate what the action does:

```php
// ✅ Good - clear, descriptive names
SendWelcomeEmail::run($user);
CalculateShippingCost::run($order);
ProcessCreditCardPayment::run($payment);
GenerateMonthlyReport::run($month, $year);
ValidateOrderData::run($orderData);

// ❌ Avoid - vague or noun-based names
EmailUser::run($user);              // What kind of email?
Calculate::run($order);             // Calculate what?
Payment::run($payment);             // Process? Validate? Refund?
Report::run($month, $year);         // What kind of report?
Validator::run($orderData);         // Validate what?
```

### Parameter Organization

Structure action parameters thoughtfully:

```php
// ✅ Good - logical parameter order
class CreateUser
{
    use IsRunnable;

    public function handle(
        UserRegistrationData $userData,    // Primary data first
        bool $sendWelcomeEmail = true,     // Options second
        ?string $referralCode = null       // Optional context last
    ): User {
        // Implementation
    }
}

// ✅ Good - use DTOs for complex data
class ProcessOrder
{
    use IsRunnable;

    public function handle(OrderData $orderData): Order
    {
        // All order-related data is organized in the DTO
    }
}

// ❌ Avoid - too many primitive parameters
class CreateUser
{
    use IsRunnable;

    public function handle(
        string $name,
        string $email,
        string $password,
        ?string $phone,
        bool $acceptsMarketing,
        ?string $referralCode,
        string $timezone,
        array $preferences
    ): User {
        // Hard to remember parameter order and types
    }
}
```

### Error Handling Patterns

Implement consistent error handling in your actions:

```php
class ProcessPayment
{
    use IsRunnable, IsDispatchable;

    public function handle(Order $order, string $paymentToken): Payment
    {
        try {
            $payment = $this->chargePayment($order, $paymentToken);
            
            // Update order status on success
            $order->update(['status' => 'paid']);
            
            return $payment;
            
        } catch (PaymentDeclinedException $e) {
            // Handle specific business exceptions
            Log::warning('Payment declined', [
                'order_id' => $order->id,
                'reason' => $e->getMessage()
            ]);
            
            $order->update(['status' => 'payment_failed']);
            
            throw new OrderPaymentFailedException(
                "Payment declined for order {$order->id}: {$e->getMessage()}",
                previous: $e
            );
            
        } catch (PaymentServiceException $e) {
            // Handle service-level exceptions
            Log::error('Payment service error', [
                'order_id' => $order->id,
                'error' => $e->getMessage()
            ]);
            
            // Don't update order status - this might be temporary
            throw new TemporaryPaymentException(
                "Payment service temporarily unavailable",
                previous: $e
            );
        }
    }
}
```

### Action Composition Patterns

Build complex workflows by composing simple actions:

```php
// ✅ Good - composition pattern
class UserRegistrationWorkflow
{
    use IsRunnable;

    public function handle(UserRegistrationData $userData): User
    {
        // Each step is a focused action
        $user = CreateUser::run($userData);
        
        // Queue background tasks
        SendWelcomeEmail::dispatch($user);
        
        if ($userData->acceptsMarketing) {
            SubscribeToNewsletter::dispatch($user);
        }
        
        if ($userData->referralCode) {
            ProcessReferral::dispatch($user, $userData->referralCode);
        }
        
        // Track the event
        TrackUserRegistration::dispatch($user, $userData->source);
        
        return $user;
    }
}
```

## DTO Best Practices

### Descriptive Naming

Name DTOs based on their specific purpose and context:

```php
// ✅ Good - purpose-specific names
UserRegistrationData::class     // For user registration forms
OrderCheckoutData::class        // For order checkout process
ProductApiResponse::class       // For API product responses
PaymentRequestData::class       // For payment processing
EmailTemplateData::class        // For email template rendering

// ❌ Avoid - generic names
UserData::class                 // Too generic - what kind of user data?
OrderData::class                // Registration? Update? Checkout?
ProductData::class              // API response? Database insert?
PaymentData::class              // Request? Response? Configuration?
EmailData::class                // Template? Log? Configuration?
```

### Property Organization

Organize DTO properties logically:

```php
// ✅ Good - logical grouping and ordering
class UserRegistrationData
{
    use ArrayConvertible;

    public function __construct(
        // Core identity first
        public string $name,
        public string $email,
        public string $password,
        
        // Contact information
        public ?string $phone = null,
        
        // Preferences and settings
        public bool $acceptsMarketing = false,
        public string $timezone = 'UTC',
        
        // Optional metadata last
        public ?string $referralCode = null,
        public ?array $customFields = null
    ) {}
}
```

### Attribute Usage Patterns

Use attributes consistently and purposefully:

```php
class OrderApiResponse
{
    use ArrayConvertible;

    public function __construct(
        // API field naming consistency
        #[FieldName('order_id')]
        public int $orderId,
        
        #[FieldName('customer_email')]
        public string $customerEmail,
        
        // Date formatting for APIs
        #[FieldName('created_at')]
        #[DateFormat('c')] // ISO 8601
        public DateTime $createdAt,
        
        #[FieldName('delivery_date')]
        #[DateFormat('Y-m-d')] // Date only
        public ?DateTime $deliveryDate,
        
        // Nested data structures
        #[FieldName('line_items')]
        #[ArrayOf(OrderItemData::class)]
        public array $lineItems,
        
        // Internal data not exposed in API
        #[Ignore]
        public string $internalReference,
        
        #[Ignore]
        public bool $requiresReview
    ) {}
}
```

### Immutability Patterns

Leverage readonly classes for immutable data:

```php
// ✅ Good - immutable DTO with helper methods
readonly class ProductData
{
    use ArrayConvertible;

    public function __construct(
        public string $name,
        public float $price,
        public int $stock,
        public bool $isActive = true
    ) {}

    public function withPrice(float $newPrice): self
    {
        return new self(
            name: $this->name,
            price: $newPrice,
            stock: $this->stock,
            isActive: $this->isActive
        );
    }

    public function withStock(int $newStock): self
    {
        return new self(
            name: $this->name,
            price: $this->price,
            stock: $newStock,
            isActive: $this->isActive
        );
    }
}

// Usage
$product = ProductData::fromArray($request->validated());
$discountedProduct = $product->withPrice($product->price * 0.9);
```

### Validation Integration

Integrate DTOs with Laravel's validation:

```php
class UserRegistrationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'accepts_marketing' => 'boolean',
        ];
    }

    public function toDto(): UserRegistrationData
    {
        return UserRegistrationData::fromArray($this->validated());
    }
}

// In controller
class AuthController extends Controller
{
    public function register(UserRegistrationRequest $request)
    {
        $userData = $request->toDto();
        $user = RegisterUser::run($userData);
        
        return response()->json(['user' => $user]);
    }
}
```

## Organizational Patterns

### Directory Structure

Organize actions and DTOs by domain:

```
app/
├── Actions/
│   ├── Auth/
│   │   ├── LoginUser.php
│   │   ├── RegisterUser.php
│   │   └── LogoutUser.php
│   ├── Orders/
│   │   ├── CreateOrder.php
│   │   ├── ProcessPayment.php
│   │   ├── UpdateInventory.php
│   │   └── Shipping/
│   │       ├── CalculateShipping.php
│   │       └── CreateShipment.php
│   ├── Email/
│   │   ├── SendWelcomeEmail.php
│   │   ├── SendOrderConfirmation.php
│   │   └── SendPasswordReset.php
│   └── Reports/
│       ├── GenerateSalesReport.php
│       └── GenerateUserReport.php
└── Dtos/
    ├── Auth/
    │   ├── LoginData.php
    │   ├── RegistrationData.php
    │   └── PasswordResetData.php
    ├── Orders/
    │   ├── OrderData.php
    │   ├── OrderItemData.php
    │   └── PaymentData.php
    ├── Api/
    │   ├── UserResponse.php
    │   ├── OrderResponse.php
    │   └── ProductResponse.php
    └── Forms/
        ├── ContactFormData.php
        └── ProfileUpdateData.php
```

### Action and DTO Pairing

Create consistent patterns for actions and their associated DTOs:

```php
// Consistent naming and organization
namespace App\Actions\Users;
class CreateUser { /* ... */ }

namespace App\Dtos\Users;
class UserCreationData { /* ... */ }

// Usage pattern
$userData = UserCreationData::fromArray($request->validated());
$user = CreateUser::run($userData);
```

### Queue Organization

Organize queueable actions by processing requirements:

```php
// Fast operations - default queue
SendEmailNotification::dispatch($user, $message);

// Heavy processing - dedicated queue
ProcessVideoUpload::dispatchOn('media-processing', $video);
GenerateLargeReport::dispatchOn('reports', $reportData);

// Critical operations - high priority queue
ProcessPayment::dispatchOn('high-priority', $order, $payment);
SendUrgentAlert::dispatchOn('urgent', $alertData);
```

## What's Next?

- **[Testing Guide](/guide/testing)** - Master testing your actions and DTOs