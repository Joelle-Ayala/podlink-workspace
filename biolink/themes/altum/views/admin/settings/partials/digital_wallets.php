<?php defined('ALTUMCODE') || die() ?>

<div>
    <div <?= !\Altum\Plugin::is_active('digital-wallets') ? 'data-toggle="tooltip" title="' . sprintf(l('admin_plugins.no_access'), \Altum\Plugin::get('digital-wallets')->name ?? 'digital-wallets') . '"' : null ?>>
        <div class="<?= !\Altum\Plugin::is_active('digital-wallets') ? 'container-disabled' : null ?>">

            <div class="alert alert-info mb-3"><?= sprintf(l('admin_settings.documentation'), '<a href="' . PRODUCT_DOCUMENTATION_URL . '#digital-wallets' . '" target="_blank">', '</a>') ?></div>

            <div class="form-group custom-control custom-switch">
                <input id="is_enabled" name="is_enabled" type="checkbox" class="custom-control-input" <?= \Altum\Plugin::is_active('digital-wallets') && settings()->digital_wallets->is_enabled ? 'checked="checked"' : null?>>
                <label class="custom-control-label" for="is_enabled"><?= l('admin_settings.digital_wallets.is_enabled') ?></label>
                <small class="form-text text-muted"><?= l('admin_settings.digital_wallets.is_enabled_help') ?></small>
            </div>

            <div class="form-group custom-control custom-switch">
                <input id="google_wallet_is_enabled" name="google_wallet_is_enabled" type="checkbox" class="custom-control-input" <?= settings()->digital_wallets->google_wallet_is_enabled ?? false ? 'checked="checked"' : null?>>
                <label class="custom-control-label" for="google_wallet_is_enabled"><?= l('admin_settings.digital_wallets.google_wallet_is_enabled') ?></label>
                <small class="form-text text-muted"><?= l('admin_settings.digital_wallets.google_wallet_is_enabled_help') ?></small>
            </div>

            <button class="btn btn-block btn-gray-200 font-size-little-small font-weight-450 mb-4" type="button" data-toggle="collapse" data-target="#google_wallet_settings_container" aria-expanded="false" aria-controls="google_wallet_settings_container">
                <i class="fab fa-fw fa-google fa-sm mr-1"></i> <?= l('admin_settings.digital_wallets.google_wallet_settings') ?>
            </button>

            <div class="collapse" id="google_wallet_settings_container">
                <div class="form-group">
                    <label for="google_wallet_issuer_id"><i class="fas fa-fw fa-sm fa-fingerprint text-muted mr-1"></i> <?= l('admin_settings.digital_wallets.google_wallet_issuer_id') ?></label>
                    <input id="google_wallet_issuer_id" type="text" name="google_wallet_issuer_id" class="form-control" value="<?= settings()->digital_wallets->google_wallet_issuer_id ?? null ?>" />
                    <small class="form-text text-muted"><?= l('admin_settings.digital_wallets.google_wallet_issuer_id_help') ?></small>
                </div>

                <div class="form-group">
                    <label for="google_wallet_class_suffix"><i class="fas fa-fw fa-sm fa-layer-group text-muted mr-1"></i> <?= l('admin_settings.digital_wallets.google_wallet_class_suffix') ?></label>
                    <input id="google_wallet_class_suffix" type="text" name="google_wallet_class_suffix" class="form-control" value="<?= settings()->digital_wallets->google_wallet_class_suffix ?? 'digital_wallet' ?>" />
                    <small class="form-text text-muted"><?= l('admin_settings.digital_wallets.google_wallet_class_suffix_help') ?></small>
                </div>

                <div class="form-group" data-file-image-input-wrapper data-file-input-wrapper-size-limit="<?= get_max_upload() ?>" data-file-input-wrapper-size-limit-error="<?= sprintf(l('global.error_message.file_size_limit'), get_max_upload()) ?>">
                    <label for="google_wallet_service_account"><i class="fas fa-fw fa-sm fa-key text-muted mr-1"></i> <?= l('admin_settings.digital_wallets.google_wallet_service_account') ?></label>
                    <?= include_view(THEME_PATH . 'views/partials/file_input.php', ['uploads_file_key' => 'google_wallet_service_account', 'file_key' => 'google_wallet_service_account', 'already_existing_file' => settings()->digital_wallets->google_wallet_service_account ?? null]) ?>
                    <small class="form-text text-muted"><?= sprintf(l('global.accessibility.whitelisted_file_extensions'), \Altum\Uploads::get_whitelisted_file_extensions_accept('google_wallet_service_account')) . ' ' . sprintf(l('global.accessibility.file_size_limit'), get_max_upload()) ?></small>
                </div>

            </div>

            <button class="btn btn-block btn-gray-200 font-size-little-small font-weight-450 mb-4" type="button" data-toggle="collapse" data-target="#digital_wallets_file_size_limits_container" aria-expanded="false" aria-controls="digital_wallets_file_size_limits_container">
                <i class="fas fa-fw fa-file fa-sm mr-1"></i> <?= l('admin_settings.digital_wallets.file_size_limits') ?>
            </button>

            <div class="collapse" id="digital_wallets_file_size_limits_container">
                <?php foreach(['logo', 'image'] as $key): ?>
                    <?php $size_limit = settings()->digital_wallets->{$key . '_size_limit'} ?? get_max_upload() ?>

                    <div class="form-group">
                        <label for="<?= $key . '_size_limit' ?>"><?= l('admin_settings.digital_wallets.' . $key . '_size_limit') ?></label>
                        <div class="input-group">
                            <input id="<?= $key . '_size_limit' ?>" type="number" min="0" max="<?= get_max_upload() ?>" step="any" name="<?= $key . '_size_limit' ?>" class="form-control" value="<?= $size_limit ?>" />
                            <div class="input-group-append">
                                <span class="input-group-text"><?= l('global.mb') ?></span>
                            </div>
                        </div>
                        <small class="form-text text-muted"><?= l('global.accessibility.admin_file_size_limit_help') ?></small>
                    </div>
                <?php endforeach ?>
            </div>

        </div>
    </div>
</div>

<?php if(\Altum\Plugin::is_active('digital-wallets')): ?>
    <button type="submit" name="submit" class="btn btn-lg btn-block btn-primary mt-4"><?= l('global.update') ?></button>
<?php endif ?>
