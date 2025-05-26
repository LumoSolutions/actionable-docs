# Installation

Get Actionable up and running in your Laravel project quickly and easily.

## Requirements

Before installing Actionable, make sure your system meets these requirements:

- **PHP:** 8.3 or higher
- **Laravel:** 12.0 or higher
- **Composer:** Latest version recommended

## Install via Composer

Install Actionable using Composer:

```bash
composer require lumosolutions/actionable
```

That's it! Actionable is now installed and ready to use.

## No Configuration Required

Unlike many Laravel packages, Actionable works out of the box with zero configuration:

- ✅ No config files to publish
- ✅ No service providers to register
- ✅ No migrations to run
- ✅ No environment variables to set

Laravel's auto-discovery feature automatically registers Actionable's service providers and commands.

## Directory Structure

After installation, Actionable expects and will create these directories when you generate your first files:

```
app/
├── Actions/     # Your action classes
└── Dtos/        # Your DTO classes
```

Technically, Actions and Dtos can be placed anywhere under the app folder of your Laravel application, 
but the default locations help keep your code organized, and at present, the Artisan commands will only generate files 
within these directories.
within these directories.

## Upgrading

To upgrade to the latest version:

```bash
composer update lumosolutions/actionable
```

Always check the [release documentation](https://github.com/LumoSolutions/actionable/releases) for any breaking changes between versions. You can also see
the [upgrade guide](/guide/upgrade.md) for more information regarding safe upgrades and future-proofing your code.

## What's Next?

Now that Actionable is installed, you're ready to start building:

- **[Getting Started Guide](/guide/getting-started)** - Create your first action
- **[Actions Documentation](/guide/actions)** - Learn action patterns
- **[DTO Documentation](/guide/dtos)** - Learn dto patterns

## Need Help?

- 🐛 Report issues on [GitHub](https://github.com/LumoSolutions/actionable/issues)
- 💬 Join discussions in the [GitHub Discussions](https://github.com/LumoSolutions/actionable/discussions)