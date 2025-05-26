# Actionable vs Laravel Actions: Why Choose Actionable?

Both packages solve the same fundamental problem: organizing Laravel business logic into clean, reusable actions. However, **Actionable** takes a simpler, more developer-friendly approach.

## 🎯 Core Philosophy

**Laravel Actions** requires you to define multiple `asX()` methods and think about _how_ your action will run:
```php
class SendEmail extends Action
{
    use AsAction;
    
    public function asController() { /* controller logic */ }
    public function asJob() { /* job logic */ }
    public function asListener() { /* listener logic */ }
    public function handle() { /* actual logic */ }
}
```

**Actionable** focuses on _what_ your action does with simple traits:
```php
class SendEmail
{
    use IsRunnable, IsDispatchable;
    
    public function handle() { /* your logic here */ }
}
```

## ✅ Key Advantages of Actionable

### 🚀 **Simpler API**
- **Actionable**: `SendEmail::run($data)` or `SendEmail::dispatch($data)`
- **Laravel Actions**: `SendEmail::run($data)` or `SendEmail::dispatch($data)` but requires a separate `asX()` method for each context.

### 🎨 **Powerful DTOs with Array Conversion**
**Actionable** includes robust DTO support out of the box:
```php
class OrderData
{
    use ArrayConvertible;
    
    public function __construct(
        #[FieldName('customer_email')]
        public string $customerEmail,
        
        #[DateFormat('Y-m-d')]
        public DateTime $orderDate
    ) {}
}

$orderData = OrderData::fromArray($request->validated());
return response()->json($orderData->toArray());
```

**Laravel Actions** doesn't provide DTO functionality - you'd need additional packages.

### 🛠️ **Better Developer Experience**
- **Smart IDE completion** with dedicated artisan commands
- **Attribute-based field mapping** for API responses
- **Zero configuration** - works immediately after installation
- **Clean, focused traits** instead of multiple method definitions

### 📦 **All-in-One Solution**
**Actionable** provides:
- ✅ Runnable actions
- ✅ Dispatchable actions
- ✅ Powerful DTOs with array conversion
- ✅ Smart attribute system
- ✅ IDE helper generation

**Laravel Actions** provides:
- ✅ Multi-context execution (controller/job/listener/command)
- ❌ No DTO support
- ❌ No array conversion utilities
- ❌ More complex setup for each use case

### 🎯 **Focused Approach**
While Laravel Actions tries to be everything (controller, job, listener, command), **Actionable** focuses on the two most common use cases:
- **Synchronous execution** (`::run()`)
- **Asynchronous execution** (`::dispatch()`)

This results in cleaner, more maintainable code without the overhead of unused functionality.

## 🏁 The Bottom Line

Choose **Actionable** if you want:
- ✅ Simpler, cleaner syntax
- ✅ Built-in DTO support with array conversion
- ✅ Better developer experience
- ✅ Zero configuration setup
- ✅ Focus on the most common action patterns

Choose **Laravel Actions** if you need:
- ✅ Actions as Artisan commands
- ✅ Actions as event listeners with complex authorization/validation flows
- ✅ Multiple execution contexts in a single class

**Actionable makes the common case simple, while Laravel Actions makes the complex case possible.**