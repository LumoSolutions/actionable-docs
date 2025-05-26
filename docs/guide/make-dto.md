# make:dto Command

The `make:dto` command generates Data Transfer Object (DTO) classes with the `ArrayConvertible` trait, 
making it easy to create type-safe data containers that can seamlessly convert between arrays and 
objects.

## Basic Usage

```bash
php artisan make:dto DtoName
```

This creates a DTO file at `app/Dtos/DtoName.php` with the `ArrayConvertible` trait and readonly 
class structure.

## Command Syntax

```bash
php artisan make:dto <name>
```

### Arguments

- **`name`** - The name/path of the DTO to create

## Examples

### Basic DTO

```bash
php artisan make:dto UserData
```

Creates `app/Dtos/UserData.php`:

```php
<?php

namespace App\Dtos;

use LumoSolutions\Actionable\Traits\ArrayConvertible;

readonly class UserData
{
    use ArrayConvertible;

    public function __construct(
        // public string $property,
    ) {}
}
```

### Nested DTOs

Use forward slashes to create DTOs in subdirectories:

```bash
php artisan make:dto User/ProfileData
```

Creates `app/Dtos/User/ProfileData.php`:

```php
<?php

namespace App\Dtos\User;

use LumoSolutions\Actionable\Traits\ArrayConvertible;

readonly class ProfileData
{
    use ArrayConvertible;

    public function __construct(
        // public string $property,
    ) {}
}
```

### Deep Nesting

```bash
php artisan make:dto Orders/Shipping/AddressData
```

Creates `app/Dtos/Orders/Shipping/AddressData.php`:

```php
<?php

namespace App\Dtos\Orders\Shipping;

use LumoSolutions\Actionable\Traits\ArrayConvertible;

readonly class AddressData
{
    use ArrayConvertible;

    public function __construct(
        // public string $property,
    ) {}
}
```

## What's Next?

- **[DTOs Guide](/guide/dtos)** - Learn comprehensive DTO usage
- **[Attributes Guide](/guide/attributes)** - Master DTO attributes
- **[make:action Command](/guide/make-action)** - Create actions to work with DTOs