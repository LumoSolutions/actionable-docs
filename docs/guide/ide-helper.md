# ide-helper:actions Command

The `ide-helper:actions` command automatically generates PHPDoc blocks for your action classes to provide intelligent code completion in IDEs like PhpStorm, VS Code, and others. It analyzes your action classes and adds `@method` annotations for `run()`, `dispatch()`, and `dispatchOn()` methods based on the traits used and parameters from the `handle()` method.

## Basic Usage

```bash
php artisan ide-helper:actions
```

This scans all action classes in the `App\` namespace and adds appropriate PHPDoc blocks for IDE intellisense.

## Command Syntax

```bash
php artisan ide-helper:actions [options]
```

### Options

- **`--dry-run`** - Preview changes without writing to files
- **`--namespace=NAMESPACE`** - Specify custom namespace to scan (default: `App\`)

## How It Works

The command intelligently analyzes your action classes and:

1. **Scans for traits** - Detects `IsRunnable` and `IsDispatchable` traits
2. **Analyzes handle method** - Extracts parameters and return type
3. **Generates @method docs** - Creates appropriate static method annotations
4. **Updates files** - Writes PHPDoc blocks to action class files

### Generated Documentation

Based on the traits used in your actions:

- **`IsRunnable`** → Generates `@method static ReturnType run(parameters)`
- **`IsDispatchable`** → Generates `@method static void dispatch(parameters)` and `@method static void dispatchOn(string $queue, parameters)`

## Examples

### Basic Action

For an action like this:

```php
<?php

namespace App\Actions;

use LumoSolutions\Actionable\Traits\IsRunnable;

class CalculateTotal
{
    use IsRunnable;

    public function handle(float $subtotal, float $taxRate): float
    {
        return $subtotal * (1 + $taxRate);
    }
}
```

The command generates:

```php
<?php

namespace App\Actions;

use LumoSolutions\Actionable\Traits\IsRunnable;

/**
 * @method static float run(float $subtotal, float $taxRate)
 */
class CalculateTotal
{
    use IsRunnable;

    public function handle(float $subtotal, float $taxRate): float
    {
        return $subtotal * (1 + $taxRate);
    }
}
```

### Dispatchable Action

For a queueable action:

```php
<?php

namespace App\Actions;

use LumoSolutions\Actionable\Traits\IsRunnable;
use LumoSolutions\Actionable\Traits\IsDispatchable;

class SendWelcomeEmail
{
    use IsRunnable, IsDispatchable;

    public function handle(string $email, string $name): void
    {
        // Email sending logic
    }
}
```

The command generates:

```php
<?php

namespace App\Actions;

use LumoSolutions\Actionable\Traits\IsRunnable;
use LumoSolutions\Actionable\Traits\IsDispatchable;

/**
 * @method static void run(string $email, string $name)
 * @method static void dispatch(string $email, string $name)
 * @method static void dispatchOn(string $queue, string $email, string $name)
 */
class SendWelcomeEmail
{
    use IsRunnable, IsDispatchable;

    public function handle(string $email, string $name): void
    {
        // Email sending logic
    }
}
```

### Complex Action with DTOs

For actions using DTOs:

```php
<?php

namespace App\Actions;

use LumoSolutions\Actionable\Traits\IsRunnable;
use LumoSolutions\Actionable\Traits\IsDispatchable;
use App\Dtos\UserRegistrationData;
use App\Models\User;

class RegisterUser
{
    use IsRunnable, IsDispatchable;

    public function handle(UserRegistrationData $data, bool $sendWelcomeEmail = true): User
    {
        // Registration logic
    }
}
```

The command generates:

```php
/**
 * @method static User run(UserRegistrationData $data, bool $sendWelcomeEmail = true)
 * @method static void dispatch(UserRegistrationData $data, bool $sendWelcomeEmail = true)
 * @method static void dispatchOn(string $queue, UserRegistrationData $data, bool $sendWelcomeEmail = true)
 */
class RegisterUser
{
    // ... rest of class
}
```

## Dry Run Mode

Use `--dry-run` to preview changes without modifying files:

```bash
php artisan ide-helper:actions --dry-run
```

Example output:

```
Scanning for Action classes in namespace: App\
Would update: app\Actions\Authentication\LoginUser.php
  Doc blocks to add:
    * @method static User run(LoginDto $dto)
    * @method static void dispatch(LoginDto $dto)
    * @method static void dispatchOn(string $queue, LoginDto $dto)

Would update: app\Actions\Email\SendWelcomeEmail.php
  Doc blocks to add:
    * @method static void run(string $email, string $name)
    * @method static void dispatch(string $email, string $name)
    * @method static void dispatchOn(string $queue, string $email, string $name)

Would update: app\Actions\Orders\CalculateTotal.php
  Doc blocks to add:
    * @method static float run(Order $order)

Summary:
  Would be updated: 3 files
  Skipped: 12 files
Process completed successfully!
```

This shows you exactly what changes would be made before committing to them.

## Custom Namespace

Scan specific namespaces using the `--namespace` option:

```bash
# Scan only Email actions
php artisan ide-helper:actions --namespace="App\\Actions\\Email"

# Scan a custom namespace
php artisan ide-helper:actions --namespace="App\\Services\\Actions"

# Scan multiple levels
php artisan ide-helper:actions --namespace="App\\Modules\\Orders\\Actions"
```

Examples:

```bash
# Focus on specific domains
php artisan ide-helper:actions --namespace="App\\Actions\\Orders"
php artisan ide-helper:actions --namespace="App\\Actions\\Email"
php artisan ide-helper:actions --namespace="App\\Actions\\Payments"

# Custom directory structures
php artisan ide-helper:actions --namespace="App\\Domain\\User\\Actions"
php artisan ide-helper:actions --namespace="Modules\\Ecommerce\\Actions"
```

## What's Next?

- **[Actions Guide](/guide/actions)** - Learn about creating effective actions
- **[DTOs Guide](/guide/dtos)** - Understand DTOs that work with actions
- **[Testing Guide](/guide/testing)** - Test your documented actions