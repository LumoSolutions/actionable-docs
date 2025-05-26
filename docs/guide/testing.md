# Testing

Testing is one of the biggest advantages of using Actionable. Actions and DTOs are isolated, focused classes that are easy to test in isolation. This guide covers comprehensive testing strategies for your Actionable code.

## Why Actions Are Easy to Test

Actions excel at testing because they:

- **Have clear inputs and outputs** - Easy to set up test data
- **Are isolated** - No hidden dependencies or side effects
- **Do one thing** - Simple to understand what you're testing
- **Support dependency injection** - Easy to mock dependencies

## Testing Actions

### Basic Action Testing

```php
<?php

namespace Tests\Unit\Actions;

use Tests\TestCase;
use App\Actions\CalculateOrderTotal;
use App\Models\Order;
use App\Models\OrderItem;

class CalculateOrderTotalTest extends TestCase
{
    public function test_calculates_order_total_correctly()
    {
        // Arrange
        $order = Order::factory()->create([
            'tax_rate' => 0.08, // 8% tax
        ]);
        
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'price' => 10.00,
            'quantity' => 2, // $20.00
        ]);
        
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'price' => 15.00,
            'quantity' => 1, // $15.00
        ]);
        
        // Act
        $total = CalculateOrderTotal::run($order);
        
        // Assert
        $expected = 35.00 + (35.00 * 0.08) + 5.00; // subtotal + tax + shipping
        $this->assertEquals($expected, $total);
    }

    public function test_applies_free_shipping_for_large_orders()
    {
        $order = Order::factory()->create(['tax_rate' => 0.08]);
        
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'price' => 100.00,
            'quantity' => 1,
        ]);
        
        $total = CalculateOrderTotal::run($order);
        
        // Should not include shipping for orders over $50
        $expected = 100.00 + (100.00 * 0.08); // No shipping
        $this->assertEquals($expected, $total);
    }
}
```

### Testing Actions with Dependencies

Use Laravel's service container to inject mocked dependencies:

```php
<?php

namespace Tests\Unit\Actions;

use Tests\TestCase;
use App\Actions\SendWelcomeEmail;
use App\Services\EmailService;
use Mockery;

class SendWelcomeEmailTest extends TestCase
{
    public function test_sends_welcome_email_successfully()
    {
        // Arrange
        $emailService = Mockery::mock(EmailService::class);
        $emailService->shouldReceive('send')
            ->once()
            ->with('user@example.com', 'Welcome!', Mockery::type('string'))
            ->andReturn(true);
        
        $this->app->instance(EmailService::class, $emailService);
        
        // Act
        $result = SendWelcomeEmail::run('user@example.com', 'John Doe');
        
        // Assert
        $this->assertTrue($result);
    }

    public function test_handles_email_failure_gracefully()
    {
        // Arrange
        $emailService = Mockery::mock(EmailService::class);
        $emailService->shouldReceive('send')
            ->once()
            ->andThrow(new \Exception('SMTP connection failed'));
        
        $this->app->instance(EmailService::class, $emailService);
        
        // Act & Assert
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('SMTP connection failed');
        
        SendWelcomeEmail::run('user@example.com', 'John Doe');
    }
}
```

### Testing Actions with Database Operations

```php
class CreateUserTest extends TestCase
{
    use RefreshDatabase;

    public function test_creates_user_with_valid_data()
    {
        // Arrange
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
        ];
        
        // Act
        $user = CreateUser::run($userData);
        
        // Assert
        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('John Doe', $user->name);
        $this->assertEquals('john@example.com', $user->email);
        $this->assertTrue(Hash::check('password123', $user->password));
        
        // Verify database
        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);
    }

    public function test_throws_exception_for_duplicate_email()
    {
        // Arrange
        User::factory()->create(['email' => 'existing@example.com']);
        
        $userData = [
            'name' => 'New User',
            'email' => 'existing@example.com',
            'password' => 'password123',
        ];
        
        // Act & Assert
        $this->expectException(\Illuminate\Database\QueryException::class);
        CreateUser::run($userData);
    }
}
```

## Testing DTOs

### Basic DTO Testing

```php
<?php

namespace Tests\Unit\DataTransferObjects;

use Tests\TestCase;
use App\DataTransferObjects\UserRegistrationData;

class UserRegistrationDataTest extends TestCase
{
    public function test_creates_dto_with_required_fields()
    {
        // Act
        $dto = new UserRegistrationData(
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123'
        );
        
        // Assert
        $this->assertEquals('John Doe', $dto->name);
        $this->assertEquals('john@example.com', $dto->email);
        $this->assertEquals('password123', $dto->password);
        $this->assertFalse($dto->acceptsMarketing); // default value
    }

    public function test_creates_dto_with_all_fields()
    {
        // Act
        $dto = new UserRegistrationData(
            name: 'Jane Doe',
            email: 'jane@example.com',
            password: 'secret123',
            phone: '555-1234',
            acceptsMarketing: true
        );
        
        // Assert
        $this->assertEquals('555-1234', $dto->phone);
        $this->assertTrue($dto->acceptsMarketing);
    }
}
```

### Testing Array Conversion

```php
class UserRegistrationDataTest extends TestCase
{
    public function test_creates_from_array()
    {
        // Arrange
        $data = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'phone' => '555-5678',
            'acceptsMarketing' => true,
        ];
        
        // Act
        $dto = UserRegistrationData::fromArray($data);
        
        // Assert
        $this->assertEquals('Test User', $dto->name);
        $this->assertEquals('test@example.com', $dto->email);
        $this->assertEquals('555-5678', $dto->phone);
        $this->assertTrue($dto->acceptsMarketing);
    }

    public function test_converts_to_array()
    {
        // Arrange
        $dto = new UserRegistrationData(
            name: 'Convert User',
            email: 'convert@example.com',
            password: 'password123'
        );
        
        // Act
        $array = $dto->toArray();
        
        // Assert
        $expected = [
            'name' => 'Convert User',
            'email' => 'convert@example.com',
            'password' => 'password123',
            'phone' => null,
            'acceptsMarketing' => false,
        ];
        
        $this->assertEquals($expected, $array);
    }

    public function test_handles_missing_optional_fields()
    {
        // Arrange - minimal data
        $data = [
            'name' => 'Minimal User',
            'email' => 'minimal@example.com',
            'password' => 'password123',
        ];
        
        // Act
        $dto = UserRegistrationData::fromArray($data);
        
        // Assert
        $this->assertEquals('Minimal User', $dto->name);
        $this->assertNull($dto->phone);
        $this->assertFalse($dto->acceptsMarketing);
    }
}
```

### Testing DTOs with Attributes

```php
use LumoSolutions\Actionable\Attributes\FieldName;
use LumoSolutions\Actionable\Attributes\DateFormat;
use Carbon\Carbon;

class OrderDataTest extends TestCase
{
    public function test_field_name_mapping()
    {
        // Arrange
        $data = [
            'order_id' => 123,
            'customer_email' => 'customer@example.com',
            'order_date' => '2024-06-15',
        ];
        
        // Act
        $dto = OrderData::fromArray($data);
        
        // Assert
        $this->assertEquals(123, $dto->orderId);
        $this->assertEquals('customer@example.com', $dto->customerEmail);
    }

    public function test_date_format_conversion()
    {
        // Arrange
        $dto = new OrderData(
            orderId: 456,
            customerEmail: 'test@example.com',
            orderDate: Carbon::parse('2024-06-15 14:30:00')
        );
        
        // Act
        $array = $dto->toArray();
        
        // Assert
        $this->assertEquals('2024-06-15', $array['order_date']);
    }
}
```

## Testing Queueable Actions

### Test Queue Dispatch

```php
use Illuminate\Support\Facades\Queue;

class SendWelcomeEmailTest extends TestCase
{
    public function test_dispatches_to_queue()
    {
        // Arrange
        Queue::fake();
        
        // Act
        SendWelcomeEmail::dispatch('user@example.com', 'John Doe');
        
        // Assert
        Queue::assertPushed(SendWelcomeEmail::class, function ($job) {
            return $job->email === 'user@example.com' && 
                   $job->name === 'John Doe';
        });
    }

    public function test_dispatches_to_specific_queue()
    {
        // Arrange
        Queue::fake();
        
        // Act
        SendWelcomeEmail::dispatchOn('emails', 'user@example.com', 'John Doe');
        
        // Assert
        Queue::assertPushedOn('emails', SendWelcomeEmail::class);
    }

    public function test_job_execution()
    {
        // Arrange
        Mail::fake();
        
        // Act - Run the job directly (not through queue)
        SendWelcomeEmail::run('user@example.com', 'John Doe');
        
        // Assert
        Mail::assertSent(WelcomeEmail::class, function ($mail) {
            return $mail->hasTo('user@example.com');
        });
    }
}
```

### Test Failed Jobs

```php
class ProcessPaymentTest extends TestCase
{
    public function test_handles_payment_failure()
    {
        // Arrange
        $paymentService = Mockery::mock(PaymentService::class);
        $paymentService->shouldReceive('charge')
            ->andThrow(new PaymentFailedException('Card declined'));
        
        $this->app->instance(PaymentService::class, $paymentService);
        
        Log::shouldReceive('error')
            ->once()
            ->with('Payment failed', Mockery::type('array'));
        
        // Act & Assert
        $this->expectException(PaymentFailedException::class);
        ProcessPayment::run($order, 'card_123');
    }

    public function test_failed_method_called_on_final_failure()
    {
        // Arrange
        $action = new ProcessPayment();
        $exception = new PaymentFailedException('Final failure');
        
        Log::shouldReceive('critical')
            ->once()
            ->with('Payment processing failed permanently', Mockery::type('array'));
        
        // Act
        $action->failed($exception);
        
        // Assert - verify logging was called
        // (Mockery verification happens automatically)
    }
}
```

## What's Next?

- **[make:action](/guide/make-action)** - Learn about the make:action command for generating actions
- **[make:dto](/guide/make-dto)** - Learn about the make:dto command for generating dtos