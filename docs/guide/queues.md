# Queues

Actionable seamlessly integrates with Laravel's queue system, allowing you to execute actions in the background for better performance and user experience. Converting a synchronous action to a queueable one is as simple as adding a trait.

## Making Actions Queueable

### Add the IsDispatchable Trait

To make an action queueable, add the `IsDispatchable` trait alongside `IsRunnable`:

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

Now your action can run both synchronously and asynchronously:

```php
// Run immediately (synchronous)
SendWelcomeEmail::run('user@example.com', 'John Doe');

// Dispatch to queue (asynchronous)
SendWelcomeEmail::dispatch('user@example.com', 'John Doe');
```

## Dispatch Methods

### Basic Dispatch

The simplest way to queue an action:

```php
SendWelcomeEmail::dispatch('user@example.com', 'John Doe');
```

### Dispatch to Specific Queue

Route actions to different queues based on priority or type:

```php
// Dispatch to a specific queue
SendWelcomeEmail::dispatchOn('emails', 'user@example.com', 'John Doe');

// High priority notifications
SendUrgentAlert::dispatchOn('high-priority', $message);

// Background processing
ProcessVideoUpload::dispatchOn('video-processing', $video);
```

## What's Next?

- **[Testing](/guide/testing)** - Learn comprehensive testing strategies
- **[Laravel Queue Documentation](https://laravel.com/docs/queues)** - Deep dive into Laravel's queue system