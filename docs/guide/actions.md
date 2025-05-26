# Actions

Actions are the heart of Actionable - they encapsulate your business logic into clean, focused, and 
reusable classes. Each action does one thing and does it well.

## What is an Action?

An action is a simple PHP class that contains a single `handle()` method where you put your business logic. 
Actions promote:

- **Single Responsibility** - Each action has one clear purpose
- **Reusability** - Use the same action across controllers, jobs, tests, and other actions
- **Testability** - Easy to unit test in isolation
- **Readability** - Your code becomes self-documenting

It's generally a good practice to keep actions small and focused, ideally under 50 lines of code. 
If an action grows too large, consider breaking it down into smaller actions.

## Basic Actions

### Creating an Action

Generate a new action using the Artisan command:

```bash
php artisan make:action CalculateOrderTotal
```

This creates a file at `app/Actions/CalculateOrderTotal.php`:

```php
<?php

namespace App\Actions;

use LumoSolutions\Actionable\Traits\IsRunnable;

class CalculateOrderTotal
{
    use IsRunnable;

    public function handle()
    {
        // Your business logic here
    }
}
```

### Implementing Business Logic

Add your logic to the `handle()` method:

```php
<?php

namespace App\Actions;

use LumoSolutions\Actionable\Traits\IsRunnable;
use App\Models\Order;

class CalculateOrderTotal
{
    use IsRunnable;

    public function handle(Order $order): float
    {
        $subtotal = $order->items->sum(function ($item) {
            return $item->price * $item->quantity;
        });

        $tax = $subtotal * $order->tax_rate;
        $shipping = $this->calculateShipping($order);

        return $subtotal + $tax + $shipping;
    }

    private function calculateShipping(Order $order): float
    {
        // Shipping calculation logic
        return $order->weight > 10 ? 15.00 : 5.00;
    }
}
```

### Running Actions

Use the static `run()` method to execute your action:

```php
$total = CalculateOrderTotal::run($order);
```

You can call actions from anywhere:

```php
// In controllers
class OrderController extends Controller
{
    public function show(Order $order)
    {
        $total = CalculateOrderTotal::run($order);
        
        return view('orders.show', compact('order', 'total'));
    }
}

// In other actions
class ProcessPayment
{
    use IsRunnable;

    public function handle(Order $order, string $paymentMethod): Payment
    {
        $total = CalculateOrderTotal::run($order);
        
        return $this->chargePayment($total, $paymentMethod);
    }
}

// In tests
class CalculateOrderTotalTest extends TestCase
{
    public function test_calculates_total_correctly()
    {
        $order = Order::factory()->create();
        
        $total = CalculateOrderTotal::run($order);
        
        $this->assertEquals(125.50, $total);
    }
}
```

## Action Parameters

Actions can accept any number of parameters in their `handle()` method, and these same parameters extend
down to the run, dispatch and dispatchOn methods. This allows you to pass in any data your action needs to perform its 
task, regardless on if you need it to run synchronously or asynchronously.

Actions support both required and optional parameters, and you can specify default values for optional ones
where required. 

```php
class SendNotification
{
    use IsRunnable;

    public function handle(
        User $user, 
        string $message, 
        string $channel = 'email',
        array $options = []
    ): bool {
        // Send notification logic
        return true;
    }
}

// Usage
SendNotification::run($user, 'Welcome!');
SendNotification::run($user, 'Order shipped', 'sms');
SendNotification::run($user, 'Special offer', 'email', ['priority' => 'high']);
```

## Return Values

Actions can return any type of value, however, where the action is running asynchronously, the return value will
not be available immediately and this should be considered when designing your actions.

```php
// Return a model
class CreateUser
{
    use IsRunnable;

    public function handle(array $userData): User
    {
        return User::create($userData);
    }
}

// Return a collection
class GetActiveUsers
{
    use IsRunnable;

    public function handle(): Collection
    {
        return User::where('active', true)->get();
    }
}

// Return void for side effects
class LogUserActivity
{
    use IsRunnable;

    public function handle(User $user, string $activity): void
    {
        Log::info("User {$user->id} performed: {$activity}");
    }
}

// Return arrays/data
class GenerateReport
{
    use IsRunnable;

    public function handle(Carbon $startDate, Carbon $endDate): array
    {
        return [
            'total_sales' => $this->calculateSales($startDate, $endDate),
            'customer_count' => $this->countCustomers($startDate, $endDate),
            'top_products' => $this->getTopProducts($startDate, $endDate),
        ];
    }
}
```

## Constructor Injection

Actions support Laravel's dependency injection in the constructor:

```php
class SendEmail
{
    use IsRunnable;

    public function __construct(
        private MailService $mailService,
        private LoggerInterface $logger
    ) {}

    public function handle(string $email, string $subject, string $body): bool
    {
        try {
            $this->mailService->send($email, $subject, $body);
            $this->logger->info("Email sent to {$email}");
            return true;
        } catch (Exception $e) {
            $this->logger->error("Failed to send email: {$e->getMessage()}");
            return false;
        }
    }
}
```

## Action Composition

Actions work great together. Build complex workflows by composing simple actions including a
combination of synchronous and asynchronous actions:

```php
class ProcessOrder
{
    use IsRunnable;

    public function handle(Order $order): array
    {
        // Validate the order
        ValidateOrder::run($order);
        
        // Calculate totals
        $total = CalculateOrderTotal::run($order);
        
        // Process payment
        $payment = ProcessPayment::run($order, $total);
        
        // Update inventory
        UpdateInventory::dispatch($order);
        
        // Send notifications
        SendOrderConfirmation::dispatch($order);
        SendInventoryAlert::dispatch($order);
        
        return [
            'order' => $order,
            'payment' => $payment,
            'total' => $total,
        ];
    }
}
```

## What's Next?

- **[DTOs](/guide/dtos)** - Learn about Data Transfer Objects
- **[Queues](/guide/queues)** - Make your actions queueable
- **[Testing](/guide/testing)** - Test your actions effectively