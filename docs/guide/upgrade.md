# Version Upgrade Guide

This guide documents the steps required to upgrade between different versions of Actionable. As the package evolves, any breaking changes or migration steps will be documented here.

## Current Version Compatibility

**Good news!** All v1.x releases of Actionable are fully compatible with each other. There are currently no breaking changes or incompatibilities between any v1 releases.

### v1.x Series (All Compatible)

- **v1.0.x** ↔ **v1.1.x** ✅ Fully compatible

You can safely upgrade between any v1 versions without code changes.

## Safe Upgrade Process

To upgrade to the latest v1 version:

```bash
# Update to latest v1 release
composer update lumosolutions/actionable

# Regenerate IDE helpers (recommended)
php artisan ide-helper:actions

# Clear caches (if needed)
php artisan cache:clear
php artisan config:clear
```

## What to Expect in Future Versions

When v2.0 is released, this guide will be updated with:

- **Breaking changes** and their impact
- **Step-by-step migration instructions**
- **Code transformation examples**
- **New features** and how to use them
- **Deprecation notices** and replacement patterns

## Staying Updated

### Monitor for Updates

To stay informed about new releases and potential breaking changes:

- **Watch the repository** on [GitHub](https://github.com/LumoSolutions/actionable)
- **Review the changelog** before upgrading
- **Test upgrades** in development environments first

### Version Constraints

We recommend using semantic versioning constraints in your `composer.json`:

```json
{
    "require": {
        "lumosolutions/actionable": "^1.0"
    }
}
```

This allows automatic updates within the v1 series while protecting against potentially breaking v2 changes.

### Pre-upgrade Checklist

Before upgrading to any future major version:

1. **Review the changelog** for breaking changes
2. **Check this upgrade guide** for migration steps
3. **Update in development** environment first
4. **Run your test suite** to catch any issues
5. **Test key functionality** manually
6. **Update production** only after thorough testing

## Getting Help with Upgrades

If you encounter issues during upgrades:

- **Check the changelog** for known issues
- **Review this guide** for specific migration steps
- **Search existing issues** on GitHub
- **Open a new issue** if you find bugs
- **Join discussions** for upgrade help

## Compatibility Promise

Actionable follows [semantic versioning](https://semver.org/):

- **Patch releases** (v1.0.1, v1.0.2) - Bug fixes only, no breaking changes
- **Minor releases** (v1.1.0, v1.2.0) - New features, no breaking changes
- **Major releases** (v2.0.0, v3.0.0) - May contain breaking changes

Within the v1 series, your code will continue to work without modification.

---

**Note:** This upgrade guide will be updated as new versions are released. Currently, all v1.x releases are fully compatible, so no upgrade steps are necessary.