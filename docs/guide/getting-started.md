# Getting Started

Welcome to Actionable! This guide will help you get up and running with clean, testable actions in your 
Laravel application in just a few minutes.

## Prerequisites

- PHP 8.3 or higher
- Laravel 12.0 or higher
- Composer

## Installation

Install Actionable via Composer:

```bash
composer require lumosolutions/actionable
```

That's it! No configuration files, no service providers to register. Actionable is ready to use immediately.

## Your First Action

Let's create a simple action to send a welcome email to new users.

### 1. Generate the Action

Use the Artisan command to create your first action:

```bash
php artisan make:action SendWelcomeEmail
```

This creates a new file at `app/Actions/SendWelcomeEmail.php`.

### 2. Define Your Business Logic

Open the generated file and add your logic:

```php
<?php

namespace App\Actions;

use LumoSolutions\Actionable\Traits\IsRunnable;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeEmail;

class SendWelcomeEmail
{
    use IsRunnable;

    public function handle(string $email, string $name): void
    {
        Mail::to($email)->send(new WelcomeEmail($name));
    }
}
```

### 3. Use Your Action

Now you can use your action anywhere in your application:

```php
// In a controller
SendWelcomeEmail::run('user@example.com', 'John Doe');

// In another action
SendWelcomeEmail::run($user->email, $user->name);

// In a test
SendWelcomeEmail::run('test@example.com', 'Test User');
```

## Dispatchable Actions

Want to run your action in the background? Just add the `IsDispatchable` trait:

```php
<?php

namespace App\Actions;

use LumoSolutions\Actionable\Traits\IsRunnable;
use LumoSolutions\Actionable\Traits\IsDispatchable;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeEmail;

class SendWelcomeEmail
{
    use IsRunnable, IsDispatchable;

    public function handle(string $email, string $name): void
    {
        Mail::to($email)->send(new WelcomeEmail($name));
    }
}
```

There is no need to make any other changes to your action, it now supports being dispatched it to a queue
for background processing by simply using the `dispatch` or `dispatchOn` methods:

```php
// Run synchronously
SendWelcomeEmail::run('user@example.com', 'John Doe');

// Dispatch to default queue
SendWelcomeEmail::dispatch('user@example.com', 'John Doe');

// Dispatch to specific queue
SendWelcomeEmail::dispatchOn('emails', 'user@example.com', 'John Doe');
```

## Your First DTO

Data Transfer Objects (DTOs) help you organise and validate data. Let's create one:

### 1. Generate the DTO

```bash
php artisan make:dto UserRegistrationData
```

### 2. Define Your Data Structure

```php
<?php

namespace App\DataTransferObjects;

use LumoSolutions\Actionable\Traits\ArrayConvertible;
use LumoSolutions\Actionable\Attributes\FieldName;

class UserRegistrationData
{
    use ArrayConvertible;

    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        
        #[FieldName('phone_number')]
        public ?string $phoneNumber = null
    ) {}
}
```

### 3. Use Your DTO

```php
// From request data
$userData = UserRegistrationData::fromArray($request->validated());

// Pass to action
RegisterUser::run($userData);

// Convert back to array for API response
return response()->json($userData->toArray());
```

## Next Steps

Now that you have the basics down, explore more features:

- **[Actions Guide](/guide/actions)** - Deep dive into action patterns
- **[DTOs Guide](/guide/dtos)** - Master data transfer objects
- **[Attributes](/guide/attributes)** - Learn about powerful attributes