# make:action Command

The `make:action` command is your primary tool for generating action classes in Actionable. It creates properly structured action files with the correct namespace and boilerplate code.

## Basic Usage

```bash
php artisan make:action ActionName
```

This creates a basic action file at `app/Actions/ActionName.php` with the `IsRunnable` trait.

## Command Syntax

```bash
php artisan make:action <name> [options]
```

### Arguments

- **`name`** - The name/path of the action to create

### Options

- **`--dispatchable`** - Add the `IsDispatchable` trait for queue support
- **`--invokable`** - Create an invokable action (uses `__invoke` instead of `handle`)

## Examples

### Basic Action

```bash
php artisan make:action SendWelcomeEmail
```

Creates `app/Actions/SendWelcomeEmail.php`:

```php
<?php

namespace App\Actions;

use LumoSolutions\Actionable\Traits\IsRunnable;

class SendWelcomeEmail
{
    use IsRunnable;

    public function handle(): void
    {
        // Action logic here
    }
}
```

### Nested Actions

Use forward slashes to create actions in subdirectories:

```bash
php artisan make:action Email/SendWelcomeEmail
```

Creates `app/Actions/Email/SendWelcomeEmail.php`:

```php
<?php

namespace App\Actions\Email;

use LumoSolutions\Actionable\Traits\IsRunnable;

class SendWelcomeEmail
{
    use IsRunnable;

    public function handle(): void
    {
        // Action logic here
    }
}
```

### Deep Nesting

```bash
php artisan make:action Orders/Processing/CalculateShipping
```

Creates `app/Actions/Orders/Processing/CalculateShipping.php`:

```php
<?php

namespace App\Actions\Orders\Processing;

use LumoSolutions\Actionable\Traits\IsRunnable;

class CalculateShipping
{
    use IsRunnable;

    public function handle(): void
    {
        // Action logic here
    }
}
```

## Dispatchable Actions

Use the `--dispatchable` flag to create queueable actions:

```bash
php artisan make:action SendWelcomeEmail --dispatchable
```

Creates `app/Actions/SendWelcomeEmail.php`:

```php
<?php

namespace App\Actions;

use LumoSolutions\Actionable\Traits\IsRunnable;
use LumoSolutions\Actionable\Traits\IsDispatchable;

class SendWelcomeEmail
{
    use IsRunnable, IsDispatchable;

    public function handle(): void
    {
        // Action logic here
    }
}
```

Now you can both run and dispatch the action:

```php
// Run synchronously
SendWelcomeEmail::run($email, $name);

// Dispatch to queue
SendWelcomeEmail::dispatch($email, $name);
```

### Dispatchable with Nested Paths

```bash
php artisan make:action Notifications/Email/SendNewsletter --dispatchable
```

Creates `app/Actions/Notifications/Email/SendNewsletter.php` with both traits.

## Invokable Actions

Use the `--invokable` flag to create invokable actions:

```bash
php artisan make:action CalculateTotal --invokable
```

Creates `app/Actions/CalculateTotal.php`:

```php
<?php

namespace App\Actions;

class CalculateTotal
{
    public function __invoke(): mixed
    {
        // Action logic here
    }
}
```

Invokable actions are called directly as functions:

```php
$calculate = app(CalculateTotal:class);
$total = $calculate($order);

// Or using the container directly
$total = app(CalculateTotal::class)($order);
```

### When to Use Invokable Actions

Invokable actions are useful when:
- You need dependency injection in the constructor
- The action fits well with Laravel's service container
- You prefer the callable object pattern
- You don't need the static `run()` method

Regular actions with `IsRunnable` are recommended for most use cases.

## What's Next?

- **[make:dto Command](/guide/make-dto)** - Learn about creating DTOs
- **[Actions Guide](/guide/actions)** - Deep dive into using actions
- **[Queue Guide](/guide/queues)** - Learn about dispatchable actions