# Exporting Stub Records

Actionable provides customizable stub files that define the templates used by the `make:action` and `make:dto` commands. You can export and customize these stubs to match your team's coding standards and preferences.

## Exporting Stubs

To export the default stub files to your project:

```bash
php artisan vendor:publish --provider="LumoSolutions\Actionable\ActionableServiceProvider" --tag="stubs"
```

This publishes all stub files to the `stubs/lumosolutions/actionable/` directory in your project.

## Default Stub Files

After publishing, you'll find these stub files:

```
stubs/
└── lumosolutions/
    └── actionable/
        ├── action.stub
        ├── action.dispatchable.stub
        ├── action.invokable.stub
        └── dto.stub
```

## Stub File Details

### action.stub

The basic action template used by `php artisan make:action ActionName`:

```php
<?php

namespace {{ namespace }};

use LumoSolutions\Actionable\Traits\IsRunnable;

class {{ class }}
{
    use IsRunnable;

    public function handle(): void
    {
        // Action logic here
    }
}
```

**Used by:**
- `php artisan make:action ActionName`

### action.dispatchable.stub

The queueable action template used by `php artisan make:action ActionName --dispatchable`:

```php
<?php

namespace {{ namespace }};

use LumoSolutions\Actionable\Traits\IsRunnable;
use LumoSolutions\Actionable\Traits\IsDispatchable;

class {{ class }}
{
    use IsRunnable, IsDispatchable;

    public function handle(): void
    {
        // Action logic here
    }
}
```

**Used by:**
- `php artisan make:action ActionName --dispatchable`

### action.invokable.stub

The invokable action template used by `php artisan make:action ActionName --invokable`:

```php
<?php

namespace {{ namespace }};

class {{ class }}
{
    public function __invoke(): mixed
    {
        // Action logic here
    }
}
```

**Used by:**
- `php artisan make:action ActionName --invokable`

### dto.stub

The DTO template used by `php artisan make:dto DtoName`:

```php
<?php

namespace {{ namespace }};

use LumoSolutions\Actionable\Traits\ArrayConvertible;

readonly class {{ class }}
{
    use ArrayConvertible;

    public function __construct(
        // public string $property,
    ) {}
}
```

**Used by:**
- `php artisan make:dto DtoName`

## What's Next?

- **[make:action Command](/guide/make-action)** - Learn how your custom stubs are used
- **[make:dto Command](/guide/make-dto)** - Understand DTO generation with custom templates
- **[Actions Guide](/guide/actions)** - See how customized actions fit into your workflow